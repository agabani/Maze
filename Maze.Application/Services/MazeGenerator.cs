using Maze.Application.Models;
using Maze.Generation;
using Maze.Generation.Algorithms;

namespace Maze.Application.Services
{
    public class MazeGenerator
    {
        private readonly RecursiveBacktracking _algorithm;

        public MazeGenerator(RecursiveBacktracking algorithm)
        {
            _algorithm = algorithm;
        }

        public Canvas Generate(Dimensions dimensions, int seed)
        {
            var graph = _algorithm.ProcedurallyGenerate(dimensions, seed);

            var canvas = new Canvas((CanvasCoordinates) (CartesianCoordinates) dimensions);

            foreach (var from in graph.Population())
            foreach (var to in from.Traversable)
                canvas.Connect(from.Coordinates, to.Coordinates);

            return canvas;
        }
    }
}