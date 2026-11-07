# Windows build: YaytsaTimer.exe + NSIS installer + latest.yml (same output as build.sh).
# Needs Go 1.22+ and NSIS (makensis) on PATH or in %LOCALAPPDATA%\Programs\{go,nsis-*}.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$progs = "$env:LOCALAPPDATA\Programs"
if (-not (Get-Command go -ErrorAction SilentlyContinue)) { $env:PATH = "$progs\go\bin;$env:PATH" }
if (-not (Get-Command makensis -ErrorAction SilentlyContinue)) {
  $n = Get-ChildItem $progs -Directory -Filter 'nsis-*' -ErrorAction SilentlyContinue | Select-Object -Last 1
  if ($n) { $env:PATH = "$($n.FullName);$env:PATH" }
}
$version = (Get-Content version.txt -Raw).Trim()

$env:GOOS = 'windows'; $env:GOARCH = 'amd64'; $env:CGO_ENABLED = '0'
go build -trimpath -ldflags "-s -w -H windowsgui -buildid=" -o dist/YaytsaTimer.exe .
if ($LASTEXITCODE) { throw 'go build failed' }

Push-Location installer
makensis -V2 "-DVERSION=$version" installer.nsi
$code = $LASTEXITCODE
Pop-Location
if ($code) { throw 'makensis failed' }

Copy-Item dist/YaytsaTimer-Setup.exe . -Force

# latest.yml lets copies of the old Electron build (1.x) update themselves to this version.
$bytes = [IO.File]::ReadAllBytes("$PWD\YaytsaTimer-Setup.exe")
$sha = [Convert]::ToBase64String([Security.Cryptography.SHA512]::Create().ComputeHash($bytes))
$date = [DateTime]::UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.000Z")
$yml = "version: $version`nfiles:`n  - url: YaytsaTimer-Setup.exe`n    sha512: $sha`n    size: $($bytes.Length)`npath: YaytsaTimer-Setup.exe`nsha512: $sha`nreleaseDate: '$date'`n"
[IO.File]::WriteAllText("$PWD\latest.yml", $yml)

Get-Item dist/YaytsaTimer.exe, YaytsaTimer-Setup.exe | Select-Object Name, Length
