using Maze.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Maze.Controllers
{
    public class MazeController : Controller
    {
        private readonly MazeGenerator _generator;

        public MazeController(MazeGenerator generator)
        {
            _generator = generator;
        }

        // GET
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Generate(int seed)
        {
            var strings = new[]
            {
                new[] {"w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"},
                new[] {"w", " ", "w", " ", " ", " ", "w", " ", " ", " ", "w", " ", " ", " ", " ", " ", "w"},
                new[] {"w", " ", "w", "w", "w", " ", "w", " ", "w", " ", "w", "w", "w", " ", "w", " ", "w"},
                new[] {"w", " ", "w", " ", "w", " ", "w", " ", "w", " ", " ", " ", "w", " ", "w", " ", "w"},
                new[] {"w", " ", "w", " ", "w", " ", "w", " ", "w", "w", "w", " ", "w", " ", "w", "w", "w"},
                new[] {"w", " ", " ", " ", " ", " ", " ", " ", "w", " ", "w", " ", "w", " ", " ", " ", "w"},
                new[] {"w", " ", "w", "w", "w", " ", "w", "w", "w", " ", "w", "w", "w", " ", "w", "w", "w"},
                new[] {"w", " ", "w", " ", "w", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w", " ", "w"},
                new[] {"w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", " ", "w", " ", "w", " ", "w"},
                new[] {"w", " ", " ", " ", " ", " ", " ", " ", "w", " ", "w", " ", "w", " ", " ", " ", "w"},
                new[] {"w", " ", "w", "w", "w", " ", "w", "w", "w", " ", "w", "w", "w", " ", "w", " ", "w"},
                new[] {"w", " ", "w", " ", "w", " ", "w", " ", " ", " ", " ", " ", " ", " ", "w", " ", "w"},
                new[] {"w", "w", "w", " ", "w", " ", "w", "w", "w", " ", "w", "w", "w", " ", "w", "w", "w"},
                new[] {"w", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w", " ", "w", " ", " ", " ", "w"},
                new[] {"w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", " ", "w"},
                new[] {"w", " ", " ", " ", " ", " ", "w", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w"},
                new[] {"w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w"}
            };

            //return Ok(strings);
            return Ok(_generator.Generate(8, 8));
        }
    }
}