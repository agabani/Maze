using System;
using Maze.Application.Values;

namespace Maze.Application.Models
{
    public class MazeCanvas
    {
        public MazeCanvas(int width, int height)
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

        public static CartesianCoordinates DeTranslate(int x, int z)
        {
            return new CartesianCoordinates((x - 1) / 2, (z - 1) / 2);
        }
    }
}