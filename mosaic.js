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
	// Color buttons
	mouse.setColor ('b116', '#e5fcd9');
	document.getElementById ("erase").onclick = function () { mouse.setColor ('erase', '#ffffff'); };
	document.getElementById ("b116").onclick = function () { mouse.setColor ('b116', '#e5fcd9'); };
	document.getElementById ("b115").onclick = function () { mouse.setColor ('b115', '#cbdf80'); };
	document.getElementById ("b119").onclick = function () { mouse.setColor ('b119', '#9cd37f'); };
	document.getElementById ("b118").onclick = function () { mouse.setColor ('b118', '#3b7f19'); };
});

const canvas = document.querySelector ('#canvas');
const rowInput = document.querySelector ('#rows');
const colInput = document.querySelector ('#cols');
const ctx = canvas.getContext('2d'); // Context for the canvas for 2 dimensional operations

const DEFAULT_COLOR = '#ffffff';

let mouse =
{
	x: 0,
	y: 0,
	r: 0,
	c: 0,
	down: false,
	color: '#e5fcd9',
	selected: 'b116',
	
	// Update the x and y of the mouse position
	updateXY: function (event)
	{
		this.x = event.layerX - canvas.offsetLeft;
		this.y = event.layerY - canvas.offsetTop;
		document.getElementById ("xCoord").innerHTML = this.x;
		document.getElementById ("yCoord").innerHTML = this.y;
	},

	// Update the row and column of the mouse position (uses x and y)
	updateRC: function ()
	{
		let relX = this.x - grid.x;
		let relY = this.y - grid.y;
		relX /= grid.tile;
		relY /= grid.tile;
		document.getElementById ("rowCoord").innerHTML = this.r = Math.floor (relY);
		document.getElementById ("colCoord").innerHTML = this.c = Math.floor (relX);
	},

	// Set the color of the mouse and select in in HTML
	setColor (id, newColor)
	{
		document.getElementById (this.selected).className = '';
		this.selected = id;
		document.getElementById (this.selected).className = 'selected';
		this.color = newColor;
	}
};

function updateMousePos (event)
{
	mouse.updateXY (event);
	mouse.updateRC ();
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
	grid.updateTile ();
	grid.draw ();
}

let grid =
{
	rows: 10,
	cols: 10,
	x: 0,
	y: 0,
	width: 200,
	height: 200,
	tile: 20,
	colors: [],

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
		if (mouse.r >= 0 && mouse.r < this.rows && mouse.c >= 0 && mouse.c < this.cols)
		{
			this.colors[mouse.r][mouse.c] = mouse.color;
		}
	}
};
