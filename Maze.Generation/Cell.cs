using System.Collections.Generic;

namespace Maze.Generation
{
    public class Cell
    {
        private readonly List<Cell> _traversable;

        internal Cell(CartesianCoordinates coordinates)
        {
            Coordinates = coordinates;
            _traversable = new List<Cell>();
        }

        public CartesianCoordinates Coordinates { get; }
        public IEnumerable<Cell> Traversable => _traversable;

        internal void Add(Cell cell)
        {
            _traversable.Add(cell);
        }
    }
}