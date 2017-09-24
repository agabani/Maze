using Maze.Application.Algorithms;
using Maze.Application.Models;

namespace Maze.Application.Services
{
    public class MazeGenerator
    {
        private readonly RecursiveBacktracking _algorithm;

        public MazeGenerator(RecursiveBacktracking algorithm)
        {
            _algorithm = algorithm;
        }

        public string[][] Generate(int width, int height, int seed)
        {
            var graph = _algorithm.ProcedurallyGenerate(width, height, seed);

            var canvas = new MazeCanvas(width, height);

            foreach (var from in graph.Population())
            foreach (var to in from.Traversable)
                canvas.Connect(from.Coordinates, to.Coordinates);

            return canvas.Map;
        }
    }
}