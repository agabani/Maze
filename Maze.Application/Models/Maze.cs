namespace Maze.Application.Models
{
    public class Maze
    {
        public Maze(string[][] map, int width, int height, int seed)
        {
            Map = map;
            Width = width;
            Height = height;
            Seed = seed;
        }

        public string[][] Map { get; }
        public int Width { get; }
        public int Height { get; }
        public int Seed { get; }
    }
}