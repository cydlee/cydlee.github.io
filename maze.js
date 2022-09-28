/*
Maze Maker
based on the depth-first search algorithm
*/

var maze = document.getElementById ("maze");
var ctx = maze.getContext ("2d");

function test ()
{
	let thing = new Maze (10, 10, true);
}



class Maze
{
	// if wrapAround is true, then cells on the left edge are adjacent to those on the right edge
	constructor (rows, cols, wrapAround)
	{
		this.x = 0;
		this.y = 0;
		this.rows = rows;
		this.cols = cols;
		this.wrapAround = wrapAround;
		this.visited = [];
		this.stack = []; // stores the "stack" where visited coordinates are stored and removed
		this.verWalls = [];
		this.horWalls = [];

		this.initGrid (this.visited, this.rows, this.cols, 0);
		this.initGrid (this.verWalls, this.rows, this.cols + 1, 1);
		this.initGrid (this.horWalls, this.rows + 1, this.cols, 1);
	}

	// initializes an empty array (grid) of size (rows) x (columns) with (value)
	initGrid (grid, rows, cols, value)
	{
		for (let r = 0; r < rows; r++)
		{
			grid.push (new Array (cols));
			for (let c = 0; c < cols; c++)
			{
				grid[r][c] = value;
			}
		}
	}

	// returns an array of coordinates of unvisited cells adjacent to the cell at (r, c)
	getAdjacentCells (r, c)
	{
		let coords = [];
		// check above
		if (r - 1 > 0)
		{

		}
		else if (this.wrapAround)
		{
			if (!this.visited[this.rows - 1][c])
			{
				let coords = { row : this.rows - 1, col : c };
				list.push (coords);
			}
		}
		// check below
		// check left
		// check right
	}
}
