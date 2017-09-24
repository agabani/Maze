using System.Collections.Generic;
using Maze.Application.Services;

namespace Maze.Application.Models
{
    public class MazeCell
    {
        private readonly List<MazeCell> _traversable;

        public MazeCell(CartesianCoordinates coordinates)
        {
            Coordinates = coordinates;
            _traversable = new List<MazeCell>();
        }

        public CartesianCoordinates Coordinates { get; }
        public IEnumerable<MazeCell> Traversable => _traversable;

        public void Add(MazeCell cell)
        {
            _traversable.Add(cell);
        }
    }

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
    }
}