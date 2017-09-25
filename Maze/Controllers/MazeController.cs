using System;
using Maze.Application.Services;
using Maze.Application.Values;
using Microsoft.AspNetCore.Mvc;

namespace Maze.Controllers
{
    public class MazeController : Controller
    {
        private readonly MazeGenerator _generator;
        private readonly MazeSolver _solver;

        public MazeController(MazeGenerator generator, MazeSolver solver)
        {
            _generator = generator;
            _solver = solver;
        }

        // GET
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Generate(int width = 8, int height = 8, int? seed = null)
        {
            return Ok(_generator.Generate(width, height, seed ?? Guid.NewGuid().GetHashCode()));
        }

        public IActionResult Solve(int width, int height, int seed, int x, int z)
        {
            return Ok(_solver.Solve(width, height, seed, new CanvasCoordinates(x, z)));
        }
    }
}