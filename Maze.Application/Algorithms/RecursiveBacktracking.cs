using System;
using System.Collections.Generic;
using System.Linq;
using Maze.Application.Models;
using Maze.Application.Services;

namespace Maze.Application.Algorithms
{
    public class RecursiveBacktracking
    {
        public void ProcedurallyGenerate(int width, int height)
        {
            var random = new Random();
            var graph = new MazeGraph();
            var stack = new Stack<MazeCell>();

            var initialCell = new MazeCell(new CartesianCoordinates(random.Next(height), random.Next(height)));
            graph.Add(initialCell);
            stack.Push(initialCell);

            while (stack.Peek() != initialCell && UnvisitedNeighbours(graph, initialCell, width, height).Any())
            {
                var currentCell = stack.Peek();

                var unvisitedNeighbours = UnvisitedNeighbours(graph, currentCell, width, height);

                if (unvisitedNeighbours.Any())
                {
                    var neighbour = new MazeCell(unvisitedNeighbours.ElementAt(random.Next(unvisitedNeighbours.Count)));
                    currentCell.Add(neighbour);
                    neighbour.Add(currentCell);
                    stack.Push(neighbour);
                }
                else
                {
                    stack.Pop();
                }
            }
        }

        private static List<CartesianCoordinates> UnvisitedNeighbours(MazeGraph graph, MazeCell cell, int width, int height)
        {
            return Neighbours(cell.Coordinates, width, height)
                .Where(coordinates => !graph.Exists(coordinates))
                .ToList();
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