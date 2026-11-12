# Web app (Mac and any browser): the same page as the desktop and Android builds, with the
# browser bridge (web/webapi.js), an offline service worker and a manifest, so it can be
# installed to the Dock (Safari) or as an app (Chrome). It is put into the yaytsa-cloud site
# as timer/ (same origin as the site: Google sign-in goes through the site and comes back).
#   .\build-web.ps1                 -> ..\yaytsa-cloud\timer
#   .\build-web.ps1 -Out some\dir   -> anywhere else
param([string]$Out = (Join-Path $PSScriptRoot '..\yaytsa-cloud\timer'))
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$version = (Get-Content version.txt -Raw).Trim()
$utf8 = New-Object System.Text.UTF8Encoding($false)
function ReadText($p) { [IO.File]::ReadAllText((Resolve-Path $p), $utf8) }
function WriteText($p, $s) { [IO.File]::WriteAllText($p, $s, $utf8) }

New-Item -ItemType Directory -Force $Out | Out-Null
$Out = (Resolve-Path $Out).Path

# The page: the web CSP (sync and sign-in talk to Google / Firebase), the manifest, the bridge first
$html = ReadText 'web\index.html'
$csp = "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; " +
  "connect-src 'self' https://*.googleapis.com https://*.firebasedatabase.app wss://*.firebasedatabase.app; manifest-src 'self'; worker-src 'self'"
$html = [regex]::Replace($html, '<meta http-equiv="Content-Security-Policy"[^>]*>', "<meta http-equiv=`"Content-Security-Policy`" content=`"$csp`">")
$head = '<link rel="manifest" href="manifest.webmanifest"><meta name="theme-color" content="#191919">' +
  '<link rel="icon" type="image/png" href="icon-192.png"><link rel="apple-touch-icon" href="icon-192.png">' +
  '<meta name="apple-mobile-web-app-capable" content="yes">'
$html = $html.Replace('<link rel="stylesheet" href="style.css">', "<link rel=`"stylesheet`" href=`"style.css`">$head")
$html = $html.Replace('<script src="sync.js"></script>', '<script src="webapi.js"></script><script src="sync.js"></script>')
WriteText "$Out\index.html" $html

foreach ($f in 'style.css', 'app.js', 'sync.js') { Copy-Item "web\$f" "$Out\$f" -Force }
WriteText "$Out\webapi.js" ((ReadText 'web\webapi.js').Replace('__VERSION__', $version))
WriteText "$Out\sw.js" ((ReadText 'web\pwa\sw.js').Replace('__VERSION__', $version))
Copy-Item 'web\pwa\auth.html', 'web\pwa\manifest.webmanifest' $Out -Force
WriteText "$Out\version.json" "{`"version`":`"$version`"}"

# Icons: 512 as is, 192 scaled down
Copy-Item 'res\icon-512.png' "$Out\icon-512.png" -Force
Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Image]::FromFile((Resolve-Path 'res\icon-512.png'))
$bmp = New-Object System.Drawing.Bitmap 192, 192
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($src, 0, 0, 192, 192)
$bmp.Save("$Out\icon-192.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose(); $src.Dispose()

Get-ChildItem $Out | Select-Object Name, Length | Format-Table -AutoSize | Out-Host
"web app $version -> $Out"
