using System;

namespace Maze.DijkstraAlgorithm.Exceptions
{
    public class PathFinderException : Exception
    {
        internal PathFinderException(string message) : base(message)
        {
        }
    }
}
