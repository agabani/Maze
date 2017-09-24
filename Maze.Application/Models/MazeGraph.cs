using System.Collections.Generic;
using System.Linq;
using Maze.Application.Services;
using Maze.Application.Values;

namespace Maze.Application.Models
{
    public class MazeGraph
    {
        private readonly Dictionary<CartesianCoordinates, MazeCell> _graph;

        public MazeGraph()
        {
            _graph = new Dictionary<CartesianCoordinates, MazeCell>();
        }

        public void Add(MazeCell cell)
        {
            _graph.Add(cell.Coordinates, cell);
        }

        public bool Exists(CartesianCoordinates coordinates)
        {
            return _graph.ContainsKey(coordinates);
        }

        public IEnumerable<MazeCell> Population()
        {
            return _graph.Values;
        }
    }
}