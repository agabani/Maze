﻿using System.Linq;
using Maze.Generation.Algorithms;
using Xunit;

namespace Maze.Generation.Tests.Unit.Algorithms
{
    public class RecursiveBacktrackingTests
    {
        [Theory]
        [InlineData(3, 3, 0)]
        [InlineData(3, 3, 1)]
        [InlineData(3, 3, 2)]
        [InlineData(5, 5, 0)]
        [InlineData(5, 5, 1)]
        [InlineData(5, 5, 2)]
        [InlineData(125, 125, 0)]
        [InlineData(125, 125, 1)]
        [InlineData(125, 125, 2)]
        public void ItRuns(int width, int height, int seed)
        {
            var recursiveBacktracking = new RecursiveBacktracking();

            var graph = recursiveBacktracking.ProcedurallyGenerate(new CartesianCoordinates(width, height), seed);

            Assert.Equal(width * height, graph.Population().Count());
        }
    }
}