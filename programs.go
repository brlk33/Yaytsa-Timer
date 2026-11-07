//go:build windows

package main

import (
	"encoding/binary"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"sync"
	"unicode/utf16"
	"unsafe"

	"golang.org/x/sys/windows"
)

/*
Installed programs for the "add a program" search: every Start-menu shortcut (current user
and all users) whose target is an .exe. Shortcuts are parsed directly (MS-SHLLINK format),
no COM needed. A file dialog covers anything without a shortcut.
*/

var (
	installedOnce sync.Once
	installed     []appInfo

	pMultiByteToWideChar = kernel32.NewProc("MultiByteToWideChar")
	comdlg32             = windows.NewLazySystemDLL("comdlg32.dll")
	pGetOpenFileNameW    = comdlg32.NewProc("GetOpenFileNameW")
)

func ansiToString(b []byte) string {
	if len(b) == 0 {
		return ""
	}
	buf := make([]uint16, len(b)+1)
	n, _, _ := pMultiByteToWideChar.Call(0, 0, uintptr(unsafe.Pointer(&b[0])), uintptr(len(b)), uintptr(unsafe.Pointer(&buf[0])), uintptr(len(buf)))
	return string(utf16.Decode(buf[:n]))
}

func cstr(b []byte, off int) []byte {
	if off < 0 || off >= len(b) {
		return nil
	}
	end := off
	for end < len(b) && b[end] != 0 {
		end++
	}
	return b[off:end]
}

func wstr(b []byte, off int) string {
	var u []uint16
	for i := off; i+1 < len(b); i += 2 {
		c := binary.LittleEndian.Uint16(b[i:])
		if c == 0 {
			break
		}
		u = append(u, c)
	}
	return string(utf16.Decode(u))
}

// lnkTarget returns the target path of a .lnk file, or "".
func lnkTarget(path string) (string, bool) {
	t, f := lnkTarget0(path)
	return t, f&0x20 != 0 // HasArguments: web apps, "reset settings" links etc.
}

func lnkTarget0(path string) (target string, flags uint32) {
	b, err := os.ReadFile(path)
	if err != nil || len(b) < 0x4C || binary.LittleEndian.Uint32(b) != 0x4C {
		return "", flags
	}
	flags = binary.LittleEndian.Uint32(b[0x14:])
	off := 0x4C
	if flags&0x1 != 0 { // HasLinkTargetIDList
		if off+2 > len(b) {
			return "", flags
		}
		off += 2 + int(binary.LittleEndian.Uint16(b[off:]))
	}
	if flags&0x2 != 0 && off+0x1C <= len(b) { // HasLinkInfo
		li := b[off:]
		size := int(binary.LittleEndian.Uint32(li))
		hdr := binary.LittleEndian.Uint32(li[4:])
		liFlags := binary.LittleEndian.Uint32(li[8:])
		if size <= len(li) && liFlags&1 != 0 {
			li = li[:size]
			if hdr >= 0x24 && len(li) >= 0x24 {
				base := wstr(li, int(binary.LittleEndian.Uint32(li[0x1C:])))
				suffix := wstr(li, int(binary.LittleEndian.Uint32(li[0x20:])))
				target = base + suffix
			} else {
				base := ansiToString(cstr(li, int(binary.LittleEndian.Uint32(li[0x10:]))))
				suffix := ansiToString(cstr(li, int(binary.LittleEndian.Uint32(li[0x18:]))))
				target = base + suffix
			}
		}
		off += size
	}
	if target != "" {
		return target, flags
	}
	// Skip StringData, then look for EnvironmentVariableDataBlock (e.g. "%ProgramFiles%\...").
	unicode := flags&0x80 != 0
	for _, bit := range []uint32{0x4, 0x8, 0x10, 0x20, 0x40} {
		if flags&bit == 0 {
			continue
		}
		if off+2 > len(b) {
			return "", flags
		}
		n := int(binary.LittleEndian.Uint16(b[off:]))
		off += 2
		if unicode {
			off += n * 2
		} else {
			off += n
		}
	}
	for off+8 <= len(b) {
		size := int(binary.LittleEndian.Uint32(b[off:]))
		if size < 8 || off+size > len(b) {
			break
		}
		if binary.LittleEndian.Uint32(b[off+4:]) == 0xA0000001 && size >= 0x314 {
			t := wstr(b, off+8+260)
			if t == "" {
				t = ansiToString(cstr(b, off+8))
			}
			return os.ExpandEnv(strings.NewReplacer("%ProgramFiles%", "${ProgramFiles}", "%ProgramFiles(x86)%", "${ProgramFiles(x86)}",
				"%SystemRoot%", "${SystemRoot}", "%windir%", "${windir}", "%LOCALAPPDATA%", "${LOCALAPPDATA}", "%APPDATA%", "${APPDATA}",
				"%USERPROFILE%", "${USERPROFILE}", "%ProgramData%", "${ProgramData}").Replace(t)), flags
		}
		off += size
	}
	return "", flags
}

func skipShortcut(name string) bool {
	n := strings.ToLower(name)
	for _, w := range []string{"uninstall", "удал", "деинстал", "readme", "help", "справка", "documentation", "release notes", "website", "on the web", "changelog"} {
		if strings.Contains(n, w) {
			return true
		}
	}
	return false
}

func scanInstalled() []appInfo {
	var roots []string
	if d, err := windows.KnownFolderPath(windows.FOLDERID_Programs, 0); err == nil {
		roots = append(roots, d)
	}
	if d, err := windows.KnownFolderPath(windows.FOLDERID_CommonPrograms, 0); err == nil {
		roots = append(roots, d)
	}
	if d, err := windows.KnownFolderPath(windows.FOLDERID_Desktop, 0); err == nil {
		roots = append(roots, d)
	}
	if d, err := windows.KnownFolderPath(windows.FOLDERID_PublicDesktop, 0); err == nil {
		roots = append(roots, d)
	}
	seen := map[string]int{}
	withArgs := map[string]bool{}
	var out []appInfo
	for _, root := range roots {
		_ = filepath.WalkDir(root, func(p string, d os.DirEntry, err error) error {
			if err != nil || d.IsDir() || !strings.EqualFold(filepath.Ext(p), ".lnk") {
				return nil
			}
			name := strings.TrimSuffix(d.Name(), filepath.Ext(d.Name()))
			if skipShortcut(name) {
				return nil
			}
			t, hasArgs := lnkTarget(p)
			if !strings.EqualFold(filepath.Ext(t), ".exe") {
				return nil
			}
			exe := strings.ToLower(filepath.Base(t))
			if exe == "yaytsatimer.exe" {
				return nil
			}
			if i, ok := seen[exe]; ok {
				// Same exe twice (e.g. a web-app shortcut that starts the browser): prefer the plain one.
				if withArgs[exe] && !hasArgs {
					out[i].Name = name
					withArgs[exe] = false
				}
				return nil
			}
			if _, err := os.Stat(t); err != nil {
				return nil
			}
			seen[exe] = len(out)
			withArgs[exe] = hasArgs
			out = append(out, appInfo{Exe: exe, Name: name, Path: t})
			return nil
		})
	}
	sort.Slice(out, func(i, j int) bool { return strings.ToLower(out[i].Name) < strings.ToLower(out[j].Name) })
	return out
}

func installedApps() []appInfo {
	installedOnce.Do(func() { installed = scanInstalled() })
	return installed
}

/* ---------------- file dialog ---------------- */

type openFileNameW struct {
	StructSize    uint32
	Owner         uintptr
	Instance      uintptr
	Filter        *uint16
	CustomFilter  *uint16
	MaxCustFilter uint32
	FilterIndex   uint32
	File          *uint16
	MaxFile       uint32
	FileTitle     *uint16
	MaxFileTitle  uint32
	InitialDir    *uint16
	Title         *uint16
	Flags         uint32
	FileOffset    uint16
	FileExtension uint16
	DefExt        *uint16
	CustData      uintptr
	Hook          uintptr
	TemplateName  *uint16
	Reserved      uintptr
	Reserved2     uint32
	FlagsEx       uint32
}

func browseExe(title string) *appInfo {
	filter := utf16.Encode([]rune("Programs (*.exe)\x00*.exe\x00\x00"))
	file := make([]uint16, 1024)
	dir, _ := windows.KnownFolderPath(windows.FOLDERID_ProgramFiles, 0)
	ofn := openFileNameW{
		Owner:      mainHwnd,
		Filter:     &filter[0],
		File:       &file[0],
		MaxFile:    uint32(len(file)),
		InitialDir: u16(dir),
		Title:      u16(title),
		Flags:      0x00001000 | 0x00000800 | 0x00080000 | 0x00000008, // FILEMUSTEXIST|PATHMUSTEXIST|EXPLORER|NOCHANGEDIR
	}
	ofn.StructSize = uint32(unsafe.Sizeof(ofn))
	if r, _, _ := pGetOpenFileNameW.Call(uintptr(unsafe.Pointer(&ofn))); r == 0 {
		return nil
	}
	p := windows.UTF16ToString(file)
	name := fileDescription(p)
	if name == "" {
		name = strings.TrimSuffix(filepath.Base(p), filepath.Ext(p))
	}
	return &appInfo{Exe: strings.ToLower(filepath.Base(p)), Name: name, Path: p}
}
