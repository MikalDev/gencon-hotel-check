# -*- mode: python ; coding: utf-8 -*-
import os

block_cipher = None

# Bundle audio files if present
datas = []
for fname in ['alarm.wav', 'alarm.ogg']:
    if os.path.exists(fname):
        datas.append((fname, '.'))

a = Analysis(
    ['gencon-hotel-check.py'],
    pathex=[],
    binaries=[],
    datas=datas,
    hiddenimports=[
        # Optional alert backends — include all so the exe works without
        # needing separate installs.
        'win32api',
        'win32con',
        'tkinter',
        'tkinter.messagebox',
        'pygame',
        'pygame.mixer',
        # pynput uses backend-specific modules that PyInstaller misses
        'pynput.keyboard._win32',
        'pynput.mouse._win32',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='gencon-hotel-check',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,          # keep the terminal window — this is a CLI tool
    disable_windowed_traceback=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
