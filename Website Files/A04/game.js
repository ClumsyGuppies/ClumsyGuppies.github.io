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
*/

let DIM = 32;

//keep track of instrument channels for swapping samples
let drumChannels = {next: "", previous: "", playing: ""};
let pianoChannels = {next: "", previous: "", playing: ""};
let stringsChannels = {next: "", previous: "", playing: ""};
let bassChannels = {next: "", previous: "", playing: ""};
let guitarChannels = {next: "", previous: "", playing: ""};

//individual instrument play/pause variables
let playButtons = [{play: false}, {play: false}, {play: false}, {play: false}, {play: false}, ]

//directory of samples
let drums = ["drum_1_1", "drum_2_1","drum_3_1", "drum_4_1", "drum_5_1", "drum_6_1", "drum_7_1"]
let synth = ["string_synth_1_1", "string_synth_2_1", "synth_1_1", "synth_2_1", "synth_3_1", "synth_4_1"]
let piano = ["piano_1_1", "piano_2_1", "piano_3_1", "piano_4_1", "piano_5_1"]
let guitar = ["guitar_1_1", "guitar_2_1", "guitar_3_1", "guitar_4_1", "guitar_5_1", "guitar_6_1"]
let bass = ["bass_1_1", "bass_2_1", "bass_4_1"]

//keep track of all channels active in order to enable play/pause all
let allChannels = [];

//just so i know what's what
let instruments = ["drum", "piano", "strings", "bass", "guitar"]

//defined as objects so i can pass as references to func
let drumsI = {i:0}, stringsI = {i:0}, pianoI = {i:0}, guitarI = {i:0}, bassI = {i:0}

//variables for controlling global metronome
let metronome = ""; //timer 
let metOn = false; //if metronome is on/off
let time = 0; //metronome time


var me = ( function () {

	//assign data to each instrument cell on bmp to enable hooking up music calls to specific 
	//instruments on touch 
	var mapObject = function(x1, x2, y1, y2, data){
		var i = 0; var j = 0;
		for(i = x1; i <= x2; i++){
			for(j = y1; j <= y2; j++){
				PS.data(i, j, data);
			}
		}
	};

	//custom mapping where each instrument is and what data each cell needs 
	//note: this could've been done better but I need to work on functional programming alternatives more - in
	//the future i'll try to cut down on duplicate code more
	
	var mapInstruments = function(){
		//violin
		mapObject(3, 7, 0, 13, ["strings"]);
		mapObject(2, 3, 15, 17, ["strings", "subtract"]);
		mapObject(7, 8, 15, 17, ["strings", "add"]);
		// //guitar
		mapObject(24, 30, 15, 27, ["guitar"]);
		mapObject(24, 25, 29, 31, ["guitar", "subtract"]);
		mapObject(29, 30, 29, 31, ["guitar", "add"]);
		// //piano
		mapObject(18, 30, 1, 6, ["piano"]);
		mapObject(21, 22, 8, 10, ["piano", "subtract"]);
		mapObject(26, 27, 8, 10, ["piano", "add"]);
		// //drums
		mapObject(2, 9, 20, 27, ["drum"]);
		mapObject(3, 4, 29, 31, ["drum", "subtract"]);
		mapObject(8, 9, 29, 31, ["drum", "add"]);
		// //bass
		mapObject(13, 18, 7, 20, ["bass"]);
		mapObject(13, 14, 22, 24, ["bass", "subtract"]);
		mapObject(18, 19, 22, 24, ["bass", "add"]);
		
		//pause and start
		mapObject(12, 16, 27, 31, ["pause"]);
		mapObject(17, 21, 27, 31, ["play"]);

	}

	var exports = {
		
		init : function () {
			PS.gridSize( DIM, DIM ); // init grid
			PS.gridColor( 0xf7ce6b );
			
			PS.border ( PS.ALL, PS.ALL, 0 );
		
			PS.statusColor( PS.COLOR_WHITE);
			PS.statusText( "Press M for metronome" );
			//load bmp, wait to map instruments until loaded
			exports.imageLoad(mapInstruments);
			//preload each instrument with sound file on start
			exports.switchChannels();
			
			
		},

		//display which instruments are active/not
		showPlaying : function(instrument, show) {

			//grab coordinates for each instruments display node
			var block = {
			  'drum': {x: 6, y: 30},
			  'piano': {x: 24, y: 9},
			  'bass': {x: 16, y: 23},
			  'strings':{x: 5, y: 16},
			  'guitar': {x: 27, y: 30},
			};

			var coord = {};
			coord = (block[instrument]);
			show? PS.color(coord.x, coord.y, PS.COLOR_GREEN): PS.color(coord.x, coord.y, PS.COLOR_WHITE);

		},

		//load bmp + call map instruments
		imageLoad : function(callback){
			var loaded = function ( image ) {
				PS.imageBlit( image, 0, 0 );
			}
			PS.imageLoad ( "./images/pixelband.bmp", loaded );
			callback();
		},

		//handles init sound loading
		switchChannels : function(){
			exports.switchAll(drums, drumsI, drumChannels, "./Drums/");
			exports.switchAll(piano, pianoI, pianoChannels, "./Piano/");
			exports.switchAll(bass, bassI, bassChannels, "./Bass/");
			exports.switchAll(guitar, guitarI, guitarChannels, "./Guitar/");
			exports.switchAll(synth, stringsI, stringsChannels, "./Strings/");

		},
		//catch all function for loading new sample when arrow for instrument is clicked, or pause/play is
		switchAll : function(array, index, channels, path){
			//PS.debug("current previous: " + array[index.i]);
			var loader = function ( data ) {
				channels.next = data.channel; // save ID
			};
			   
			PS.audioLoad( array[index.i], {path: path, fileTypes: ["mp3"], onLoad : loader });
			//PS.debug("current channel: " + array[index.i]);
		},
		
		//below are individualized switchAll calls for each instrument to make sure they all have correct
		//paths and variables assigned; again, this could've been simplified further, I'm working on it :)
		switchDrum : function(){
			exports.switchAll(drums, drumsI, drumChannels, "./Drums/");
		},
		switchPiano : function(){
			exports.switchAll(piano, pianoI, pianoChannels, "./Piano/");
		},
		switchBass : function(){
			exports.switchAll(bass, bassI, bassChannels, "./Bass/");
		},
		switchString : function(){
			exports.switchAll(synth, stringsI, stringsChannels, "./Strings/");
		},
		switchGuitar : function(){
			exports.switchAll(guitar, guitarI, guitarChannels, "./Guitar/");
		},

		//handle swapping instrument samples, decide which way to parse each
		//sample array based on cell data - subtract means go left, add means go right
		sampleSwap : function(samples, index, func, action, channels, playB, instrument){
			PS.debug(samples + index + action);
			//set index which should be changed bc can't pass by ref
			
			if(action == "subtract"){
				index.i = index.i - 1 > -1? index.i - 1: samples.length - 1; //loop to avoid out of bounds
			} else if(action == "add"){
				index.i = index.i + 1 < samples.length -1? index.i+ 1: 0; 
			}
			func(); //passed in switch function for that instrument
			exports.swapChannels(channels, playB, instrument); //autoplay
		},

		//handles starting and stopping of sample files, and keeping track of previous file
		//played to make sure only 1 sample is playing per instrument at a time
		swapChannels : function(channels, playB, instrument){
			channels.previous = channels.playing;

			//stop play
			if(channels.previous != ""){ //catch error if this is first sample played
				PS.audioStop(channels.previous);
				//remove stopped channel from all channels to make sure doesn't play again
				var index = allChannels.indexOf(channels.previous);
				PS.debug("spliced index: " + index + "\n")
				if(index > -1){
					allChannels.splice(index, 1);
					PS.debug("all channels spliced: " + allChannels +"\n");
				}
				exports.showPlaying(instrument, false);
				
			} 
			if(playB){ //check if allowed to play
				channels.playing = channels.next;
				PS.audioPlayChannel(channels.playing, {loop: true});
				exports.showPlaying(instrument, true);
				if(!allChannels.includes(channels.playing)){ //<-- issue, if channel already exists won't add, do by sample name instead
					//add to all channels 
					allChannels.push(channels.playing);
					PS.debug("all channels: " + allChannels + "\n");
				}
			}
		},
	};
	
   
	return exports;
   } () );

PS.init = me.init;

/*
PS.touch ( x, y, data, options )
*/
PS.touch = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	PS.debug("data " + data);

	//handles swap sample + play/pause calls for each instrument when touching anywhere on instrument
	//handles play + pause all buttons
	//i can't wait to get better at javascript so i never write code like this again
	//object literalssss - if i had more time i'd replace this code, next step
	switch(data[0]){
		case "drum":
			if(data[1] != null){ //data[1] != null indicates an arrow, so a sample swap
				//samples, index, func, action, channels, playB, instrument
				me.sampleSwap(drums, drumsI, me.switchDrum, data[1], drumChannels, playButtons[0].play, "drum");
				return;
			}
			//check if sample already playing - if not, set to playing
			playButtons[0].play? playButtons[0].play = false: playButtons[0].play = true;
			//play that funky music
			me.swapChannels(drumChannels, playButtons[0].play, "drum");
			break;
		case "piano":
			if(data[1] != null){
				me.sampleSwap(piano, pianoI, me.switchPiano, data[1], pianoChannels, playButtons[1].play,"piano");
				return;
			}
			playButtons[1].play? playButtons[1].play = false: playButtons[1].play = true;
			me.swapChannels(pianoChannels, playButtons[1].play,"piano");
			break;
		case "bass":
			if(data[1] != null){
				me.sampleSwap(bass, bassI, me.switchBass, data[1], bassChannels, playButtons[2].play, "bass");
				return;
			}
			playButtons[2].play? playButtons[2].play = false: playButtons[2].play = true;
			me.swapChannels(bassChannels, playButtons[2].play, "bass");
			break;
		case "strings":
			if(data[1] != null){
				me.sampleSwap(synth, stringsI, me.switchString, data[1], stringsChannels, playButtons[3].play, "strings");
				return;
			}
			playButtons[3].play? playButtons[3].play = false: playButtons[3].play = true;
			me.swapChannels(stringsChannels, playButtons[3].play, "strings");
			break;
		case "guitar":
			if(data[1] != null){
				me.sampleSwap(guitar, guitarI, me.switchGuitar, data[1], guitarChannels, playButtons[4].play, "guitar");
				return;
			}
			playButtons[4].play? playButtons[4].play = false: playButtons[4].play = true;
			me.swapChannels(guitarChannels, playButtons[4].play, "guitar");
			break;
		case "play":
			PS.debug("play all");
			allChannels.forEach(el=> PS.audioPlayChannel(el, {loop:true}));
			break;
		case "pause":
			PS.debug("pause all");
			allChannels.forEach(el=> PS.audioStop(el));
			break;


	}

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

	//repeat? PS.color(x, y, PS.CURRENT) : PS.color(x, y, data[2]);
	

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
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

	//repeat? PS.color(x, y, PS.CURRENT) : PS.color(x, y, data[2]);

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};




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
	
	//if M or m, play/pause metronome
	if(key == 109 || key == 77){
		if(metOn){
			metOn = false;
			PS.timerStop(metronome);
			time = 0;
			PS.statusColor( PS.COLOR_VIOLET );
			PS.statusText( "Pixel Band! Press M for metronome" );
		} else {
			metOn = true;
			metronome = PS.timerStart(30, function (){ //tempo = 120 bpm, set status text to counter for visual aid
				time == 8 ? time = 1: time++;
				PS.statusColor( PS.COLOR_WHITE );
				PS.statusText( "Keep Time: "+ time);
				PS.audioPlay("fx_tick");
			});
		}

	} 
	
	
	

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

	
	

};





