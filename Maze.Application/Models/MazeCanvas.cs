using System;
using Maze.Application.Values;

namespace Maze.Application.Models
{
    public class MazeCanvas
    {
        public MazeCanvas(int width, int height)
        {
            CanvasCoordinates c = new CartesianCoordinates(width, height);

            Map = new string[c.Z][];
            for (var z = 0; z < Map.Length; z++)
            {
                Map[z] = new string[c.X];
                for (var x = 0; x < Map[z].Length; x++)
                    Map[z][x] = "w";
            }
        }

        public string[][] Map { get; }

        public void Connect(CanvasCoordinates a, CanvasCoordinates b)
        {
            CanvasCoordinates from;
            CanvasCoordinates to;

            if (a.Z < b.Z && a.X == b.X || a.X < b.X && a.Z == b.Z)
            {
                from = a;
                to = b;
            }
            else if (b.Z < a.Z && b.X == a.X || b.X < a.X && b.Z == a.Z)
            {
                from = b;
                to = a;
            }
            else
            {
                throw new ArgumentException();
            }

            for (var z = from.Z; z <= to.Z; z++)
            for (var x = from.X; x <= to.X; x++)
                Map[z][x] = " ";
        }

        public string Get(CartesianCoordinates coordinates)
        {
            CanvasCoordinates c = coordinates;
            return Map[c.Z][c.X];
        }

        public void Set(CartesianCoordinates coordinates, string value)
        {
            CanvasCoordinates c = coordinates;
            Map[c.Z][c.X] = value;
        }

        public static CartesianCoordinates DeTranslate(int x, int z)
        {
            return new CartesianCoordinates((x - 1) / 2, (z - 1) / 2);
        }
    }
}