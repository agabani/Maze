namespace Maze.Application.Values
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

        public static implicit operator CanvasCoordinates(CartesianCoordinates coordinates)
        {
            return new CanvasCoordinates(coordinates.X * 2 + 1, coordinates.Z * 2 + 1);
        }

        protected bool Equals(CartesianCoordinates other)
        {
            return X == other.X && Z == other.Z;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != GetType()) return false;
            return Equals((CartesianCoordinates) obj);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return (X * 397) ^ Z;
            }
        }
    }
}