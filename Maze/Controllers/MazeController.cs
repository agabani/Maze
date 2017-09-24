using System;
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

        public IActionResult Generate(int width = 8, int height = 8, int? seed = null)
        {
            return Ok(_generator.Generate(width, height, seed ?? Guid.NewGuid().GetHashCode()));
        }
    }
}