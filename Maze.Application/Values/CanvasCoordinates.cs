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
            //return new CartesianCoordinates(coordinates.X * 2 + 1, coordinates.Z * 2 + 1);
            return new CartesianCoordinates((coordinates.X - 1) / 2, (coordinates.Z - 1) / 2);
        }

        public static implicit operator CanvasCoordinates(CartesianCoordinates coordinates)
        {
            //return new CanvasCoordinates((coordinates.X - 1) / 2, (coordinates.Z - 1) / 2);
            return new CanvasCoordinates(coordinates.X * 2 + 1, coordinates.Z * 2 + 1);
        }
    }
}