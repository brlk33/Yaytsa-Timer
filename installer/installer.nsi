; Яйца Таймер — installer (NSIS 3, Unicode)
Unicode true
SetCompressor /SOLID lzma
ManifestDPIAware true
RequestExecutionLevel user

!define APPNAME "Яйца Таймер"
!define EXE "YaytsaTimer.exe"
!define REGKEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\YaytsaTimer"
!ifndef VERSION
  !define VERSION "2.0.0"
!endif

Name "${APPNAME}"
OutFile "..\dist\YaytsaTimer-Setup.exe"
; Same folder the previous (Electron) build used, so updates replace it in place.
InstallDir "$LOCALAPPDATA\Programs\yaytsa-timer"
InstallDirRegKey HKCU "Software\YaytsaTimer" "InstallDir"
BrandingText "${APPNAME} ${VERSION}"
VIProductVersion "${VERSION}.0"
VIAddVersionKey /LANG=1049 "ProductName" "${APPNAME}"
VIAddVersionKey /LANG=1049 "FileDescription" "Установщик ${APPNAME}"
VIAddVersionKey /LANG=1049 "FileVersion" "${VERSION}"
VIAddVersionKey /LANG=1049 "ProductVersion" "${VERSION}"
VIAddVersionKey /LANG=1049 "CompanyName" "Яйца Cloud"
VIAddVersionKey /LANG=1049 "LegalCopyright" "Яйца Cloud"

!include "MUI2.nsh"
!define MUI_ICON "..\res\app.ico"
!define MUI_UNICON "..\res\app.ico"
!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_RUN "$INSTDIR\${EXE}"
!define MUI_FINISHPAGE_RUN_TEXT "Запустить ${APPNAME}"

!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "Russian"

!macro CloseApp
  nsExec::Exec 'taskkill /F /IM ${EXE}'
  Sleep 600
!macroend

Section "Install"
  !insertmacro CloseApp

  ; Remove the previous Electron build if it lives here (its uninstaller keeps user data).
  IfFileExists "$INSTDIR\Uninstall Yaytsa Timer.exe" 0 +4
    ExecWait '"$INSTDIR\Uninstall Yaytsa Timer.exe" /S _?=$INSTDIR'
    Delete "$INSTDIR\Uninstall Yaytsa Timer.exe"
    RMDir /r "$INSTDIR"

  SetOutPath "$INSTDIR"
  File "..\dist\${EXE}"
  WriteUninstaller "$INSTDIR\Uninstall.exe"

  CreateShortCut "$SMPROGRAMS\${APPNAME}.lnk" "$INSTDIR\${EXE}" "" "$INSTDIR\${EXE}" 0
  CreateShortCut "$DESKTOP\${APPNAME}.lnk" "$INSTDIR\${EXE}" "" "$INSTDIR\${EXE}" 0

  WriteRegStr HKCU "Software\YaytsaTimer" "InstallDir" "$INSTDIR"
  WriteRegStr HKCU "${REGKEY}" "DisplayName" "${APPNAME}"
  WriteRegStr HKCU "${REGKEY}" "DisplayVersion" "${VERSION}"
  WriteRegStr HKCU "${REGKEY}" "Publisher" "Яйца Cloud"
  WriteRegStr HKCU "${REGKEY}" "DisplayIcon" "$INSTDIR\${EXE}"
  WriteRegStr HKCU "${REGKEY}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "${REGKEY}" "URLInfoAbout" "https://github.com/brlk33/Yaytsa-Timer"
  WriteRegStr HKCU "${REGKEY}" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegStr HKCU "${REGKEY}" "QuietUninstallString" '"$INSTDIR\Uninstall.exe" /S'
  WriteRegDWORD HKCU "${REGKEY}" "NoModify" 1
  WriteRegDWORD HKCU "${REGKEY}" "NoRepair" 1
  WriteRegDWORD HKCU "${REGKEY}" "EstimatedSize" 3200
SectionEnd

; Silent install = self-update: start the new version right away.
Function .onInstSuccess
  IfSilent 0 +2
    Exec '"$INSTDIR\${EXE}"'
FunctionEnd

Section "Uninstall"
  !insertmacro CloseApp
  Delete "$INSTDIR\${EXE}"
  Delete "$INSTDIR\Uninstall.exe"
  RMDir "$INSTDIR"
  Delete "$SMPROGRAMS\${APPNAME}.lnk"
  Delete "$DESKTOP\${APPNAME}.lnk"
  DeleteRegKey HKCU "${REGKEY}"
  DeleteRegKey HKCU "Software\YaytsaTimer"
  ; History and settings stay in %APPDATA%\YaytsaTimer
SectionEnd
