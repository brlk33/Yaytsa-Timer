# Android build: YaytsaTimer.apk from android/ (Java, no Gradle) and the shared page in web/.
# Needs a JDK 17+ and the Android SDK (build-tools, platforms;android-36). Defaults to the portable
# copies in D:\Program Files\Android; override with $env:JAVA_HOME / $env:ANDROID_HOME.
# Signing key: $env:YAYTSA_KEYSTORE (+ .pass file next to it). Created on first run - keep it safe:
# without the same key, installed copies cannot update to a new APK.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$tools = 'D:\Program Files\Android'
if (-not $env:ANDROID_HOME) { $env:ANDROID_HOME = "$tools\sdk" }
if (-not $env:JAVA_HOME) {
  $j = Get-ChildItem $tools -Directory -Filter 'jdk-*' -ErrorAction SilentlyContinue | Select-Object -Last 1
  if ($j) { $env:JAVA_HOME = $j.FullName }
}
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
$bt = Get-ChildItem "$env:ANDROID_HOME\build-tools" -Directory | Sort-Object { [version]($_.Name -replace '-.*$', '') } | Select-Object -Last 1
$bt = $bt.FullName
$platform = Get-ChildItem "$env:ANDROID_HOME\platforms" -Directory -Filter 'android-*' | Sort-Object { [int]($_.Name -replace '\D', '') } | Select-Object -Last 1
$androidJar = "$($platform.FullName)\android.jar"
$targetSdk = [int]($platform.Name -replace '\D', '')
$ks = if ($env:YAYTSA_KEYSTORE) { $env:YAYTSA_KEYSTORE } else { "$tools\yaytsa-release.jks" }
$ksPass = "$ks.pass"

$version = (Get-Content version.txt -Raw).Trim()
$p = $version.Split('.') | ForEach-Object { [int]($_ -replace '\D', '') }
$versionCode = $p[0] * 10000 + $p[1] * 100 + $p[2]

$out = 'build\android'
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
New-Item -ItemType Directory -Force "$out\assets", "$out\classes", "$out\dex", "$out\gen" | Out-Null

# Page: the same files the desktop build embeds, plus the Android bridge
Copy-Item web\index.html, web\style.css, web\sync.js, web\app.js, android\bridge.js "$out\assets"

# Tools print notes to stderr; PowerShell 5.1 would treat that as an error, so only the exit code counts.
function Run($exe, [string[]]$a) {
  $ErrorActionPreference = 'Continue'
  & $exe @a 2>&1 | ForEach-Object { "$_" } | Where-Object { $_ -notmatch '^Note: |^warning: \[options\]' } | Out-Host
  if ($LASTEXITCODE) { throw "$exe failed ($LASTEXITCODE)" }
}

Run "$bt\aapt2.exe" @('compile', '--dir', 'android\res', '-o', "$out\res.zip")
Run "$bt\aapt2.exe" @('link', '-o', "$out\base.apk", '-I', $androidJar,
  '--manifest', 'android\AndroidManifest.xml',
  '--min-sdk-version', '26', '--target-sdk-version', "$targetSdk",
  '--version-code', "$versionCode", '--version-name', $version,
  '-A', "$out\assets", '--java', "$out\gen", "$out\res.zip")

$src = @(Get-ChildItem android\src, "$out\gen" -Recurse -Filter *.java | ForEach-Object FullName)
Run javac (@('-nowarn', '-Xlint:none', '-encoding', 'UTF-8', '-source', '8', '-target', '8',
  '-bootclasspath', $androidJar, '-classpath', "$bt\core-lambda-stubs.jar", '-d', "$out\classes") + $src)
$classes = @(Get-ChildItem "$out\classes" -Recurse -Filter *.class | ForEach-Object FullName)
Run "$bt\d8.bat" (@('--release', '--min-api', '26', '--lib', $androidJar, '--output', "$out\dex") + $classes)

Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem
$zip = [IO.Compression.ZipFile]::Open((Resolve-Path "$out\base.apk"), 'Update')
[void][IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, (Resolve-Path "$out\dex\classes.dex"), 'classes.dex')
$zip.Dispose()

Run "$bt\zipalign.exe" @('-p', '-f', '4', "$out\base.apk", "$out\aligned.apk")

if (-not (Test-Path $ks)) {
  $pass = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 24 | ForEach-Object { [char]$_ })
  [IO.File]::WriteAllText($ksPass, $pass)
  Run keytool @('-genkeypair', '-keystore', $ks, '-alias', 'yaytsa', '-keyalg', 'RSA', '-keysize', '3072',
    '-validity', '20000', '-storepass', $pass, '-keypass', $pass, '-dname', 'CN=Yaytsa Timer')
}
New-Item -ItemType Directory -Force dist | Out-Null
Run "$bt\apksigner.bat" @('sign', '--ks', $ks, '--ks-key-alias', 'yaytsa', '--ks-pass', "file:$ksPass",
  '--out', 'dist\YaytsaTimer.apk', "$out\aligned.apk")
Run "$bt\apksigner.bat" @('verify', 'dist\YaytsaTimer.apk')
Copy-Item dist\YaytsaTimer.apk . -Force
Remove-Item dist\YaytsaTimer.apk.idsig -ErrorAction SilentlyContinue
Get-Item YaytsaTimer.apk | Select-Object Name, Length
