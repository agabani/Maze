namespace Maze.Application.Services
{
    public class CartesianCoordinates
    {
        public CartesianCoordinates(int x, int z)
        {
            X = x;
            Z = z;
        }

        public int X { get; }
        public int Z { get; }
    }
}