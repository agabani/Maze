using System.Collections.Generic;
using Maze.DijkstraAlgorithm.Graphing;

namespace Maze.DijkstraAlgorithm.Pathing
{
    public class Path
    {
        private readonly List<PathSegment> _segments;

        private Path(Node origin)
        {
            Origin = origin;
            _segments = new List<PathSegment>();
        }

        public Node Origin { get; }
        public Node Destination { get; private set; }
        public IReadOnlyList<PathSegment> Segments => _segments;

        internal static Path Create(Node origin)
        {
            return new Path(origin);
        }

        internal void AddSegment(PathSegment segment)
        {
            Destination = segment.Destination;
            _segments.Add(segment);
        }
    }
}
