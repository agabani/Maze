using Microsoft.AspNetCore.Mvc;

namespace Maze.Controllers
{
    public class MazeController : Controller
    {
        // GET
        public IActionResult Index()
        {
            return View();
        }
    }
}