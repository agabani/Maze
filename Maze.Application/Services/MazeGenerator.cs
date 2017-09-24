namespace Maze.Application.Services
{
    public class MazeGenerator
    {
        public string[][] Generate(int width, int height, int? seed = null)
        {
            var maze = new Models.MazeCanvas(width, height);

            maze.Connect(new CartesianCoordinates(1, 0), new CartesianCoordinates(2, 0));
            maze.Connect(new CartesianCoordinates(2, 0), new CartesianCoordinates(2, 2));
            maze.Connect(new CartesianCoordinates(2, 2), new CartesianCoordinates(3, 2));
            maze.Connect(new CartesianCoordinates(3, 2), new CartesianCoordinates(3, 0));
            maze.Connect(new CartesianCoordinates(3, 0), new CartesianCoordinates(4, 0));
            maze.Connect(new CartesianCoordinates(4, 0), new CartesianCoordinates(4, 1));
            maze.Connect(new CartesianCoordinates(4, 1), new CartesianCoordinates(5, 1));
            maze.Connect(new CartesianCoordinates(5, 1), new CartesianCoordinates(5, 2));

            maze.Connect(new CartesianCoordinates(2, 2), new CartesianCoordinates(2, 3));
            maze.Connect(new CartesianCoordinates(2, 3), new CartesianCoordinates(4, 3));
            maze.Connect(new CartesianCoordinates(4, 3), new CartesianCoordinates(4, 2));

            maze.Connect(new CartesianCoordinates(4, 3), new CartesianCoordinates(6, 3));
            maze.Connect(new CartesianCoordinates(6, 3), new CartesianCoordinates(6, 0));
            maze.Connect(new CartesianCoordinates(6, 0), new CartesianCoordinates(5, 0));

            maze.Connect(new CartesianCoordinates(6, 0), new CartesianCoordinates(7, 0));
            maze.Connect(new CartesianCoordinates(7, 0), new CartesianCoordinates(7, 1));

            maze.Connect(new CartesianCoordinates(6, 2), new CartesianCoordinates(7, 2));

            maze.Connect(new CartesianCoordinates(6, 3), new CartesianCoordinates(6, 4));
            maze.Connect(new CartesianCoordinates(6, 4), new CartesianCoordinates(7, 4));
            maze.Connect(new CartesianCoordinates(7, 4), new CartesianCoordinates(7, 3));

            maze.Connect(new CartesianCoordinates(7, 4), new CartesianCoordinates(7, 5));

            maze.Connect(new CartesianCoordinates(6, 4), new CartesianCoordinates(6, 6));
            maze.Connect(new CartesianCoordinates(6, 6), new CartesianCoordinates(7, 6));
            maze.Connect(new CartesianCoordinates(7, 6), new CartesianCoordinates(7, 7));
            maze.Connect(new CartesianCoordinates(7, 7), new CartesianCoordinates(3, 7));
            maze.Connect(new CartesianCoordinates(5, 7), new CartesianCoordinates(5, 6));

            maze.Connect(new CartesianCoordinates(6, 5), new CartesianCoordinates(4, 5));
            maze.Connect(new CartesianCoordinates(4, 5), new CartesianCoordinates(4, 6));
            maze.Connect(new CartesianCoordinates(4, 6), new CartesianCoordinates(1, 6));
            maze.Connect(new CartesianCoordinates(1, 6), new CartesianCoordinates(1, 7));
            maze.Connect(new CartesianCoordinates(1, 7), new CartesianCoordinates(2, 7));

            maze.Connect(new CartesianCoordinates(1, 7), new CartesianCoordinates(0, 7));

            maze.Connect(new CartesianCoordinates(1, 6), new CartesianCoordinates(0, 6));

            maze.Connect(new CartesianCoordinates(1, 6), new CartesianCoordinates(1, 5));

            maze.Connect(new CartesianCoordinates(2, 6), new CartesianCoordinates(2, 4));
            maze.Connect(new CartesianCoordinates(2, 4), new CartesianCoordinates(0, 4));
            maze.Connect(new CartesianCoordinates(0, 4), new CartesianCoordinates(0, 5));

            maze.Connect(new CartesianCoordinates(1, 4), new CartesianCoordinates(1, 3));

            maze.Connect(new CartesianCoordinates(2, 4), new CartesianCoordinates(3, 4));

            maze.Connect(new CartesianCoordinates(4, 5), new CartesianCoordinates(3, 5));

            maze.Connect(new CartesianCoordinates(4, 5), new CartesianCoordinates(4, 4));

            maze.Connect(new CartesianCoordinates(5, 3), new CartesianCoordinates(5, 4));

            maze.Connect(new CartesianCoordinates(2, 2), new CartesianCoordinates(0, 2));
            maze.Connect(new CartesianCoordinates(0, 2), new CartesianCoordinates(0, 3));

            maze.Connect(new CartesianCoordinates(0, 2), new CartesianCoordinates(0, 0));

            maze.Connect(new CartesianCoordinates(1, 2), new CartesianCoordinates(1, 1));

            return maze.Map;
        }
    }
}