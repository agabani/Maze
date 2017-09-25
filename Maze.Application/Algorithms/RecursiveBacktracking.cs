using System;
using System.Collections.Generic;
using System.Linq;
using Maze.Application.Models;
using Maze.Application.Values;

namespace Maze.Application.Algorithms
{
    public class RecursiveBacktracking
    {
        public MazeGraph ProcedurallyGenerate(int width, int height, int seed)
        {
            var random = new Random(seed);
            var graph = new MazeGraph();
            var stack = new Stack<MazeCell>();

            var initialCell = new MazeCell(new CartesianCoordinates(random.Next(height), random.Next(height)));
            graph.Add(initialCell);
            stack.Push(initialCell);

            do
            {
                var currentCell = stack.Peek();

                var unvisitedNeighbours = UnvisitedNeighbours(graph, currentCell, width, height).ToList();

                if (unvisitedNeighbours.Any())
                {
                    var neighbour = new MazeCell(unvisitedNeighbours.ElementAt(random.Next(unvisitedNeighbours.Count)));

                    currentCell.Add(neighbour);
                    neighbour.Add(currentCell);

                    graph.Add(neighbour);
                    stack.Push(neighbour);
                }
                else
                {
                    stack.Pop();
                }
            } while (stack.Any());

            return graph;
        }

        private static IEnumerable<CartesianCoordinates> UnvisitedNeighbours(MazeGraph graph, MazeCell cell, int width, int height)
        {
            return Neighbours(cell.Coordinates, width, height)
                .Where(coordinates => !graph.Exists(coordinates));
        }

        private static IEnumerable<CartesianCoordinates> Neighbours(CartesianCoordinates coordinates, int width, int height)
        {
            var neigbours = new List<CartesianCoordinates>();

            if (coordinates.X - 1 >= 0)
                neigbours.Add(new CartesianCoordinates(coordinates.X - 1, coordinates.Z));

            if (coordinates.X + 1 < width)
                neigbours.Add(new CartesianCoordinates(coordinates.X + 1, coordinates.Z));

            if (coordinates.Z - 1 >= 0)
                neigbours.Add(new CartesianCoordinates(coordinates.X, coordinates.Z - 1));

            if (coordinates.Z + 1 < height)
                neigbours.Add(new CartesianCoordinates(coordinates.X, coordinates.Z + 1));

            return neigbours;
        }
    }
}