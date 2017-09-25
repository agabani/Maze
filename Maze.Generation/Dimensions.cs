namespace Maze.Generation
{
    public class Dimensions
    {
        public Dimensions(int width, int height)
        {
            Width = width;
            Height = height;
        }

        public int Width { get; }
        public int Height { get; }

        public static implicit operator CartesianCoordinates(Dimensions dimensions)
        {
            return new CartesianCoordinates(dimensions.Width, dimensions.Height);
        }
    }
}
