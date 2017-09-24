using System;

namespace Maze.Application.Services
{
    public class MazeGenerator
    {
        public string[][] Generate(int width, int height, int? seed = null)
        {
            var maze = new Maze(width, height);

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



            return maze.Map;
        }
    }

    public class Maze
    {
        public Maze(int width, int height)
        {
            var (xm, zm) = Translate(width, height);

            Map = new string[zm][];
            for (var z = 0; z < Map.Length; z++)
            {
                Map[z] = new string[xm];
                for (var x = 0; x < Map[z].Length; x++)
                    Map[z][x] = "w";
            }
        }

        public string[][] Map { get; }

        public void Connect(CartesianCoordinates a, CartesianCoordinates b)
        {
            (int x, int z) from;
            (int x, int z) to;

            if (a.Z < b.Z && a.X == b.X || a.X < b.X && a.Z == b.Z)
            {
                from = Translate(a);
                to = Translate(b);
            }
            else if (b.Z < a.Z && b.X == a.X || b.X < a.X && b.Z == a.Z)
            {
                from = Translate(b);
                to = Translate(a);
            }
            else
            {
                throw new ArgumentException();
            }

            for (var z = from.z; z <= to.z; z++)
            for (var x = from.x; x <= to.x; x++)
                Map[z][x] = " ";
        }

        public string Get(CartesianCoordinates coordinates)
        {
            var (x, z) = Translate(coordinates);
            return Map[z][x];
        }

        public void Set(CartesianCoordinates coordinates, string value)
        {
            var (x, z) = Translate(coordinates);
            Map[z][x] = value;
        }

        private static (int x, int z) Translate(CartesianCoordinates coordinates)
        {
            return Translate(coordinates.X, coordinates.Z);
        }

        private static (int x, int z) Translate(int x, int z)
        {
            return (x * 2 + 1, z * 2 + 1);
        }
    }

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