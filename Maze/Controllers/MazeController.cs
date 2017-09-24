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

        public IActionResult Generate(int width = 8, int height = 8, int seed = 0)
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
            return Ok(_generator.Generate(width, height, seed));
        }
    }
}