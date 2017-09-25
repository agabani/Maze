using Maze.Application.Models;
using Maze.Generation;
using Maze.Generation.Algorithms;

namespace Maze.Application.Services
{
    public class MazeGenerator
    {
        private readonly IMazeAlgorithm _algorithm;

        public MazeGenerator(IMazeAlgorithm algorithm)
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

            canvas.SetStart(new CartesianCoordinates(0, dimensions.Height - 1));
            canvas.SetGoal(new CartesianCoordinates(dimensions.Width - 1, 0));

            return canvas;
        }
    }
}