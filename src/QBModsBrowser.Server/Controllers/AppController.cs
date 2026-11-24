using Microsoft.AspNetCore.Mvc;

namespace QBModsBrowser.Server.Controllers;

[ApiController]
[Route("api/app")]
// App lifecycle endpoints (shutdown, etc.).
public class AppController : ControllerBase
{
    // Requests shutdown of the running server instance.
    // Used by a newer version of the exe to take over from the currently running one.
    // AppLifecycle.RequestShutdown unblocks Program.cs's shutdownRequested wait so it can
    // force-exit. The short delay lets the HTTP response return first.
    [HttpPost("shutdown")]
    public IActionResult Shutdown()
    {
        Task.Run(async () =>
        {
            await Task.Delay(300);
            AppLifecycle.RequestShutdown?.Invoke();
        });
        return Ok();
    }
}
