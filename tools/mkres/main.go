// mkres builds rsrc_windows_amd64.syso (icon, manifest, version info) without windres.
// Run from the repo root: go -C tools/mkres run . -root ../..
package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/tc-hib/winres"
	"github.com/tc-hib/winres/version"
)

const (
	appName = "Яйцетаймер"
	company = "Яйца Cloud"
	langRU  = 0x0419
)

func main() {
	root := flag.String("root", ".", "repository root")
	flag.Parse()
	if err := run(*root); err != nil {
		fmt.Fprintln(os.Stderr, "mkres:", err)
		os.Exit(1)
	}
}

func run(root string) error {
	ver, err := os.ReadFile(filepath.Join(root, "version.txt"))
	if err != nil {
		return err
	}
	v := strings.TrimSpace(string(ver))

	rs := winres.ResourceSet{}

	f, err := os.Open(filepath.Join(root, "res", "app.ico"))
	if err != nil {
		return err
	}
	icon, err := winres.LoadICO(f)
	f.Close()
	if err != nil {
		return err
	}
	if err := rs.SetIcon(winres.ID(1), icon); err != nil {
		return err
	}

	manifest, err := os.ReadFile(filepath.Join(root, "res", "app.manifest"))
	if err != nil {
		return err
	}
	if err := rs.Set(winres.RT_MANIFEST, winres.ID(1), 0, manifest); err != nil {
		return err
	}

	vi := version.Info{}
	vi.SetFileVersion(v)
	vi.SetProductVersion(v)
	for k, val := range map[string]string{
		version.CompanyName:      company,
		version.FileDescription:  appName,
		version.FileVersion:      v,
		version.InternalName:     "YaytsaTimer",
		version.OriginalFilename: "YaytsaTimer.exe",
		version.ProductName:      appName,
		version.ProductVersion:   v,
		version.LegalCopyright:   company,
	} {
		if err := vi.Set(langRU, k, val); err != nil {
			return err
		}
	}
	rs.SetVersionInfo(vi)

	out, err := os.Create(filepath.Join(root, "rsrc_windows_amd64.syso"))
	if err != nil {
		return err
	}
	defer out.Close()
	return rs.WriteObject(out, winres.ArchAMD64)
}
