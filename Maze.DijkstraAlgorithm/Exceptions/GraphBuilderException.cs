using System;

namespace Maze.DijkstraAlgorithm.Exceptions
{
    public class GraphBuilderException : Exception
    {
        internal GraphBuilderException(string message) : base(message)
        {
        }
    }
}
