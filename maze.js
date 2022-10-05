/*
Maze Maker
based on the depth-first search algorithm
*/

var maze = document.getElementById ("maze");
var ctx = maze.getContext ("2d");

function run ()
{
	let numRows = document.getElementById ("rows").value;
	let numCols = document.getElementById ("cols").value;
	let wrap = document.getElementById ("wrap").checked;
	let newMaze = new Maze (numRows, numCols, wrap);
	newMaze.createMaze ();
	newMaze.draw ();
}



class Maze
{
	// if wrapAround is true, then cells on the left edge are adjacent to those on the right edge
	constructor (rows, cols, wrapAround)
	{
		this.rows = rows;
		this.cols = cols;
		this.wrapAround = wrapAround;
		this.visited = [];
		this.stack = []; // stores the "stack" where visited coordinates are stored and removed
		this.verWalls = [];
		this.horWalls = [];

		this.initGrid (this.visited, this.rows, this.cols, false);
		this.initGrid (this.verWalls, this.rows, this.cols + 1, true);
		this.initGrid (this.horWalls, this.rows + 1, this.cols, true);
	}

	// draw the maze
	draw ()
	{
		maze.width = this.cols * 20;
		maze.height = this.rows * 20;

		// vertical walls
		for (let r = 0; r < this.rows; r++)
		{
			for (let c = 0; c <= this.cols; c++)
			{
				if (this.verWalls[r][c])
				{
					ctx.beginPath ();
					ctx.moveTo (c * 20, r * 20);
					ctx.lineTo (c * 20, r * 20 + 20);
					ctx.stroke ();
				}
			}
		}

		// horizontal walls
		for (let r = 0; r <= this.rows; r++)
		{
			for (let c = 0; c < this.cols; c++)
			{
				if (this.horWalls[r][c])
				{
					ctx.beginPath ();
					ctx.moveTo (c * 20, r * 20);
					ctx.lineTo (c * 20 + 20, r * 20);
					ctx.stroke ();
				}
			}
		}
	}

	// default start (r, c) is (0, 0)
	createMaze ()
	{
		this.createMazeWithStart (0, 0);
	}

	// main maze creation algorithm
	createMazeWithStart (startRow, startCol)
	{
		let done = false;
		let r = startRow;
		let c = startCol;

		while (!done)
		{
			// mark current cell as visited
			//console.log (r + ',' + c);
			this.visited[r][c] = true;

			// store list of unvisited adjacent cells
			let list = this.getUnvisitedAdjacentCells (r, c);
			let n = list.length;

			if (n == 0)
			{
				// when all adjacent cells are visited and stack is empty, algorithm is done
				if (this.stack.length == 0)
					done = true;
				// when all adjacent cells are visited and stack is not empty, the next position in the stack needs to be checked
				else
				{
					r = this.stack[this.stack.length - 1].r;
					c = this.stack[this.stack.length - 1].c;
					this.stack.pop ();
				}
			}
			else
			{
				// pick a random index from the list of unvisited adjacent cells
				let i = Math.floor (Math.random () * n);

				// remove walls
				this.removeWalls (r, c, list[i].r, list[i].c);

				// add current position to stack
				this.stack.push (this.createCoordPair (r, c));

				// set new position as current position for the next iteration
				r = list[i].r;
				c = list[i].c;
			}
		}
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

	// removes walls between two cells
	removeWalls (r1, c1, r2, c2)
	{
		// cell 1 is above cell 2
		if (r1 - r2 == -1)
			this.horWalls[r2][c2] = false;

		// cell 1 is below cell 2
		if (r1 - r2 == 1)
			this.horWalls[r1][c1] = false;

		// cell 1 is left of cell 2
		if (c1 - c2 == -1)
			this.verWalls[r2][c2] = false;
		if (this.wrapAround && c1 - c2 == this.cols - 1)
		{
			this.verWalls[r1][c1 + 1] = false;
			this.verWalls[r2][c2] = false;
		}

		// cell 1 is right of cell 2
		if (c1 - c2 == 1)
			this.verWalls[r1][c1] = false;
		if (this.wrapAround && c2 - c1 == this.cols - 1)
		{
			this.verWalls[r1][c1] = false;
			this.verWalls[r2][c2 + 1] = false;
		}
	}

	// returns reference to a coordinate pair object
	createCoordPair (row, col)
	{
		let coordPair =
		{
			r: row,
			c: col
		};
		return coordPair;
	}

	// returns an array of coordinates of unvisited cells adjacent to the cell at (r, c)
	getUnvisitedAdjacentCells (r, c)
	{
		let coords = [];

		// check above
		if (r - 1 >= 0 && !this.visited[r - 1][c])
			coords.push (this.createCoordPair (r - 1, c));
		
		// check below
		if (r + 1 < this.rows && !this.visited[r + 1][c])
			coords.push (this.createCoordPair (r + 1, c));
		
		// check left
		if (c - 1 >= 0)
		{
			if (!this.visited[r][c - 1])
				coords.push (this.createCoordPair (r, c - 1));
		}
		else if (this.wrapAround && !this.visited[r][this.cols - 1])
			coords.push (this.createCoordPair (r, this.cols - 1));
		
		// check right
		if (c + 1 < this.cols)
		{
			if (!this.visited[r][c + 1])
				coords.push (this.createCoordPair (r, c + 1));
		}
		else if (this.wrapAround && !this.visited[r][0])
			coords.push (this.createCoordPair (r, 0));

		return coords;
	}
}
