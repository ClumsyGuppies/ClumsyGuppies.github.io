/*
game.js for Perlenspiel 3.3.x
Last revision: 2020-03-24 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-20 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/



/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.init() event handler:

let colors = [PS.COLOR_RED, PS.COLOR_ORANGE, 
	PS.COLOR_YELLOW, PS.COLOR_GREEN, PS.COLOR_BLUE,PS.COLOR_VIOLET]

let colIndex = 0
let clicked = false
let channel
let DIM = 14
let repeat = false
let map

let drumChannel = ""
let harpChannel = ""
let pianoChannel = ""
let dropChannel = ""

var me = ( function () {

	var section = function(lx, ly, colorA, colorIa, instrument){
		PS.debug("sad time\n");
		for(lx <= DIM/2? i = 0 : i = DIM/2; lx <= DIM/2? i < lx: i >= DIM/2 && i < DIM; i++){
			for(ly <= DIM/2? j = 0 : j = DIM/2; ly <= DIM/2? j < ly: j >= DIM/2 && j < DIM; j++){
				PS.data(i, j, [false, colorA, colorIa, instrument]);
				PS.color(i, j, colorIa);
				//PS.debug(i + " " + j + "\n");
			}
		}
	};

	var populate = function(){
		//cell data:
	/**
	 * isActive
	 * cellColorActive
	 * cellColorInactive
	 * cellInstrument
	*/
	
		//PS.debug("populate called");
		section(DIM/2, DIM/2, PS.COLOR_BLUE, 0xa2defc, drumChannel); //top left
		section(DIM, DIM/2, PS.COLOR_GREEN, 0xdfffde, pianoChannel); //top right
		section(DIM/2, DIM, PS.COLOR_RED, 0xfad7e9, harpChannel); //bottom left
		section(DIM, DIM, PS.COLOR_VIOLET, 0xdcc2f2, dropChannel); //bottom right
		
	

	}; 

	
	var loadSounds = function(){
		var loadP = function ( data ) {
			pianoChannel = data.channel; // save ID
		};
		var loadH = function ( data ) {
			harpChannel = data.channel; // save ID
		};
		var loadDru = function ( data ) {
			drumChannel = data.channel; // save ID
		};
		var loadDro = function ( data ) {
			dropChannel = data.channel; // save ID
		};

		PS.audioLoad( "perc_conga_low", {
			lock: true,
			onLoad : loadDru // specify loader function
		} );
		PS.audioLoad( "piano_e6", {
			lock: true,
			onLoad : loadP // specify loader function
		} );
		PS.audioLoad( "hchord_eb5", {
			lock: true,
			onLoad : loadH // specify loader function
		} );
		PS.audioLoad( "fx_bloop", {
			lock: true,
			onLoad : loadDro // specify loader function
		} );
	};


	var exports = {
	
	
	init : function () {
	PS.gridSize( DIM, DIM ); // init grid
	PS.gridColor( PS.COLOR_WHITE );
	
	// Change status line color and text

	PS.statusColor( PS.COLOR_VIOLET );
	PS.statusText( "mozART! Hold R to enable repeater" );
	
	loadSounds();
	populate();

	// var loader = function ( data ) {
	// 	music = data.channel; // save ID
	// };
	// PS.audioLoad( "perc_conga_low", {
	// 	lock: true,
	// 	onLoad : loader // specify loader function
	// } );

	//PS.audioPlayChannel(data[3]);
	
	
	//whether tile is active, whether or not tile should repeat, and how many times repeats per second (tempo) 
	//cell data:
	/**
	 * isActive
	 * cellColorActive
	 * cellColorInactive
	 * cellInstrument
	*/
	//PS.data(PS.ALL, PS.ALL, [false, false, 1, music, PS.COLOR_RED]);

	//utilize map, similar to gold collector example, to draw out each
	//instrument in place and assign color data to each cell
	// map = [
	// 	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	// 	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	// 	0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0,
	// 	0, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 0,
	// 	0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0,
	// 	0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0,
	// 	0, 1, 0, 2, 0, 1, 1, 1, 1, 1, 0, 2, 0, 1, 0,
	// 	0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0,
	// 	0, 1, 0, 2, 0, 1, 1, 1, 1, 1, 0, 2, 0, 1, 0,
	// 	0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0,
	// 	0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0,
	// 	0, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 0,
	// 	0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0,
	// 	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	// 	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	// 	];
		
	// 	//active? repeat? repeat per second? sound?
	// 	var psData = [false, false, 1, music]
	// 	for(i= 0;i<DIM - 1; i++){
	// 		for(j=0;j<DIM-1;j++){
	// 			switch(map[i, j]){
	// 				case 0:
	// 					var pData = psData;
	// 					PS.color(i, j, PS.COLOR_YELLOW);
	// 					pData.push(PS.COLOR_YELLOW);
	// 					PS.data(i, j, pData);
	// 					break;
	// 				case 1:
	// 					break;
	// 					//....TODO
	// 			}
	// 		}
	// 	}
	//PS.audioLoad( "omake-pfadlib", {path: "./", fileTypes: ["mp3"], onLoad : loader });
	}
	};
	
   
	return exports;
   } () );

PS.init = me.init;

/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.touch() event handler:


PS.touch = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	/**
	 * isActive 0
	 * cellColorActive 1
	 * cellColorInactive 2
	 * cellInstrumentChannel 3
	*/
	PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );
	PS.debug( PS.data(x, y)[0] + " " + data[1]+ " " + data[2]+ " " + data[3] +  "\n" );

	if(repeat){ //click sound + keep repeating
		if(data[0]) {//if active, currently repeating
			//turn off sound and change active status to false
			PS.audioStop(data[3]);
			data[0] = false; //no longer active
			PS.color(x, y, data[2]);

			//gray out instrument color; this will change from just 
			//changing color of cell clicked to changing colors of all cells 
			//that make up that instrument
			//PS.color(x, y, PS.COLOR_WHITE);

		} else { //not active, not currently repeating
			//turn on repeater and change active status to true
			PS.audioPlayChannel(data[3], {loop: true});
			data[0] = true;
			PS.color(x, y, data[1]);

			//add in instrument color; will change to change all cells 
			//in instrument to correct colors, not just selected cell
			//PS.color(x, y, data[4]);
		}

	} else { //no repeat
		PS.debug("data " + data[3]);
		PS.audioPlayChannel(data[3]);
		PS.audioPlayChannel(drumChannel);
		
		//flash color when pressed but change back to gray when done
		PS.color(x, y, data[1]);
	}
	


	

	// Uncomment the following code line
	// to inspect x/y parameters:


	// Add code here for mouse clicks/touches
	// over a bead.
};



/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.release() event handler:



PS.release = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	repeat? PS.color(x, y, PS.CURRENT) : PS.color(x, y, data[2]);
	

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};



/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.enter() event handler:

/*

PS.enter = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};

*/

/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.exit() event handler:



PS.exit = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	repeat? PS.color(x, y, PS.CURRENT) : PS.color(x, y, data[2]);

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};



/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.exitGrid() event handler:

/*

PS.exitGrid = function( options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

*/

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.keyDown() event handler:



PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict"; // Do not remove this directive!

	repeat = key == 114 ? true : false;
	
	PS.debug("repeat down: " + repeat);
	

};


/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.keyUp() event handler:



PS.keyUp = function( key, shift, ctrl, options ) {
	"use strict"; // Do not remove this directive!

	repeat = false;
	PS.debug("repeat up: " + repeat);

};



/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

// UNCOMMENT the following code BLOCK to expose the PS.input() event handler:

/*

PS.input = function( sensors, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

*/

/*
PS.shutdown ( options )
Called when the browser window running Perlenspiel is about to close.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: This event is generally needed only by applications utilizing networked telemetry.
*/

// UNCOMMENT the following code BLOCK to expose the PS.shutdown() event handler:

/*

PS.shutdown = function( options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to verify operation:

	// PS.debug( "“Dave. My mind is going. I can feel it.”\n" );

	// Add code here to tidy up when Perlenspiel is about to close.
};

*/
