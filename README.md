# QB Starsector Mods Browser

**QBMBAMM provides a modern, all-in-one UI experience for Starsector modded gameplay.**

<table border="0" cellspacing="0" cellpadding="0">
<tr valign="top"><td style="padding: 0 1.75rem 0.35rem 0; vertical-align: top;"><strong>Mod browsing</strong></td><td style="padding: 0 0 0.35rem 0; vertical-align: top;">Search, sorting of many kinds - popularity, age, game version, category, latest activity, etc</td></tr>
<tr valign="top"><td style="padding: 0 1.75rem 0.35rem 0; vertical-align: top;"><strong>Automatic download/install</strong></td><td style="padding: 0 0 0.35rem 0; vertical-align: top;">Automatically install most mods straight from the forum</td></tr>
<tr valign="top"><td style="padding: 0 1.75rem 0.35rem 0; vertical-align: top;"><strong>Mod managing</strong></td><td style="padding: 0 0 0.35rem 0; vertical-align: top;">Enable, disable, or remove mods in your mods folder</td></tr>
<tr valign="top"><td style="padding: 0 1.75rem 0.35rem 0; vertical-align: top;"><strong>Automatic extract/install</strong></td><td style="padding: 0 0 0.35rem 0; vertical-align: top;">of archives in mods folder for externally sourced mods</td></tr>
<tr valign="top"><td style="padding: 0 1.75rem 0.35rem 0; vertical-align: top;"><strong>Update checking</strong></td><td style="padding: 0 0 0.35rem 0; vertical-align: top;">for updates through the forum and VersionChecker data</td></tr>
<tr valign="top"><td style="padding: 0 1.75rem 0.35rem 0; vertical-align: top;"><strong>Mod profiles</strong></td><td style="padding: 0 0 0.35rem 0; vertical-align: top;">Save and switch between different sets of mods</td></tr>
<tr valign="top"><td style="padding: 0 1.75rem 0.35rem 0; vertical-align: top;"><strong>Favorites</strong></td><td style="padding: 0 0 0.35rem 0; vertical-align: top;">Quickly mark your favourite mods</td></tr>
<tr valign="top"><td style="padding: 0 1.75rem 0.35rem 0; vertical-align: top;"><strong>Dependencies</strong></td><td style="padding: 0 0 0.35rem 0; vertical-align: top;">Display and quick downloading of installed mods' dependencies</td></tr>
<tr valign="top"><td style="padding: 0 1.75rem 0.35rem 0; vertical-align: top;"><strong>Keyboard assisted browsing</strong></td><td style="padding: 0 0 0.35rem 0; vertical-align: top;">Quick paging and categorizing</td></tr>
</table>

As always, updating mods mid-campaign might break your save, check each mod to see if they say it's a breaking change or not.

---

## Linux fork

This is a Linux port of [theRoastSuckling/QBMBAMM](https://github.com/theRoastSuckling/QBMBAMM). All credit for QBMBAMM itself goes to **theRoastSuckling** — this fork only changes how it runs, not what it does.

### Why

Upstream targets `net10.0-windows` with a WinForms system-tray host, which only runs on Linux under Wine/Proton — and even then, the tray icon (`NotifyIcon`) and the Windows-style "open in default browser" call routinely fail under Wine (no systray support in most compositors, no resolvable default browser inside a Wine prefix). This fork drops those Windows-only pieces so it runs natively on Linux with `dotnet`, no Wine required.

### What changed

- **Runtime**: `net10.0-windows` + WinForms → plain `net10.0`. The WinForms system tray (`TrayApp.cs`) is gone; the server now just runs as a console/background process and shuts down on Ctrl+C, SIGTERM, or the existing `/api/app/shutdown` endpoint (see `AppLifecycle.cs`).
- **Tailwind build step**: now uses `tools/tailwindcss-linux-x64` (official standalone CLI, same version as upstream's `tools/tailwindcss.exe`) when building on Linux; the Windows build path is untouched.
- **Default mods folder**: OS-aware. Linux defaults to `~/Starsector/mods` (the official Linux installer's default) instead of the Windows Program Files path.
- **Folder picker**: added a "Browse" button next to the mods-folder field (first-run prompt and Control Panel) that browses the server's filesystem to pick a folder, since a browser-hosted UI has no access to a native OS file dialog. It also offers one-click shortcuts to whichever of `~/Starsector/mods`, `~/.local/share/Steam/.../Starsector/mods`, and `~/.steam/steam/.../Starsector/mods` actually exist on your machine.
- **Auto-update**: disabled on Linux. Upstream's self-updater replaces the running exe via a spawned Windows `.bat` file, which has no Linux equivalent — pull and rebuild from source instead (see below).

### Requirements

- [.NET 10 SDK](https://dotnet.microsoft.com/download) (no admin/sudo needed — the official install script puts it under your home directory)

### Running it

```bash
export PATH="$HOME/.dotnet:$PATH"   # skip if dotnet is already on your PATH
cd src/QBModsBrowser.Server
dotnet run
```

On first launch it opens `http://localhost:33673` in your default browser automatically (via `xdg-open`) and walks you through picking your Starsector `mods` folder.

### Desktop launcher (optional)

[`launch-linux.sh`](launch-linux.sh) rebuilds (fast no-op if nothing changed) and runs the app, for use as a double-click launcher. Example `~/.local/share/applications/qbmbamm.desktop` entry:

```ini
[Desktop Entry]
Type=Application
Name=QBMBAMM
Exec=/path/to/this/repo/launch-linux.sh
Icon=/path/to/this/repo/QBSSMB4.ico
Categories=Game;Utility;
Terminal=false
```

(Most desktop environments want a `.png` icon rather than `.ico` — convert with e.g. `python3 -c "from PIL import Image; Image.open('QBSSMB4.ico').save('qbmbamm.png')"`.)

### Updating

Auto-update is disabled on this fork (see above). To get the latest:

```bash
git pull
```

then re-run `dotnet run` (or re-run `launch-linux.sh`, which rebuilds automatically).
