namespace QBModsBrowser.Server;

// Linux fork note: replaces the old WinForms Application.Exit() signal (which the tray menu,
// the /api/app/shutdown endpoint, and the auto-updater all called into) with a plain delegate
// Program.cs wires up to IHostApplicationLifetime.StopApplication().
internal static class AppLifecycle
{
    public static Action? RequestShutdown;
}
