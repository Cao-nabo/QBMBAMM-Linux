namespace QBModsBrowser.Server.Models;

// Persisted manager settings, currently holding the path to the Starsector mods folder.
public class ManagerConfig
{
    // Used when no path is stored yet or legacy config was blank.
    // Linux fork note: the upstream default is the typical Windows install location; on Linux
    // that path can never exist, so fall back to the official Linux installer's default
    // (~/Starsector/mods) instead. Either way it's just a starting point for the folder
    // picker/text field, not a guarantee the folder exists.
    public static readonly string DefaultModsPath = OperatingSystem.IsWindows()
        ? @"C:\Program Files (x86)\Fractal Softworks\Starsector\mods"
        : Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "Starsector", "mods");

    public string ModsPath { get; set; } = DefaultModsPath;

    // True only after the user has explicitly saved their mods path; used by the frontend to detect first-run state.
    public bool IsUserConfigured { get; set; } = false;
}

