using System;
using Maze.Generation;

namespace Maze.Application.Models
{
    public class Canvas
    {
        private const string Goal = "g";
        private const string Path = " ";
        private const string Wall = "w";

        public Canvas(Dimensions dimensions)
        {
            Map = new string[dimensions.Height][];
            for (var z = 0; z < Map.Length; z++)
            {
                Map[z] = new string[dimensions.Width];
                for (var x = 0; x < Map[z].Length; x++)
                    Map[z][x] = Wall;
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
                Map[z][x] = Path;
        }

        public void SetGoal(CanvasCoordinates coordinates)
        {
            Map[coordinates.Z][coordinates.X] = Goal;
        }
    }
}