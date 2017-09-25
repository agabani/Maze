namespace Maze.Generation
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

        public static implicit operator Dimensions(CartesianCoordinates coordinates)
        {
            return new Dimensions(coordinates.X, coordinates.Z);
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