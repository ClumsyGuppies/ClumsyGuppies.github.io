/*
game.js for Perlenspiel 3.3.x
Last revision: 2018-10-14 (BM)


*/
//colors
GRAY=0x93aebf;
LIGHT_GREEN= 0x03a678;
MEDIUM_GREEN= 0x00c9b6;
DARK_GREEN= 0x01403a;
RED= 0xf21d44;
LIGHT_RED= 0xfa6b86;
LAVENDER= 0x69add6;
PURPLE= 0x8373bf;
LIGHT_BLUE= 0x2bc7d9;
ORANGE= 0xf2ae72;
colors= [GRAY, LIGHT_BLUE, LIGHT_GREEN, LIGHT_RED, LAVENDER, ORANGE, PURPLE];

//music
//home, food, closet, play, stats
let allMusic = [{m: ''}, {m: ''}, {m: ''}, {m: ''}, {m: ''}]
var current_music = '';

//["feed", "dress", "play", "clean", "home", "stats"]
//["baby", "teen", "adult"]
let DIM = 32;
let state = '';
let ageTimer = "", moveTimer = "", meterTimer = ""



//sprites and images
let corona, foodDrop, vaccineDrop, coronaSprite, foodSprite, vaccineSprite;

var food_data, food_sprite, food_width;
var vaccine_data, vaccine_sprite, vaccine_width;
var coronaSmall_sprite = ""; // id of corona sprite
var corona_x = 15; // x-pos of corona
var corona_y = 16; // y-pos of corona
var corona_max = 0; // maximim x-position of corona (calculated when sprite is loaded)

var coronaCurrent_sprite = '';

var arrowLeft= '';
var arrowLeft_data= '';
var arrowRight= '';
var arrowRight_data= '';
var leftArrowLoc = {x1: 4, y1: 23, x2: 6, y2: 25};
var rightArrowLoc = {x1: 24, y1: 23, x2: 26, y2: 25};

var happy_sprite, hunger_sprite, age_sprite; // id of corona sprite
var background_sprite, background_data;
let openFoodGame = false;

var PLANE_MAIN = 0; // for buttons and background
var PLANE_CORONA = 1; // plane for corona
var PLANE_STATS = 2; // plane for corona

var BACKGROUND = 0xBCE5D7;
var canMove = true;

cowboy= '';
cowboy_data= '';
cowboy_width= '';

bowtie='';
bowtie_data='';
bowtie_width='';

pride='';
pride_data='';
pride_width='';

bigBase='';
bigBase_data='';

sunglasses='';
sunglasses_data='';
sunglasses_width='';

current_data = '';
current_width = 0;



big_width= 0;

var me = ( function () {

	/**CODE ADAPTED FROM BMO'S PATHFINDING EXAMPLE
	 * https://ps3.perlenspiel.net/how20.html
	 */


	// These control the motion of corona

	var coronaSmall_data = null; // imageData for corona sprite
	var coronaSmall_width = 0; // calculated when sprite is loaded
	
	
	var corona_path = null; // null when not moving, else an array
	var corona_step = 0; // current step on path
	// var corona_min = WALL_WIDTH_LEFT; // minimum x-position of corona


	var hunger_data = null;
	var happy_data = null;
	var age_data = null;

	var hunger_width = 0;
	var happy_width = 0;
	var age_width = 0;

	var coronaCollide = function(s1, p1, s2, p2, type){
		var fullObj;
		var index;
		if(s2 == background_sprite){
			return;
		}
		//PS.debug("value of collider: " + s2 + "\n")
		fullObj = foodGame.fallingFood.find(el=> el.sprite_ref == s2);
        
        if(fullObj == undefined){ //falling object is a vaccine, not a food
            fullObj = foodGame.fallingVacc.find(el=> el.sprite_ref == s2);
            index = foodGame.fallingVacc.indexOf(fullObj);//find obj in active array
			//PS.debug("I have collided with vaccine!\n");
			hunger-=3;
			checkDead();
			
        } else {
			
			index = foodGame.fallingFood.indexOf(fullObj);
			//PS.debug("I have collided with food!\n");
			hunger+=3;
			checkDead();

		}
		PS.spriteShow(s2, false);
	};
	
	var checkDead = function(){
		if(hunger < 0){
			PS.statusText("Oh no! Corona died from starvation.");
			canMove = false;
			spawnFalling = false;
			DB.sendData();
			return true;
		}
		
		if(happy < 0){
			PS.statusText("Oh no! Corona died from sadness.");
			return true;
		}

		return false;

	};

	// This is now your SINGLE tick function, the One True Tick that controls everything

	var tick = function () {
		var p;

		// Move the corona first
		if(canMove){

			
			if ( corona_path ) { // path available
				p = corona_path[ corona_step ];
				corona_x = p[ 0 ]; // get x-pos
				PS.spriteMove( coronaCurrent_sprite, corona_x, corona_y );
				
				// Nuke the path if no more steps
				corona_step += 1;
				if ( corona_step >= corona_path.length ) {
					corona_path = null;
					corona_step = 0;
				}
			}
		}
		
		//then move food and vaccines and handle collisions?
		if(openFoodGame){
			foodGame.spawnFalling();

			//handle animation for each sprite on screen currently
			foodGame.fallingFood.forEach(el=>foodGame.fallingMove(el, "food"));
			foodGame.fallingVacc.forEach(el=>foodGame.fallingMove(el, "vaccine"));
		}
	};

	var loadMusic = function(filename, index, fileType){
		PS.audioLoad( filename, {path: 'music/', fileTypes: [fileType], onLoad : function(data){
			 allMusic[index].m = data.channel; // save ID
			//PS.debug(allMusic[index].m + " loading done!\n");
			} 
		});
	};

	var loadAllMusic = function(){
		//home, food, closet, play, stats
		loadMusic('food_music', 1, 'mp3');
		loadMusic('closet_music', 2, 'mp3');
		loadMusic('main_music', 0, 'ogg');
		loadMusic('stats_music', 4, 'ogg');
	};

	var drawMap = function () {
		PS.gridPlane( PLANE_MAIN );

		PS.glyph(7, 1, 0x2615);
		PS.alpha( 7, 1, 255 );
		PS.data( 7, 1, "feed" ); //"feed button for now"
		
		PS.glyph(16, 1, 0x1f3e0);
		PS.alpha( 16, 1, 255 );
		PS.data( 16, 1, "home" ); //"home button for now"
		
		PS.glyph(25, 1, 0x1f3ae);
		PS.alpha( 25, 1, 255 );
		PS.data( 25, 1, "play" ); //"game button for now"
		
		PS.glyph(7, DIM-2, 0x2764);
		PS.alpha( 7, DIM - 2, 255 );
		PS.data( 7, DIM-2, "stats" ); //"home button for now"
		
		PS.glyph(16, DIM-2, 0x1f457);
		PS.alpha( 16, DIM - 2, 255 );
		PS.data( 16, DIM-2, "dress" ); //"home button for now"
	};

	var loadSprites = function(){
		loadAllMusic();
		// Load all images in succession
		PS.imageLoad( "sprites/background.bmp", function ( data ) {
			//PS.debug( "background loaded\n" ); 
			background_data = data; // save image data
			background_sprite = PS.spriteImage(background_data);

			PS.spritePlane( background_sprite, PLANE_MAIN ); // assign plane
			PS.spriteMove( background_sprite, 0, 0 ); // move to initial position
			PS.imageLoad( "sprites/smallestCoronaSprite.bmp", function ( data ) {
				//PS.debug( "corona loaded\n" );

				coronaSmall_data = data; // save image data
				coronaSmall_width = data.width;
				// corona_max = DIM - data.width; // calculate maximum corona x-position
				// coronaSmall_sprite = PS.spriteImage( coronaSmall_data );

				// PS.spritePlane( coronaSmall_sprite, PLANE_CORONA ); // assign plane
				// PS.spriteMove( coronaSmall_sprite, corona_x, corona_y ); // move to initial position
				// PS.spriteCollide(coronaSmall_sprite, coronaCollide); //define collision function for corona
				
				PS.imageLoad( "sprites/bloodCell.gif", function ( data ) {
				//	PS.debug( "food loaded\n" );
					food_data = data; // save image data
					food_width = data.width;
					
					PS.imageLoad( "sprites/vaccine.gif", function ( data ) {
					//	PS.debug( "vaccine loaded\n" );
						vaccine_width = data.width; 
						vaccine_data = data; // save image data

						PS.imageLoad( "sprites/ageMeter.bmp", function ( data ) {
						//	PS.debug( "age loaded\n" );
							age_width = data.width; 
							age_data = data; // save image data
							age_sprite = PS.spriteImage(age_data);
							
							PS.imageLoad( "sprites/happyMeter.bmp", function ( data ) {
								// PS.debug( "hap loaded\n" );
								happy_width = data.width; 
								happy_data = data; // save image data
								happy_sprite = PS.spriteImage(happy_data);
								
								PS.imageLoad( "sprites/hungerMeter.bmp", function ( data ) {
									// PS.debug( "hung loaded\n" );
									hunger_width = data.width; 
									hunger_data = data; // save image data
									hunger_sprite = PS.spriteImage(hunger_data);

									PS.imageLoad( "sprites/arrowLeft.bmp", function ( data ) {
										// PS.debug( "left arrow loaded\n" );
										arrowLeft_data = data; // save image data
										arrowLeft = PS.spriteImage( arrowLeft_data );
										
										PS.imageLoad( "sprites/arrowRight.bmp", function ( data ) {
											// PS.debug( "arrow right loaded\n" );
											arrowRight_data = data; // save image data
											arrowRight = PS.spriteImage( arrowRight_data );
											
											dress.loadOutfits();
											
											
											// Draw the background and buttons
		
											drawMap();
											
		
											// Start master timer
		
											moveTimer = PS.timerStart( 3, tick );
											
										} );
									} );		
								} );
							} );
						} );
					} );
				} );
			} );
		} );
		//callback(homeMusic, {loop: true});
	};

	var exports = {

		init : function () {
			PS.gridSize( DIM, DIM ); // init grid
			PS.gridColor( 0xf3b2ac );
			PS.border( PS.ALL, PS.ALL, 0 );

			
			var complete = function(){
				loadSprites();
				PS.audioPlayChannel(allMusic[0].m, {loop:true});
				current_music = allMusic[0].m;
			}
			loadSprites();

			//PS.audioPlayChannel(homeMusic, {loop: true});
			loadAllMusic();
			
			// Change status line color and text

			PS.statusColor(DARK_GREEN);
			PS.statusText( "Meet Corona! Click to say hi." );

			DB.active(true);
			//DB.active(false);
			DB.init("Coronagotchi", complete);
			//PS.audioPlayChannel(allMusic[0].m, {loop:true});
			//current_music = allMusic[0].m;
			//don't implement for prototype
			//ageTimer = PS.timerStart( 300, statsData.ageTick );
			//meterTimer = PS.timerStart( 300, statsData.meterTick );

			state = "home";
			age = "baby";

		},
		
		corona_move : function ( x ) {
			var line;

			// Clamp limits of x-motion

			if ( x < 0) {
				x = 0;
			}
			else if ( x > corona_max ) {
				x = corona_max;
			}

			// If corona is not already at target, move it

			if ( x !== corona_x ) {
				line = PS.line( corona_x, corona_y, x, corona_y );
				if ( line.length > 0 ) {
					corona_path = line;
					corona_step = 0;
				}
			}
		},
		
		reset : function(){
			
			foodGame.fallingFood.forEach(el=>PS.spriteShow(el.sprite_ref, false));
			foodGame.fallingVacc.forEach(el=>PS.spriteShow(el.sprite_ref, false));
			foodGame.fallingFood = [];
			foodGame.fallingVacc = [];

			openFoodGame = false;

			statsData.clearStats();
			PS.spriteShow(arrowLeft, false);
			PS.spriteShow(arrowRight, false );

			if(state != 'home'){
				//make sure using smol corona sprite
				PS.spriteShow(coronaCurrent_sprite, false);
				coronaCurrent_sprite = PS.spriteImage(coronaSmall_data);
				PS.spritePlane( coronaCurrent_sprite, PLANE_CORONA ); // assign plane
				PS.spriteCollide(coronaCurrent_sprite, coronaCollide);
				corona_y = 22;    
				corona_max = DIM - coronaSmall_width;
				
			} else {
				//beeg beeg corona so you can see outfit
				PS.spriteShow(coronaCurrent_sprite, false);
				// PS.debug("bee2g: " + bigBase_data + "\n");
				if(current_data == ''){
					current_data = bigBase_data;
				}
				coronaCurrent_sprite = PS.spriteImage(current_data);
				PS.spritePlane( coronaCurrent_sprite, PLANE_CORONA ); // assign plane
				PS.spriteCollide(coronaCurrent_sprite, coronaCollide);
				if(current_data == bowtie_data){
					corona_y = 15;    
				} else if (current_data == cowboy_data){
					corona_y = 13;    
					
				}else {

					corona_y = 16;    
				}
				if(current_width == 0){
					current_width = big_width;
				}
				corona_max = DIM - current_width;
				
			}
			PS.spriteMove( coronaCurrent_sprite, corona_x, corona_y ); // move to initial position
			canMove = true;
			var dataLeft = state == 'dress'?'leftArrow':'';
			var dataRight = state == 'dress'?'rightArrow':'';
			
			dress.fillBlock(rightArrowLoc.x1, rightArrowLoc.x2, rightArrowLoc.y1, rightArrowLoc.y2, dataRight);
			dress.fillBlock(leftArrowLoc.x1, leftArrowLoc.x2, leftArrowLoc.y1, leftArrowLoc.y2, dataLeft);

		}

	};
	return exports;
}() );

PS.init = me.init;

/*
PS.touch ( x, y, data, options )
*/

PS.touch = function ( x, y, data, options ) {
	"use strict"; // Do not remove this directive!
	//home, food, closet, play, stats
	
	switch ( data ) {
		case "feed":
			state = "feed";
			PS.statusText("It's feeding time!");
			me.reset();
			openFoodGame = true;
			PS.audioStop(current_music);
			PS.audioPlayChannel( allMusic[1].m, {loop: true});
			current_music =  allMusic[1].m;
			// PS.debug( "food time\n" );
		break;
		case "home":
			state = "home";
			PS.statusText("Corona's Home");
			me.reset();
			PS.audioStop(current_music);
			PS.audioPlayChannel( allMusic[0].m, {loop: true});
			current_music =  allMusic[0].m;
			// PS.debug( "home time\n" );
			break;
		case "stats":
			PS.statusText("Corona's Stats");
			state = "stats";
			me.reset();
			statsData.drawStats();
			// PS.debug("value of stats channel  " + allMusic[4].m   + "\n");
			PS.audioStop(current_music);
			PS.audioPlayChannel( allMusic[4].m, {loop: true});
			current_music =  allMusic[4].m;
			// PS.debug( "stats time\n" );

			break;
		case "play":
			PS.statusText("Play Time!");
			state = "play";
			//me.reset();
			// PS.debug( "play time\n" );
			break;
		case "dress":
			PS.statusText("Corona's Closet");
			state = "dress";
			me.reset();
			dress.drawOutfits();
			canMove = false;
			PS.audioStop(current_music);
			PS.audioPlayChannel( allMusic[2].m, {loop: true});
			current_music =  allMusic[2].m;
			// PS.debug( "dress time\n" );
			break;
		case "leftArrow":
			// PS.debug( "left arrow clicked time\n" );
			dress.swapSprite(true);
			break;
		case "rightArrow":
			// PS.debug( "right arrow clicked\n" );
			dress.swapSprite(false);
			break;
		default:
			me.corona_move( x );
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

/*

PS.release = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
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



PS.shutdown = function( options ) {
	"use strict"; // Do not remove this directive!
	DB.send();

	// Uncomment the following code line to verify operation:

	// PS.debug( "“Dave. My mind is going. I can feel it.”\n" );

	// Add code here to tidy up when Perlenspiel is about to close.
};

