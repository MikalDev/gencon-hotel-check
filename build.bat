@echo off
setlocal

echo === gencon-hotel-check build ===
echo.

REM ── 1. Install / upgrade build + runtime dependencies ───────────────────────
echo [1/3] Installing dependencies...
pip install --quiet --upgrade pyinstaller pygame pynput pywin32
if errorlevel 1 (
    echo ERROR: pip install failed.
    exit /b 1
)

REM ── 2. Clean previous build artefacts ───────────────────────────────────────
echo [2/3] Cleaning previous build...
if exist build  rmdir /s /q build
if exist dist   rmdir /s /q dist

REM ── 3. Build with the spec file (single .exe, console mode) ─────────────────
echo [3/3] Building executable...
pyinstaller gencon-hotel-check.spec
if errorlevel 1 (
    echo ERROR: PyInstaller build failed.
    exit /b 1
)

echo.
echo Done!  Output: dist\gencon-hotel-check.exe
echo.
echo Usage (same flags as the Python script):
echo   dist\gencon-hotel-check.exe --url "https://book.passkey.com/entry?token=..." --bell --popup
endlocal
