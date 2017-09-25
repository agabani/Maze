namespace Maze.Application.Values
{
    public class CanvasCoordinates
    {
        public CanvasCoordinates(int x, int z)
        {
            X = x;
            Z = z;
        }

        public int X { get; }
        public int Z { get; }

        public static implicit operator CartesianCoordinates(CanvasCoordinates coordinates)
        {
            return new CartesianCoordinates((coordinates.X - 1) / 2, (coordinates.Z - 1) / 2);
        }

        public static implicit operator Dimensions(CanvasCoordinates coordinates)
        {
            return new Dimensions(coordinates.X, coordinates.Z);
        }
    }
}