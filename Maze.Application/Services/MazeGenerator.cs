using Maze.Application.Algorithms;
using Maze.Application.Models;
using Maze.Application.Values;

namespace Maze.Application.Services
{
    public class MazeGenerator
    {
        private readonly RecursiveBacktracking _algorithm;

        public MazeGenerator(RecursiveBacktracking algorithm)
        {
            _algorithm = algorithm;
        }

        public Models.Maze Generate(CartesianCoordinates dimensions, int seed)
        {
            var graph = _algorithm.ProcedurallyGenerate(dimensions, seed);

            var canvas = new MazeCanvas(dimensions);

            foreach (var from in graph.Population())
            foreach (var to in from.Traversable)
                canvas.Connect(from.Coordinates, to.Coordinates);

            return new Models.Maze(canvas.Map, dimensions.X, dimensions.Z, seed);
        }
    }
}