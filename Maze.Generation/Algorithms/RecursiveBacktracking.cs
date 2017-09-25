using System;
using System.Collections.Generic;
using System.Linq;

namespace Maze.Generation.Algorithms
{
    public class RecursiveBacktracking : IMazeAlgorithm
    {
        public Graph ProcedurallyGenerate(Dimensions dimensions, int seed)
        {
            var random = new Random(seed);
            var graph = new Graph();
            var stack = new Stack<Cell>();

            var initialCell = new Cell(new CartesianCoordinates(random.Next(dimensions.Width), random.Next(dimensions.Height)));
            graph.Add(initialCell);
            stack.Push(initialCell);

            do
            {
                var currentCell = stack.Peek();

                var unvisitedNeighbours = UnvisitedNeighbours(graph, currentCell, dimensions).ToList();

                if (unvisitedNeighbours.Any())
                {
                    var neighbour = new Cell(unvisitedNeighbours.ElementAt(random.Next(unvisitedNeighbours.Count)));

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

        private static IEnumerable<CartesianCoordinates> UnvisitedNeighbours(Graph graph, Cell cell, Dimensions dimensions)
        {
            return Neighbours(cell.Coordinates, dimensions)
                .Where(coordinates => !graph.Exists(coordinates));
        }

        private static IEnumerable<CartesianCoordinates> Neighbours(CartesianCoordinates coordinates, Dimensions dimensions)
        {
            var neigbours = new List<CartesianCoordinates>();

            if (coordinates.X - 1 >= 0)
                neigbours.Add(new CartesianCoordinates(coordinates.X - 1, coordinates.Z));

            if (coordinates.X + 1 < dimensions.Width)
                neigbours.Add(new CartesianCoordinates(coordinates.X + 1, coordinates.Z));

            if (coordinates.Z - 1 >= 0)
                neigbours.Add(new CartesianCoordinates(coordinates.X, coordinates.Z - 1));

            if (coordinates.Z + 1 < dimensions.Height)
                neigbours.Add(new CartesianCoordinates(coordinates.X, coordinates.Z + 1));

            return neigbours;
        }
    }
}