; Custom per-user NSIS installer. No runtime download and no administrator rights.
Unicode true
!include "MUI2.nsh"
!include "x64.nsh"
!include "WinVer.nsh"
!ifdef NSIS_WIN32_MAKENSIS
  !define QEWE_ICON_SOURCE "${PROJECT_DIR}\app\qewe.ico"
!else
  !define QEWE_ICON_SOURCE "${PROJECT_DIR}/app/qewe.ico"
!endif
!define QEWE_ICON_NAME "QEWE-${VERSION}.ico"
!ifndef MUI_ICON
  !define MUI_ICON "${QEWE_ICON_SOURCE}"
!endif
!ifndef MUI_UNICON
  !define MUI_UNICON "${QEWE_ICON_SOURCE}"
!endif
Name "Quick Ethereum Wallet Explorer"
RequestExecutionLevel user
InstallDir "$LOCALAPPDATA\Programs\EthereumAdresses"
InstallDirRegKey HKCU "Software\EthereumAdresses" "InstallDir"
SetCompressor zlib
SetCompress auto
BrandingText "Quick Ethereum Wallet Explorer · Ledger"
!define MUI_ABORTWARNING
!define MUI_WELCOMEPAGE_TITLE "Install Quick Ethereum Wallet Explorer"
!define MUI_WELCOMEPAGE_TEXT "QEWE - Ethereum Wallet Analysis & Offline Signing Tool.$\r$\n$\r$\nWindows 10/11, 64-bit. No additional runtime download is needed.$\r$\n$\r$\nDesktop and Start menu shortcuts will be created."
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_RUN "$INSTDIR\Quick Ethereum Wallet Explorer.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Open Quick Ethereum Wallet Explorer"
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "English"
Function .onInit
  ${IfNot} ${AtLeastWin10}
    MessageBox MB_ICONSTOP "Windows 10 or newer is required."
    Abort
  ${EndIf}
  ${IfNot} ${RunningX64}
    MessageBox MB_ICONSTOP "This application requires 64-bit Windows."
    Abort
  ${EndIf}
FunctionEnd
Section "Installation"
  SetShellVarContext current
  Delete "$DESKTOP\Ethereum Adresses.lnk"
  Delete "$SMPROGRAMS\Ethereum Adresses\Ethereum Adresses.lnk"
  Delete "$SMPROGRAMS\Ethereum Adresses\Désinstaller.lnk"
  RMDir "$SMPROGRAMS\Ethereum Adresses"
  Delete "$DESKTOP\Quick Balance Explorer.lnk"
  RMDir /r "$SMPROGRAMS\Quick Balance Explorer"
  Delete "$INSTDIR\Ethereum Adresses.exe"
  Delete "$DESKTOP\Quick Ethereum Balance Explorer.lnk"
  RMDir /r "$SMPROGRAMS\Quick Ethereum Balance Explorer"
  Delete "$INSTDIR\Quick Ethereum Balance Explorer.exe"
  SetOutPath "$INSTDIR"
  !ifdef NSIS_WIN32_MAKENSIS
    File /r "${PROJECT_DIR}\..\deliverables\win-unpacked\*"
  !else
    File /r "${PROJECT_DIR}/../deliverables/win-unpacked/*"
  !endif
  File /oname=${QEWE_ICON_NAME} "${QEWE_ICON_SOURCE}"
  WriteUninstaller "$INSTDIR\Desinstaller.exe"
  Delete "$DESKTOP\Quick Ethereum Wallet Explorer.lnk"
  CreateShortCut "$DESKTOP\Quick Ethereum Wallet Explorer.lnk" "$INSTDIR\Quick Ethereum Wallet Explorer.exe" "" "$INSTDIR\${QEWE_ICON_NAME}" 0
  WinShell::SetLnkAUMI "$DESKTOP\Quick Ethereum Wallet Explorer.lnk" "${APP_ID}"
  CreateDirectory "$SMPROGRAMS\Quick Ethereum Wallet Explorer"
  Delete "$SMPROGRAMS\Quick Ethereum Wallet Explorer\Quick Ethereum Wallet Explorer.lnk"
  CreateShortCut "$SMPROGRAMS\Quick Ethereum Wallet Explorer\Quick Ethereum Wallet Explorer.lnk" "$INSTDIR\Quick Ethereum Wallet Explorer.exe" "" "$INSTDIR\${QEWE_ICON_NAME}" 0
  WinShell::SetLnkAUMI "$SMPROGRAMS\Quick Ethereum Wallet Explorer\Quick Ethereum Wallet Explorer.lnk" "${APP_ID}"
  CreateShortCut "$SMPROGRAMS\Quick Ethereum Wallet Explorer\Désinstaller.lnk" "$INSTDIR\Desinstaller.exe" "" "$INSTDIR\${QEWE_ICON_NAME}" 0
  WriteRegStr HKCU "Software\EthereumAdresses" "InstallDir" "$INSTDIR"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\EthereumAdresses" "DisplayName" "Quick Ethereum Wallet Explorer"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\EthereumAdresses" "DisplayVersion" "${VERSION}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\EthereumAdresses" "UninstallString" '$\"$INSTDIR\Desinstaller.exe$\"'
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\EthereumAdresses" "DisplayIcon" '$\"$INSTDIR\${QEWE_ICON_NAME}$\",0'
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\EthereumAdresses" "NoModify" 1
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\EthereumAdresses" "NoRepair" 1
  System::Call 'shell32::SHChangeNotify(i 0x08000000, i 0, p 0, p 0)'
SectionEnd
Section "Uninstall"
  SetShellVarContext current
  Delete "$DESKTOP\Quick Ethereum Wallet Explorer.lnk"
  RMDir /r "$SMPROGRAMS\Quick Ethereum Wallet Explorer"
  ; Only the application's own installation folder is removed.
  IfFileExists "$INSTDIR\resources\app.asar" 0 done
  RMDir /r "$INSTDIR"
  done:
  DeleteRegKey HKCU "Software\EthereumAdresses"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\EthereumAdresses"
SectionEnd
