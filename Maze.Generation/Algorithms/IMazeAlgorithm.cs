namespace Maze.Generation.Algorithms
{
    public interface IMazeAlgorithm
    {
        Graph ProcedurallyGenerate(Dimensions dimensions, int seed);
    }
}