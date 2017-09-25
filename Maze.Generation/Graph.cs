using System.Collections.Generic;

namespace Maze.Generation
{
    public class Graph
    {
        private readonly Dictionary<CartesianCoordinates, Cell> _graph;

        public Graph()
        {
            _graph = new Dictionary<CartesianCoordinates, Cell>();
        }

        public void Add(Cell cell)
        {
            _graph.Add(cell.Coordinates, cell);
        }

        public bool Exists(CartesianCoordinates coordinates)
        {
            return _graph.ContainsKey(coordinates);
        }

        public IEnumerable<Cell> Population()
        {
            return _graph.Values;
        }
    }
}