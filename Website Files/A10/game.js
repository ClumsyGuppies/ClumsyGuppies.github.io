/*
game.js for Perlenspiel 3.3.x
Last revision: 2018-10-14 (BM)


*/





//music
//home, food, closet, play, stats, block
let allMusic = [{m: ''}, {m: ''}, {m: ''}, {m: ''}, {m: ''}, {m: ''}];
var current_music = '';
//happy, sad, hurt, confused, laugh
var allSFX = [{noise: ''}, {noise: ''}, {noise: ''}, {noise: ''}, {noise: ''}];

//sfx
HAPPY_NOISE = 0;
SAD_NOISE = 1;
HURT_NOISE = 2;
CONFUSED_NOISE = 3;
LAUGH_NOISE = 4;

//["feed", "dress", "play", "clean", "home", "stats"]
//["baby", "teen", "adult"]
let DIM = 32;
let state = '';
//essential timers
ageTimer = "";
moveTimer = "";
notifyTimer = '';
meterTimer = '';
//notification information
notifType = 3;
switchColor = false;

//age from 0 to 1 on first food
ageOnce = false; 


//sprites and images
let corona, foodDrop, vaccineDrop, coronaSprite, foodSprite, vaccineSprite;

var food_data, food_sprite, food_width;
var vaccine_data, vaccine_sprite, vaccine_width;
var coronaSmall_sprite = ""; // id of corona sprite
var corona_x = 15; // x-pos of corona
var corona_y = 14; // y-pos of corona
var corona_max = 0; // max x-position of corona (calculated when sprite is loaded)

var coronaCurrent_sprite = '';
var coronaSmall_data = null; // imageData for corona sprite
var coronaSmall_width = 0; // calculated when sprite is loaded

//closet arrow sprites + positions
var arrowLeft= '';
var arrowLeft_data= '';
var arrowRight= '';
var arrowRight_data= '';
var leftArrowLoc = {x1: 4, y1: 23, x2: 6, y2: 25};
var rightArrowLoc = {x1: 24, y1: 23, x2: 26, y2: 25};

//meter sprite data
var happy_sprite, hunger_sprite, age_sprite; 
var background_sprite, background_data;
let openFoodGame = false;

var PLANE_MAIN = 0; // for buttons and background
var PLANE_CORONA = 1; // plane for corona
var PLANE_STATS = 2; // plane for stats + positioning above corona

var BACKGROUND = 0xcae7dc;
var canMove = true; //disable for games where controlling corona isn't necessary

//death/ending sprites
coronaDeath_data='';
coronaDeathSprite= '';
playerDeath_data='';
playerDeathSprite = '';
coronaGhost_data = '';
coronaGhostSprite = '';

//all clothing sprites + data, large and mini versions
cowboy= '';
cowboy_data= '';
cowboy_width= '';
cowboy_height= '';

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

mask='';
mask_data='';
mask_width='';

crown='';
crown_data='';
crown_width='';

sCrown='';
sCrown_data='';
sCrown_width='';
sCrown_height='';

sCowboy= '';
sCowboy_data= '';
sCowboy_width= '';
sCowboy_height= '';

sBowtie='';
sBowtie_data='';
sBowtie_width='';
sBowtie_height='';

sPride='';
sPride_data='';
sPride_width='';
sPride_height='';

bigBase='';
bigBase_data='';

sSunglasses='';
sSunglasses_data='';
sSunglasses_width='';
sSunglasses_height='';

sMask='';
sMask_data='';
sMask_width='';
sMask_height='';

//keep track of current outfit + age
current_data = '';
current_width = 0;
currentSmall_data = '';
currentSmall_width = 0;
currentSmall_height = 0;

big_width= 0;

var me = ( function () {

	/**CODE ADAPTED FROM BMO'S PATHFINDING EXAMPLE
	 * https://ps3.perlenspiel.net/how20.html
	 */


	var corona_path = null; // null when not moving, else an array
	var corona_step = 0; // current step on path
	// var corona_min = WALL_WIDTH_LEFT; // minimum x-position of corona


	//statistic meters data
	var hunger_data = null;
	var happy_data = null;
	var age_data = null;

	var hunger_width = 0;
	var happy_width = 0;
	var age_width = 0;

	//button regions
	//(4, 0) -> (9, 4)
	//(14, 0) -> (19, 4)
	//(23, 0) -> (28, 4)
	//(4, DIM) -> (9, 27)
	//(14, DIM) -> (19, 27)
	//(23, DIM) -> (28, 27)

	var foodButton = {x1: 4, y1: 0, x2: 9, y2: 4};
	var dressButton = {x1: 14, y1: 0, x2: 19, y2: 4};
	var gameButton = {x1: 23, y1: 0, x2: 28, y2: 4};
	var statsButton = {x1: 4, y1: DIM-6, x2: 9, y2: DIM-1};
	var homeButton = {x1: 14, y1: DIM-6, x2: 19, y2: DIM-1};
	var blockButton = {x1: 23, y1: DIM-6, x2: 28, y2: DIM-1};


	//handle collision of corona with vaccines + food during feeding game
	var coronaCollide = function(s1, p1, s2, p2, type){
		var fullObj;
		var index;
		//don't collide with background
		if(s2 == background_sprite){
			return;
		}
		//check if collided object is food; if not, is vaccine
		fullObj = foodGame.fallingFood.find(el=> el.sprite_ref == s2);
		
		if(fullObj == undefined){ //falling object is a vaccine, not a food
			fullObj = foodGame.fallingVacc.find(el=> el.sprite_ref == s2);
			if(fullObj == undefined){
				return;
			}
			index = foodGame.fallingVacc.indexOf(fullObj);//find obj in active array
			statsData.changeStat('hunger', -3); //update hunger stat
			PS.audioPlayChannel(allSFX[HURT_NOISE].noise, {loop:false});
			//change notification type to negative, flashes red light
			notifType = 2;
			//check if hunger has decreased enough to kill corona
			checkDead();
			
		} else {
			
			index = foodGame.fallingFood.indexOf(fullObj);
			statsData.changeStat('hunger', 3);
			PS.audioPlayChannel(allSFX[HAPPY_NOISE].noise, {loop:false});
			notifType = 1;
			//first age up is when corona gets fed for the first time; otherwise, ignore this
			if(!ageOnce){
				statsData.changeStat('age', 5);
				statsData.setAgeSprites();
				
				//grid outline color change
				ageOnce = true;
				PS.spriteCollide(coronaCurrent_sprite, coronaCollide);
		
			}
			//death?
			checkDead();

		}
		PS.spriteShow(s2, false);
	};

	//checks corona stats to see if has died during feeding
	var checkDead = function(){
		if(hunger < 0){
			PS.statusText("Oh no! Corona died from starvation.");
			canMove = false;
			spawnFalling = false;
			return true;
		}
		
		if(happy < 0){
			PS.statusText("Oh no! Corona died from sadness.");
			canMove = false;
			spawnFalling = false;
			return true;
		}

		return false;

	};

	//movement controller for corona, falling sprites, and bouncing corona during block breaker game
	var tick = function () {
		var p;

		// Move the corona first
		if(canMove){
			if ( corona_path ) { // path available
				p = corona_path[ corona_step ];
				corona_x = p[ 0 ]; // get x-pos
				PS.spriteMove( coronaCurrent_sprite, corona_x, corona_y );
				//handle movement for player controller paddle during block breaker game
				if(state == 'block' && blockGame.fullBreaker != null && blockGame.fullBreaker != []){
					if(blockGame.fullBreaker[1] != '' && blockGame.fullBreaker[1] != null && blockGame.fullBreaker[2] != ''
						&& blockGame.fullBreaker[2] != null){
							PS.spriteMove( blockGame.fullBreaker[1].sprite, corona_x -3, corona_y ); //left
							blockGame.fullBreaker[1].x = corona_x -3; //left
							PS.spriteMove( blockGame.fullBreaker[2].sprite, corona_x +3, corona_y ); //right
							blockGame.fullBreaker[2].x = corona_x +3; //left

						}
					

				}
				
				// Nuke the path if no more steps
				corona_step += 1;
				if ( corona_step >= corona_path.length ) {
					corona_path = null;
					corona_step = 0;
				}
			}
		}

		//move mini corona dude - block breaker game
		if(state == 'block'){
			blockGame.miniMovement();
		}
		
		//then move food and vaccines
		if(openFoodGame){
			foodGame.spawnFalling();

			//handle animation for each sprite on screen currently
			foodGame.fallingFood.forEach(el=>foodGame.fallingMove(el, "food"));
			foodGame.fallingVacc.forEach(el=>foodGame.fallingMove(el, "vaccine"));
		}
	};

	//catch loader for music files
	var loadMusic = function(filename, index, fileType){
		PS.audioLoad( filename, {path: 'music/', fileTypes: [fileType], onLoad : function(data){
			 allMusic[index].m = data.channel; // save ID
			} 
		});
	};

	//loads all essential music files + sound effects
	var loadAllMusic = function(){
		//home, food, closet, play, stats
		loadMusic('food_music', 1, 'mp3');
		loadMusic('closet_music', 2, 'mp3');
		loadMusic('main_music', 0, 'ogg');
		loadMusic('stats_music', 4, 'ogg');
		loadMusic('game_music', 3, 'mp3');
		loadMusic('block_music', 5, 'mp3');

		loadAllSFX();
	};

	//catch all loader for sound effects
	var loadSFX = function(filename, i){
		PS.audioLoad( filename, {path: 'SFX/', fileTypes: ['ogg'], onLoad : function(data){
			allSFX[i].noise = data.channel; // save ID
		   } 
	   });
	};

	//load essential sound effects
	var loadAllSFX = function(){
		loadSFX('happy_noise', HAPPY_NOISE);
		loadSFX('sad_noise', SAD_NOISE);
		loadSFX('hurt_noise', HURT_NOISE);
		loadSFX('confused_noise', CONFUSED_NOISE);
		loadSFX('laugh_noise', LAUGH_NOISE);
	};

	//draw background + fill in data regions for button functionality
	var drawMap = function () {
		PS.gridPlane( PLANE_MAIN );


		//fill in data for buttons
		//x1, x2, y1, y2, data, plane, color
		fillData(foodButton.x1, foodButton.x2, foodButton.y1, foodButton.y2, "feed");
		fillData(homeButton.x1, homeButton.x2, homeButton.y1, homeButton.y2, "home");
		fillData(gameButton.x1, gameButton.x2, gameButton.y1, gameButton.y2, "play");
		fillData(statsButton.x1, statsButton.x2, statsButton.y1, statsButton.y2, "stats");
		fillData(dressButton.x1, dressButton.x2, dressButton.y1, dressButton.y2, "dress");
		fillData(blockButton.x1, blockButton.x2, blockButton.y1, blockButton.y2, "block"); //block button tbd
		
	};

	//general function to add data w/o color
	var fillData = function(x1, x2, y1, y2, data){
		for(var i = x1; i <=x2; i++){
			for(var j = y1; j<= y2; j++){
				PS.data(i, j, data);
			}
		}
	};

	//load main sprites
	var loadSprites = function(){
		loadAllMusic();
		statsData.loadAges();
		// Load all images in succession
		PS.imageLoad( "sprites/ui.bmp", function ( data ) {
			background_data = data; // save image data
			background_sprite = PS.spriteImage(background_data);

			PS.spritePlane( background_sprite, PLANE_MAIN ); // assign plane
			PS.spriteMove( background_sprite, 0, 0 ); // move to initial position
			PS.imageLoad( "sprites/coronaSmall.gif", function ( data ) {

				coronaSmall_data = data; // save image data
				coronaSmall_width = data.width;

				PS.imageLoad( "sprites/bloodCell.gif", function ( data ) {
					food_data = data; // save image data
					food_width = data.width;
					
					PS.imageLoad( "sprites/vaccine.gif", function ( data ) {
						vaccine_width = data.width; 
						vaccine_data = data; // save image data

						PS.imageLoad( "sprites/ageMeter.gif", function ( data ) {
							age_width = data.width; 
							age_data = data; // save image data
							age_sprite = PS.spriteImage(age_data);
							
							PS.imageLoad( "sprites/happyMeter.gif", function ( data ) {
								happy_width = data.width; 
								happy_data = data; // save image data
								happy_sprite = PS.spriteImage(happy_data);
								
								PS.imageLoad( "sprites/hungerMeter.gif", function ( data ) {
									hunger_width = data.width; 
									hunger_data = data; // save image data
									hunger_sprite = PS.spriteImage(hunger_data);

									PS.imageLoad( "sprites/arrowLeft.gif", function ( data ) {
										arrowLeft_data = data; // save image data
										arrowLeft = PS.spriteImage( arrowLeft_data );
										
										PS.imageLoad( "sprites/arrowRight.gif", function ( data ) {
											arrowRight_data = data; // save image data
											arrowRight = PS.spriteImage( arrowRight_data );
											
											dress.loadOutfits(); //load sprites for clothing game
											dna.loadBlocks(); //load sprites for dna game
											blockGame.loadBlocks(); //load sprites for block breaker game
											
											// Draw the background and buttons
		
											drawMap();
											
		
											// Start master timer + notification timer
		
											moveTimer = PS.timerStart( 3, tick );
											notifyTimer = PS.timerStart(30, me.notify);
											meterTimer = PS.timerStart(1500, statsData.meterTick);

											PS.imageLoad( "sprites/deathScene.gif", function ( data ) {
												coronaDeath_data = data; // save image data
												PS.imageLoad( "sprites/playerDeath.gif", function ( data ) {
													playerDeath_data = data; // save image data
													PS.imageLoad( "sprites/ghost.gif", function ( data ) {
														coronaGhost_data = data; // save image data
													} );
												} );
											} );
												
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
			PS.gridColor( LIGHT_RED );
			PS.border( PS.ALL, PS.ALL, 0 );

			//below was for use during DB testing
			// var complete = function(){
			// 	loadSprites();
			// 	PS.audioPlayChannel(allMusic[0].m, {loop:true});
			// 	current_music = allMusic[0].m;
			// }
			loadSprites();

			loadAllMusic();

			PS.statusColor(DARK_GREEN); 
			PS.statusText( "Meet Corona! Click to say hi." );

			//DB.active(true);
			//DB.active(false);
			//DB.init("Coronagotchi", complete);
			//PS.audioPlayChannel(allMusic[0].m, {loop:true});
			//current_music = allMusic[0].m;

			state = "home";


		},

		//public version of fill
		publicFillData : function(x1, x2, y1, y2, data){
			fillData(x1, x2, y1, y2, data);
		},

		//public version of corona collision function, use when switching ages
		setPublicCollide : function(){
			PS.spriteCollide(coronaCurrent_sprite, coronaCollide);
		},
		
		//move main corona with player input
		corona_move : function ( x ) {
			var line;

			// Clamp limits of x-motion

			if(state == 'block' && x <3){
				x = 3;
			}
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

		//general function to fill region w/data + color
		//x1, x2, y1, y2, data, plane, color
		fillBlock : function(x1, x2, y1, y2, data, plane, color){
			for(var i = x1; i <=x2; i++){
				for(var j = y1; j<= y2; j++){
					PS.gridPlane(plane);
					PS.color(i, j, color);
					PS.data(i, j, data);
				}
			}
		},

		
		//pop up notif on stats button if something has changed to encourage person to look at it
		notify : function(){
			
			var p = {
				1:[PS.COLOR_GREEN, LIGHT_GREEN],
				2: [RED, LIGHT_RED],
				3: 0xf3b2ac
			};
			var color;

			//flash between 2 colors
			if(switchColor){
				color = p[notifType][0];
				switchColor = false;
			} else {
				color = p[notifType][1];
				switchColor = true;
			}

			if(notifType == 3){
				//background
				color = p[notifType];

			}
			

			PS.gridPlane(PLANE_MAIN);
			PS.color(8, DIM-5, color);
		},
				
		//reset screen between games
		reset : function(){
			
			PS.statusColor(DARK_GREEN);
			//reset food game
			foodGame.fallingFood.forEach(el=>PS.spriteShow(el.sprite_ref, false));
			foodGame.fallingVacc.forEach(el=>PS.spriteShow(el.sprite_ref, false));
			foodGame.fallingFood = [];
			foodGame.fallingVacc = [];

			openFoodGame = false;
			
			//reset stats page
			statsData.clearStats();
			//reset dna game
			dna.clearGame();
			//reset block breaker game
			blockGame.clearBlockGame();

			//reset clothing game
			var dataLeft = state == 'dress'?'leftArrow':'';
			var dataRight = state == 'dress'?'rightArrow':'';
			
			this.fillBlock(rightArrowLoc.x1, rightArrowLoc.x2, rightArrowLoc.y1, rightArrowLoc.y2, dataRight, PLANE_CORONA, BACKGROUND);
			this.fillBlock(leftArrowLoc.x1, leftArrowLoc.x2, leftArrowLoc.y1, leftArrowLoc.y2, dataLeft, PLANE_CORONA, BACKGROUND);
			
			PS.spriteShow(arrowLeft, false);
			PS.spriteShow(arrowRight, false );

			//handle what corona sprite should be used based on age, current game open, and whether or not has an outfit on
			if(state == 'block'){
				return;
			}
			if(state == 'stats' || state == 'play'){
				//no
				PS.spriteShow(coronaCurrent_sprite, false);

			} else if(state != 'home'){
				//make sure using smol corona sprite
				PS.spriteShow(coronaCurrent_sprite, false);
				coronaCurrent_sprite = PS.spriteImage(currentSmall_data);
				PS.spritePlane( coronaCurrent_sprite, PLANE_STATS); // assign plane
				PS.spriteCollide(coronaCurrent_sprite, coronaCollide);
				if(currentSmall_data == sCowboy_data || currentSmall_data == sCrown_data || currentSmall_data == sBowtie_data){
					corona_y = 19;    

				} else if(currentSmall_data == corona0_data || currentSmall_data == corona1_data || currentSmall_data == corona2_data
					||currentSmall_data == corona3_data || currentSmall_data == corona4_data){
					//corona_y = 24;    
					
				} else {
					corona_y = 20;    

				}
				corona_max = DIM - currentSmall_width;
				
			} else {
				//beeg beeg corona so you can see outfit
				PS.spriteShow(coronaCurrent_sprite, false);
				if(current_data == ''){
					current_data = bigBase_data;
				}
				coronaCurrent_sprite = PS.spriteImage(current_data);
				PS.spritePlane( coronaCurrent_sprite, PLANE_STATS); // assign plane
				PS.spriteCollide(coronaCurrent_sprite, coronaCollide);
				if(current_data == bowtie_data || current_data == crown_data){
					corona_y = 13;    
				} else if (current_data == cowboy_data){
					corona_y = 11;    
					current_width = cowboy_width;
					
				}else if(current_data == corona2_data){ //too young for outfits, use young corona sprite
					corona_y = 17;
					current_width = corona2_width;    
				} else if(currentSmall_data == corona1_data){
					corona_y = 23;
				} else if (currentSmall_data == corona0_data){
					corona_y = 24;
				}else {
					corona_y = 14;
				}
				if(current_width == 0){
					current_width = big_width;
				}
				corona_max = DIM - current_width;
				
			}
			PS.spriteMove( coronaCurrent_sprite, corona_x, corona_y ); // move to initial position
			canMove = true;
		

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
	dna.assignCurrentValues(data);
	switch ( data ) {
		case "feed":
			state = "feed";
			PS.statusText("It's feeding time!");
			me.reset();
			openFoodGame = true;
			PS.audioStop(current_music);
			PS.audioPlayChannel( allMusic[1].m, {loop: true});
			current_music =  allMusic[1].m;
		break;
		case "home":
			state = "home";
			PS.statusText("Corona's Home");
			me.reset();
			PS.audioStop(current_music);
			PS.audioPlayChannel( allMusic[0].m, {loop: true});
			current_music =  allMusic[0].m;
			break;
		case "stats":
			PS.statusText("Corona's Stats");
			state = "stats";
			me.reset();
			notifType = 3;
			// me.notify(3);
			statsData.drawStats();
			PS.audioStop(current_music);
			PS.audioPlayChannel( allMusic[4].m, {loop: true});
			current_music =  allMusic[4].m;
			break;
		case "play":
			PS.statusText("Memorize That Mutation!");
			state = "play";
			me.reset();
			dna.drawGame();
			PS.audioStop(current_music);
			PS.audioPlayChannel( allMusic[3].m, {loop: true});
			current_music =  allMusic[3].m;
			break;
		case "block":
			PS.statusText("Break down that immune system!");
			state = "block";
			me.reset();
			blockGame.drawBlockGame();
			PS.audioStop(current_music);
			PS.audioPlayChannel( allMusic[5].m, {loop: true});
			current_music =  allMusic[5].m;
			break;
		case "dress":
			//only allow dress up when corona is old enough (has correct size sprite)
			if(age < 15){
				PS.statusText("Corona is too young to go there!");
				PS.audioPlayChannel(allSFX[CONFUSED_NOISE].noise, {loop:false});
				return;
			}
			PS.statusText("Corona's Closet");
			state = "dress";
			me.reset();
			dress.drawOutfits();
			canMove = false;
			PS.audioStop(current_music);
			PS.audioPlayChannel( allMusic[2].m, {loop: true});
			current_music =  allMusic[2].m;
			break;
		case "leftArrow":
			dress.swapSprite(true);
			break;
		case "rightArrow":
			dress.swapSprite(false);
			break;
		case "question":
			dna.checkAnswer();
			answerChecked = false;
			break;
		default:
			
			me.corona_move( x );
			
			break;
	}
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

PS.enter = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	//hover over info to show stats for clarification
	if(state != 'stats'){
		
	} else {
		
		PS.statusText("Corona's Stats");
	}
	switch(data){
		case 'age':
			PS.statusText("How old is Corona?");
			break;
		case 'happy':
			PS.statusText("How happy is Corona?");
			break;
		case 'hunger':
			PS.statusText("How well fed is Corona?");
			break;
			
	}
	//show stats info on hover

};

PS.exit = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!
		
	

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

