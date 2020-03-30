/*
Diana Kumykova
Team: Clumsy Guppy Studios
Changes:
-changed text status message
-change on enter + exit bead behavior
-change bead behavior to cycle through colors + opacities as draw over beads
-change grid size to 10 by 10
-change grid background to white


game.js for Perlenspiel 3.3.x


Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-18 Worcester Polytechnic Institute.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
By default, all event-handling function templates are COMMENTED OUT (using block-comment syntax), and are therefore INACTIVE.
Uncomment and add code to the event handlers required by your project.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these lines.
*/

/* jshint browser : true, devel : true, esversion : 5, freeze : true */
/* globals PS : true */

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/
let colors = [PS.COLOR_RED, PS.COLOR_ORANGE, 
	PS.COLOR_YELLOW, PS.COLOR_GREEN, PS.COLOR_BLUE,PS.COLOR_VIOLET]

let colIndex = 0
let clicked = false
let channel
var music = ""
let DIM = 10

var me = ( function () {
	// By convention, constants are all upper-case

	
	//let DIM = 10,

	// The 'exports' object is used to define
	// variables and/or functions that need to be
	// accessible outside this function.
	// So far, it contains only one property,
	// an 'init' function with no parameters.
   
	var exports = {
   
	//returns true if all cells have alpha value of 255, else false
	allColor: function(){
		for(var i = 0; i < DIM; i++){
			for(var j = 0; j < DIM; j++){
				if(PS.color(i, j) != colors[colIndex]){
					return false;
				}
			}
		}
		return true;
	},

	init : function () {
	PS.gridSize( DIM, DIM ); // init grid
	PS.gridColor( PS.COLOR_WHITE );
	
	// Change status line color and text

	PS.statusColor( PS.COLOR_VIOLET );
	PS.statusText( "It's Rainbow Time" );
	
	PS.color(PS.ALL, PS.ALL, colors[colIndex]);
	PS.alpha(PS.ALL, PS.ALL, 0);
	// Preload click sound

	var loader = function ( data ) {
		music = data.channel; // save ID
	};

	PS.audioLoad( "omake-pfadlib", {path: "./", fileTypes: ["mp3"], onLoad : loader });
	}
	};
	
	// Return the 'exports' object as the value
	// of this function, thereby assigning it
	// to the global G variable. This makes
	// its properties visible to Perlenspiel.
   
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

PS.touch = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!	

	clicked = true;

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
	clicked = false;
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



PS.enter = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	var neighbors = [];
	var tleft = {x: -1, y: -1}; 
	var t = {x: 0, y: -1}; 
	var tright = {x: 1, y: -1}; 
	var left = {x: -1, y: 0};  
	var right = {x: 1, y: 0}; 
	var bright = {x: -1, y: 1}; 
	var b = {x: 0, y: 1}; 
	var bleft = {x: 1, y: 1}; 
	neighbors.push(tleft, t, tright, left, right, bright, b, bleft);

	if(!clicked){
		return;
	}

	var a = PS.alpha(x, y) + 75 < 255? PS.alpha(x, y) + 75 : 255;

	if(a == 255){
		if(!colIndex || me.allColor()){
			colIndex++;
		} 

		if(colIndex >= colors.length - 1){
			//PS.color(x, y, colors[colIndex]);
			PS.alpha(x, y, 255);
		} else {
			//PS.debug("color length: " + colIndex);
			PS.color(x, y, colors[colIndex]);
			PS.alpha(x, y, 75);
		}

	} else {
		PS.alpha(x, y, a);
	}
	
	//neighbors
	neighbors.forEach((el) => {
		var nX = x + el.x;
		var nY = y + el.y;

		if(nX >= 0 && nY >= 0 && nX < DIM && nY < DIM){

			var al = PS.alpha(nX, nY); //current neighbor alpha
			//PS.debug(al);
			var newAl = 0;

			if(al + 20 < 255){
				newAl = al + 20;
			} else {
				if(!colIndex){ //change to next color to start new cycle
					//PS.debug("first full cell, gets new color!");
					colIndex++;	
					PS.color(nX, nY, colors[colIndex]);
					newAl = 20;
				} else {
					if(me.allColor()){ //if all cells are completely 1 color
						PS.debug("color length: " + colIndex);
						if(colIndex >= colors.length - 1){
							newAl = 255;
						} else {
							//PS.debug("all cells are full");
							colIndex++; //go to next color 
							PS.color(nX, nY, colors[colIndex]);
							newAl = 20;

						}
					}

					
				}
				
				PS.color(nX, nY, colors[colIndex]);
				
			}

			PS.alpha(nX, nY, newAl);
			//channel = colIndex < 1 ? PS.audioPlayChannel( music ): PS.audioPause( channel );
			
		}
		
	});

};



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
	// if(colIndex){
	// 	channel = PS.audioPause( channel ); // restart it

	// }
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

/*

PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.
};

*/

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

/*

PS.keyUp = function( key, shift, ctrl, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

*/

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
