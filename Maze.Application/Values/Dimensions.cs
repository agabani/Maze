namespace Maze.Application.Values
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

        public static implicit operator CanvasCoordinates(Dimensions dimensions)
        {
            return new CanvasCoordinates(dimensions.Width, dimensions.Height);
        }
    }
}