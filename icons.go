//go:build windows

package main

import (
	"bytes"
	"encoding/base64"
	"image"
	"image/png"
	"sync"
	"unsafe"
)

// Program icons for the Apps tab: the exe's own icon as a small PNG data URL.
// Extracted once per path and kept in memory (a few KB each).

var (
	pSHDefExtractIconW = shell32.NewProc("SHDefExtractIconW")
	pDestroyIcon       = user32.NewProc("DestroyIcon")
	pGetIconInfo       = user32.NewProc("GetIconInfo")
	pGetObjectW        = gdi32.NewProc("GetObjectW")
	pGetDIBits         = gdi32.NewProc("GetDIBits")
	pCreateCompatDC    = gdi32.NewProc("CreateCompatibleDC")
	pDeleteDC          = gdi32.NewProc("DeleteDC")

	iconMu    sync.Mutex
	iconCache = map[string]string{}
)

const appIconSize = 48

type iconInfoT struct {
	FIcon    int32
	XHotspot uint32
	YHotspot uint32
	HbmMask  uintptr
	HbmColor uintptr
}

type bitmapT struct {
	Type       int32
	Width      int32
	Height     int32
	WidthBytes int32
	Planes     uint16
	BitsPixel  uint16
	Bits       uintptr
}

type bitmapInfoHeader struct {
	Size          uint32
	Width         int32
	Height        int32
	Planes        uint16
	BitCount      uint16
	Compression   uint32
	SizeImage     uint32
	XPelsPerMeter int32
	YPelsPerMeter int32
	ClrUsed       uint32
	ClrImportant  uint32
}

// bitmapBGRA reads a bitmap as top-down 32-bit BGRA.
func bitmapBGRA(hbm uintptr, w, h int32) []byte {
	buf := make([]byte, int(w)*int(h)*4)
	hdr := bitmapInfoHeader{Size: 40, Width: w, Height: -h, Planes: 1, BitCount: 32}
	dc, _, _ := pCreateCompatDC.Call(0)
	defer pDeleteDC.Call(dc)
	r, _, _ := pGetDIBits.Call(dc, hbm, 0, uintptr(h), uintptr(unsafe.Pointer(&buf[0])), uintptr(unsafe.Pointer(&hdr)), 0)
	if r == 0 {
		return nil
	}
	return buf
}

func appIcon(path string) string {
	if path == "" {
		return ""
	}
	iconMu.Lock()
	if v, ok := iconCache[path]; ok {
		iconMu.Unlock()
		return v
	}
	iconMu.Unlock()

	url := extractIcon(path)
	iconMu.Lock()
	iconCache[path] = url
	iconMu.Unlock()
	return url
}

func extractIcon(path string) string {
	var hicon uintptr
	r, _, _ := pSHDefExtractIconW.Call(uintptr(unsafe.Pointer(u16(path))), 0, 0,
		uintptr(unsafe.Pointer(&hicon)), 0, appIconSize)
	if r != 0 || hicon == 0 {
		return ""
	}
	defer pDestroyIcon.Call(hicon)

	var ii iconInfoT
	if ok, _, _ := pGetIconInfo.Call(hicon, uintptr(unsafe.Pointer(&ii))); ok == 0 {
		return ""
	}
	if ii.HbmMask != 0 {
		defer pDeleteObject.Call(ii.HbmMask)
	}
	if ii.HbmColor == 0 {
		return ""
	}
	defer pDeleteObject.Call(ii.HbmColor)

	var bm bitmapT
	pGetObjectW.Call(ii.HbmColor, unsafe.Sizeof(bm), uintptr(unsafe.Pointer(&bm)))
	w, h := bm.Width, bm.Height
	if w <= 0 || h <= 0 || w > 256 || h > 256 {
		return ""
	}
	px := bitmapBGRA(ii.HbmColor, w, h)
	if px == nil {
		return ""
	}
	hasAlpha := false
	for i := 3; i < len(px); i += 4 {
		if px[i] != 0 {
			hasAlpha = true
			break
		}
	}
	var mask []byte
	if !hasAlpha && ii.HbmMask != 0 {
		mask = bitmapBGRA(ii.HbmMask, w, h) // old-style icon: white mask pixel = transparent
	}

	img := image.NewNRGBA(image.Rect(0, 0, int(w), int(h)))
	for i := 0; i < int(w)*int(h); i++ {
		b, g, rr, a := px[i*4], px[i*4+1], px[i*4+2], px[i*4+3]
		if !hasAlpha {
			a = 255
			if mask != nil && mask[i*4] != 0 {
				a = 0
			}
		}
		img.Pix[i*4], img.Pix[i*4+1], img.Pix[i*4+2], img.Pix[i*4+3] = rr, g, b, a
	}
	var out bytes.Buffer
	if png.Encode(&out, img) != nil {
		return ""
	}
	return "data:image/png;base64," + base64.StdEncoding.EncodeToString(out.Bytes())
}

// withIcons returns a copy of the list with icons filled in.
func withIcons(list []appInfo) []appInfo {
	out := make([]appInfo, len(list))
	for i, a := range list {
		a.Icon = appIcon(a.Path)
		out[i] = a
	}
	return out
}
