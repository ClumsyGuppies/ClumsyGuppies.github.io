/*

Name: Isabelle Cordova
Team: Clumsy Guppy

Mod 1: Changed grid size from default 8x8 to 15x8
Mod 2: Added themed Call to Action to status line
Mod 3: Set grid background to deep purple space-like color (0x212240)
Mod 4: Changed all border width to 0
Mod 5: Set individual cell colors
Mod 6: Add star glyphs to cells
Mod 7: Added xylophone sound when user clicks star glyph
Mod 8: Removed black and white touch features


game.js for Perlenspiel 3.3.x
Last revision: 2018-10-14 (BM)

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

PS.init = function( system, options ) {
	"use strict"; // Do not remove this directive!

	// Establish grid dimensions
	
	PS.gridSize( 15, 8 );
	
	// Set background color to dark purple
	
	PS.gridColor( 0x212240 );
	
	// Change status line color and text

	PS.statusColor( PS.COLOR_WHITE );
	PS.statusText( "Touch the stars" ); //changed text

	// Individual bead colors
	PS.color( 0, 0, 0xD38DE8 );
	PS.color( 1, 0, 0xD38DE8 );
	PS.color( 2, 0, 0xD38DE8 );
	PS.color( 3, 0, 0xAF70C5 );
	PS.color( 4, 0, 0xAF70C5 );
	PS.color( 5, 0, 0xAF70C5 );
	PS.color( 6, 0, 0x8E5AC2 );
	PS.color( 7, 0, 0x8E5AC2 );
	PS.color( 8, 0, 0x8E5AC2 );
	PS.color( 9, 0, 0xAF70C5 );
	PS.color( 10, 0, 0xAF70C5 );
	PS.color( 11, 0, 0xAF70C5 );
	PS.color( 12, 0, 0xD38DE8 );
	PS.color( 13, 0, 0xD38DE8 );
	PS.color( 14, 0, 0xD38DE8 );

	PS.glyph( 7, 0, 0x263E);
	PS.glyphColor( 7, 0, PS.COLOR_WHITE );

	PS.glyph( 9, 0, 0x002A);
	PS.glyphColor( 9, 0, PS.COLOR_WHITE );

	PS.color( 0, 1, 0xAF70C5 );
	PS.color( 1, 1, 0xAF70C5 );
	PS.color( 2, 1, 0xAF70C5 );
	PS.color( 3, 1, 0x8E5AC2 );
	PS.color( 4, 1, 0x8E5AC2 );
	PS.color( 5, 1, 0x8E5AC2 );
	PS.color( 6, 1, 0xAF70C5 );
	PS.color( 7, 1, 0xAF70C5 );
	PS.color( 8, 1, 0xAF70C5 );
	PS.color( 9, 1, 0x8E5AC2 );
	PS.color( 10, 1, 0x8E5AC2 );
	PS.color( 11, 1, 0x8E5AC2 );
	PS.color( 12, 1, 0xAF70C5 );
	PS.color( 13, 1, 0xAF70C5 );
	PS.color( 14, 1, 0xAF70C5 );

	PS.glyph( 3, 1, 0x26AC);
	PS.glyphColor( 3, 1, PS.COLOR_WHITE );

	PS.color( 0, 2, 0x915CB1 );
	PS.color( 1, 2, 0x915CB1 );
	PS.color( 2, 2, 0x915CB1 );
	PS.color( 3, 2, 0x6E48AC );
	PS.color( 4, 2, 0x6E48AC );
	PS.color( 5, 2, 0x6E48AC );
	PS.color( 6, 2, 0x915CB1 );
	PS.color( 7, 2, 0x915CB1 );
	PS.color( 8, 2, 0x915CB1 );
	PS.color( 9, 2, 0x6E48AC );
	PS.color( 10, 2, 0x6E48AC );
	PS.color( 11, 2, 0x6E48AC );
	PS.color( 12, 2, 0x915CB1 );
	PS.color( 13, 2, 0x915CB1 );
	PS.color( 14, 2, 0x915CB1 );

	PS.color( 0, 3, 0x6E48AC );
	PS.color( 1, 3, 0x6E48AC );
	PS.color( 2, 3, 0x6E48AC );
	PS.color( 3, 3, 0x8D5ABC );
	PS.color( 4, 3, 0x8D5ABC );
	PS.color( 5, 3, 0x8D5ABC );
	PS.color( 6, 3, 0x6E48AC );
	PS.color( 7, 3, 0x6E48AC );
	PS.color( 8, 3, 0x6E48AC );
	PS.color( 9, 3, 0x8D5ABC );
	PS.color( 10, 3, 0x8D5ABC );
	PS.color( 11, 3, 0x8D5ABC );
	PS.color( 12, 3, 0x6E48AC );
	PS.color( 13, 3, 0x6E48AC );
	PS.color( 14, 3, 0x6E48AC );

	PS.glyph( 7, 3, 0x002A);
	PS.glyphColor( 7, 3, PS.COLOR_WHITE );

	PS.glyph( 12, 3, 0x002A);
	PS.glyphColor( 12, 3, PS.COLOR_WHITE );

	PS.color( 0, 4, 0x8D5ABC );
	PS.color( 1, 4, 0x8D5ABC );
	PS.color( 2, 4, 0x8D5ABC );
	PS.color( 3, 4, 0x6E48AC );
	PS.color( 4, 4, 0x6E48AC );
	PS.color( 5, 4, 0x6E48AC );
	PS.color( 6, 4, 0x8D5ABC );
	PS.color( 7, 4, 0x8D5ABC );
	PS.color( 8, 4, 0x8D5ABC );
	PS.color( 9, 4, 0x6E48AC );
	PS.color( 10, 4, 0x6E48AC );
	PS.color( 11, 4, 0x6E48AC );
	PS.color( 12, 4, 0x8D5ABC );
	PS.color( 13, 4, 0x8D5ABC );
	PS.color( 14, 4, 0x8D5ABC );

	PS.glyph( 0, 4, 0x002A);
	PS.glyphColor( 0, 4, PS.COLOR_WHITE );

	PS.color( 0, 5, 0x6E48AC );
	PS.color( 1, 5, 0x6E48AC );
	PS.color( 2, 5, 0x6E48AC );
	PS.color( 3, 5, 0x4D3F9D );
	PS.color( 4, 5, 0x4D3F9D );
	PS.color( 5, 5, 0x4D3F9D );
	PS.color( 6, 5, 0x6E48AC );
	PS.color( 7, 5, 0x6E48AC );
	PS.color( 8, 5, 0x6E48AC );
	PS.color( 9, 5, 0x4D3F9D );
	PS.color( 10, 5, 0x4D3F9D );
	PS.color( 11, 5, 0x4D3F9D );
	PS.color( 12, 5, 0x6E48AC );
	PS.color( 13, 5, 0x6E48AC );
	PS.color( 14, 5, 0x6E48AC );

	PS.glyph( 0, 5, 0x26AC);
	PS.glyphColor( 0, 5, PS.COLOR_WHITE );

	PS.color( 0, 6, 0x4D3F9D );
	PS.color( 1, 6, 0x4D3F9D );
	PS.color( 2, 6, 0x4D3F9D );
	PS.color( 3, 6, 0x412F7D );
	PS.color( 4, 6, 0x412F7D );
	PS.color( 5, 6, 0x412F7D );
	PS.color( 6, 6, 0x4D3F9D );
	PS.color( 7, 6, 0x4D3F9D );
	PS.color( 8, 6, 0x4D3F9D );
	PS.color( 9, 6, 0x412F7D );
	PS.color( 10, 6, 0x412F7D );
	PS.color( 11, 6, 0x412F7D );
	PS.color( 12, 6, 0x4D3F9D );
	PS.color( 13, 6, 0x4D3F9D );
	PS.color( 14, 6, 0x4D3F9D );

	PS.glyph( 3, 6, 0x002A);
	PS.glyphColor( 3, 6, PS.COLOR_WHITE );

	PS.glyph( 7, 6, 0x002A);
	PS.glyphColor( 7, 6, PS.COLOR_WHITE );

	PS.glyph( 10, 6, 0x002A);
	PS.glyphColor( 10, 6, PS.COLOR_WHITE );


	PS.color( 0, 7, 0x412F7D );
	PS.color( 1, 7, 0x412F7D );
	PS.color( 2, 7, 0x412F7D );
	PS.color( 3, 7, 0x443983 );
	PS.color( 4, 7, 0x443983 );
	PS.color( 5, 7, 0x443983 );
	PS.color( 6, 7, 0x412F7D );
	PS.color( 7, 7, 0x412F7D );
	PS.color( 8, 7, 0x412F7D );
	PS.color( 9, 7, 0x443983 );
	PS.color( 10, 7, 0x443983 );
	PS.color( 11, 7, 0x443983 );
	PS.color( 12, 7, 0x412F7D );
	PS.color( 13, 7, 0x412F7D );
	PS.color( 14, 7, 0x412F7D );

	PS.glyph( 0, 7, 0x002A);
	PS.glyphColor( 0, 7, PS.COLOR_WHITE );

	PS.glyph( 6, 7, 0x002A);
	PS.glyphColor( 6, 7, PS.COLOR_WHITE );

	PS.glyph( 13, 7, 0x002A);
	PS.glyphColor( 13, 7, PS.COLOR_WHITE );

	// Change border width
	PS.border( PS.ALL, PS.ALL, 0 );
	
	// Preload click sound

	PS.audioLoad( "fx_click" );
};

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
	var next;

	// Toggle color of touched bead from white to black and back again
	// NOTE: The default value of a bead's [data] is 0, which equals PS.COLOR_BLACK

	// PS.color( x, y, data ); // set color to value of data
	
	// Decide what the next color should be
    /*
	if ( data === PS.COLOR_BLACK ) {
		next = PS.COLOR_WHITE;
	} else {
		next = PS.COLOR_BLACK;
	} */

	// NOTE: The above statement could also be expressed using JavaScript's ternary operator:
	// next = ( data === PS.COLOR_BLACK ) ? PS.COLOR_WHITE : PS.COLOR_BLACK;
	
	// Remember the newly-changed color by storing it in the bead's data
	
	PS.data( x, y, next );

	// Play click sound

	PS.touch = function ( x, y, data, options ) {
		//PS.audioPlay( "fx_click" );
	if (PS.glyph( x ,y) === 0x002A) {
		PS.audioPlay( "xylo_c5" );
	}

	};

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

/*

PS.release = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};

*/

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

/*

PS.exit = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

*/

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
