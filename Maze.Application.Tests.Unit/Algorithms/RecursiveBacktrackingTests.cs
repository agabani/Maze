using Maze.Application.Algorithms;
using Xunit;

namespace Maze.Application.Tests.Unit.Algorithms
{
    public class RecursiveBacktrackingTests
    {
        [Fact]
        public void ItRuns()
        {
            var recursiveBacktracking = new RecursiveBacktracking();

            var graph = recursiveBacktracking.ProcedurallyGenerate(3, 3, 0);

            Assert.Equal(9, graph.Population());
        }
    }
}