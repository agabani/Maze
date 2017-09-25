using System.Collections.Generic;

namespace Maze.Generation
{
    public class Graph
    {
        private readonly Dictionary<CartesianCoordinates, Cell> _graph;

        internal Graph()
        {
            _graph = new Dictionary<CartesianCoordinates, Cell>();
        }

        internal void Add(Cell cell)
        {
            _graph.Add(cell.Coordinates, cell);
        }

        internal bool Exists(CartesianCoordinates coordinates)
        {
            return _graph.ContainsKey(coordinates);
        }

        public IEnumerable<Cell> Population()
        {
            return _graph.Values;
        }
    }
}