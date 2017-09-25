using System.Collections.Generic;
using System.Linq;
using Maze.Application.Algorithms;
using Maze.Application.Models;
using Maze.Application.Values;
using Maze.DijkstraAlgorithm.Graphing;
using Maze.DijkstraAlgorithm.Pathing;

namespace Maze.Application.Services
{
    public class MazeSolver
    {
        private readonly RecursiveBacktracking _algorithm;

        public MazeSolver(RecursiveBacktracking algorithm)
        {
            _algorithm = algorithm;
        }

        public IEnumerable<CanvasCoordinates> Solve(int width, int height, int seed, CanvasCoordinates currentLocation)
        {
            var mazeGraph = _algorithm.ProcedurallyGenerate(width, height, seed);

            var dijkstraGraph = DijkstraGraph(mazeGraph);

            var shortestPath = new PathFinder(dijkstraGraph)
                .FindShortestPath(
                    dijkstraGraph.Nodes.Single(node => node.Id == Convert(currentLocation)),
                    dijkstraGraph.Nodes.Single(node => node.Id == Convert(new CartesianCoordinates(width - 1, 0))));

            return shortestPath.Segments
                .Select(segment => Convert(segment.Destination.Id))
                .Select(coordinates => (CanvasCoordinates) coordinates);
        }

        private static Graph DijkstraGraph(MazeGraph mazeGraph)
        {
            var graphBuilder = new GraphBuilder();

            foreach (var mazeCell in mazeGraph.Population())
                graphBuilder.AddNode(Convert(mazeCell.Coordinates));

            foreach (var from in mazeGraph.Population())
            foreach (var to in from.Traversable)
                graphBuilder.AddLink(Convert(from.Coordinates), Convert(to.Coordinates), 1);

            return graphBuilder.Build();
        }

        private static string Convert(CartesianCoordinates coordinates)
        {
            return $"{coordinates.X},{coordinates.Z}";
        }

        private static CartesianCoordinates Convert(string id)
        {
            var strings = id.Split(',');
            return new CartesianCoordinates(int.Parse(strings[0]), int.Parse(strings[1]));
        }
    }
}