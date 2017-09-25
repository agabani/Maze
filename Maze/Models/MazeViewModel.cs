using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Maze.Models
{
    public class MazeViewModel
    {
        public MazeViewModel(string[][] map, int width, int height, int seed)
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
