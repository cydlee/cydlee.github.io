// Wait for the content of the window element to load, then perform the operations
window.addEventListener('load', ()=>{
        
	grid.initColors ();
    resize (); // Resizes the canvas once the window loads
    window.addEventListener ('resize', resize);
	window.addEventListener ('mousedown', mouseDown);
	window.addEventListener ('mouseup', mouseUp);
	canvas.addEventListener ('mousemove', updateMousePos);
	rowInput.addEventListener ('input', () => {grid.updateRows ();});
	colInput.addEventListener ('input', () => {grid.updateCols ();});
	grid.updateRows ();
	grid.updateCols ();
});
    
const canvas = document.querySelector ('#canvas');
const rowInput = document.querySelector ('#rows');
const colInput = document.querySelector ('#cols');
// Context for the canvas for 2 dimensional operations
const ctx = canvas.getContext('2d');

const DEFAULT_COLOR = '#ff0000';

let mouse = {x: 0, y: 0, down: false};

let grid =
{
	rows: 10,
	cols: 10,
	x: 0,
	y: 0,
	width: 200,
	height: 200,
	tile: 20,
	mouseR: 0,
	mouseC: 0,
	colors: [],

	// Update the mouse row and column based on mouse XY; can only be called after updating mouse XY
	updateMouseRC: function ()
	{
		let relX = mouse.x - this.x;
		let relY = mouse.y - this.y;
		relX /= this.tile;
		relY /= this.tile;
		document.getElementById ("rowCoord").innerHTML = this.mouseR = Math.floor (relY);
		document.getElementById ("colCoord").innerHTML = this.mouseC = Math.floor (relX);
	},

	// Draw the mosaic grid
	draw: function ()
	{
		// Clear screen
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw color boxes
		for (let r = 0; r < this.rows; r++)
		{
			for (let c = 0; c < this.cols; c++)
			{
				let beginX = this.x + (c * this.tile);
				let beginY = this.y + (r * this.tile);
				ctx.fillStyle = this.colors[r][c];
				ctx.fillRect (beginX, beginY, this.tile, this.tile);
			}
		}

		// Draw horizontal lines
		for (let r = 0; r <= this.rows; r++)
		{
			ctx.beginPath ();
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 1;
			ctx.moveTo (this.x, this.y + (r * this.tile));
			ctx.lineTo (this.x + this.width, this.y + (r * this.tile));
			ctx.stroke ();
		}

		// Draw vertical lines
		for (let c = 0; c <= this.cols; c++)
		{
			ctx.beginPath ();
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 1;
			ctx.moveTo (this.x + (c * this.tile), this.y);
			ctx.lineTo (this.x + (c * this.tile), this.y + this.height);
			ctx.stroke ();
		}
	},

	// Updates XY
	updateXY ()
	{
		this.width = this.cols * this.tile;
		this.height = this.rows * this.tile;
		this.x = Math.floor ((ctx.canvas.width / 2) - (this.width / 2));
		this.y = Math.floor ((ctx.canvas.height / 2) - (this.height / 2));
	},

	// Updates this.tile
	updateTile ()
	{
		let rowsTile = ctx.canvas.height / (1.1 * this.rows);
		let colsTile = ctx.canvas.width / (1.1 * this.cols);
		if (rowsTile < colsTile)
			this.tile = rowsTile;
		else
			this.tile = colsTile;
		this.updateXY ();
	},

	// Updates this.rows and dependencies
	updateRows: function ()
	{
		// Update this.rows from HTML
		this.rows = parseInt (document.getElementById ("rows").value);
		this.updateTile ();
		// Update color grid (conditionally)
		if (this.rows > this.colors.length)
			this.addRows (this.rows - this.colors.length);
		this.draw ();
	},

	// Updates this.cols and dependencies
	updateCols: function ()
	{
		// Update this.cols from HTML
		this.cols = parseInt (document.getElementById ("cols").value);
		this.updateTile ();
		// Update color grid (conditionally)
		if (this.cols > this.colors[0].length)
			this.addCols (this.cols - this.colors[0].length);
		this.draw ();
	},

	// Initializes the color grid using this.rows and this.cols with DEFAULT_COLOR
	initColors: function ()
	{
		for (let r = 0; r < this.rows; r++)
		{
			let newRow = [];
			for (let c = 0; c < this.cols; c++)
			{
				newRow.push (DEFAULT_COLOR);
			}
			this.colors.push (newRow);
		}
	},

	// Adds rows to the color grid
	addRows: function (rowsToAdd)
	{
		for (let i = 0; i < rowsToAdd; i++)
		{
			let newRow = [];
			for (let c = 0; c < this.cols; c++)
			{
				newRow.push (DEFAULT_COLOR);
			}
			this.colors.push (newRow);
		}
	},

	// Adds cols to the color grid
	addCols: function (colsToAdd)
	{
		for (let i = 0; i < colsToAdd; i++)
		{
			for (let r = 0; r < this.rows; r++)
			{
				this.colors[r].push (DEFAULT_COLOR);
			}
		}
	},

	// Changes colors in the grid when mouse is down
	changeColor ()
	{
		if (this.mouseR >= 0 && this.mouseR < this.rows && this.mouseC >= 0 && this.mouseC < this.cols)
		{
			this.colors[this.mouseR][this.mouseC] = '#0000ff';
		}
	}
};

function updateMousePos (event)
{
	mouse.x = event.layerX - canvas.offsetLeft;
	mouse.y = event.layerY - canvas.offsetTop;
	document.getElementById ("xCoord").innerHTML = mouse.x;
	document.getElementById ("yCoord").innerHTML = mouse.y;
	grid.updateMouseRC ();
	if (mouse.down)
		grid.changeColor ();
	grid.draw ();
}

function mouseDown (event)
{
	mouse.down = true;
	updateMousePos (event);
}

function mouseUp ()
{
	mouse.down = false;
}

// Resizes the canvas to the available size of the window.
function resize ()
{
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight - canvas.offsetTop;
	grid.draw ();
}
