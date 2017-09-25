using System;
using Maze.Application.Models;
using Maze.Application.Services;
using Maze.Generation;
using Maze.Models;
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
            var seedOrRandom = seed ?? Guid.NewGuid().GetHashCode();

            return Ok(new MazeViewModel(_generator.Generate(new Dimensions(width, height), seedOrRandom).Map, width, height, seedOrRandom));
        }

        public IActionResult Solve(int width, int height, int seed, int x, int z)
        {
            return Ok(_solver.Solve(new Dimensions(width, height), seed, new CanvasCoordinates(x, z)));
        }
    }
}