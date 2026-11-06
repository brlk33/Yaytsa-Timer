#!/bin/sh
# Builds YaytsaTimer.exe (Go, no cgo) and the NSIS installer on Linux or Windows (Git Bash).
# Needs: Go 1.22+, makensis; windres (mingw binutils) only if res/ changed.
set -e
VERSION=$(cat version.txt)
GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build -trimpath -ldflags "-s -w -H windowsgui -buildid=" -o dist/YaytsaTimer.exe .
(cd installer && makensis -V2 -DVERSION="$VERSION" installer.nsi)
cp dist/YaytsaTimer-Setup.exe .
python3 tools/latest_yml.py "$VERSION" YaytsaTimer-Setup.exe > latest.yml
ls -la dist YaytsaTimer-Setup.exe
