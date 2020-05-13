var foodGame = {

    fallingFood: [], //x, y, sprite, path
    fallingVacc: [],
    
    //spawns new food or vaccine every 5 ticks, adds
    //to array of falling objects each
    spawnFalling : function(){
        var nx;
        var ny = 3;
		
        var col = PS.random(100);
        var spawnRate = PS.random(100);
        var new_sprite;
        
        if(spawnRate > 3){
            return;
        }
        
		PS.gridPlane(PLANE_CORONA);
		if(col <= 33){ //33% chance of spawning vaccine
            nx = PS.random(DIM - vaccine_width);
            line = PS.line( nx, ny, nx, DIM - vaccine_width - 2 );
            new_sprite = PS.spriteImage( vaccine_data );
            foodGame.fallingVacc.push({x: nx, y: ny, sprite_ref: new_sprite, path: line, step: 0});
			
            
        } else { //spawn normal food
            nx = PS.random(DIM - food_width);
            line = PS.line( nx, ny, nx, DIM - food_width - 2 );
            new_sprite = PS.spriteImage( food_data );
            foodGame.fallingFood.push({x: nx, y: ny, sprite_ref: new_sprite, path: line, step:0});

        }
        
        PS.spritePlane( new_sprite, PLANE_CORONA ); // assign plane
        PS.spriteMove( new_sprite, nx, ny ); // move to initial position

    },

    //handle animation for falling objects
    fallingMove : function(e, type){

        var speed = PS.random(100);
        
        
        if(speed > 75){
            return;
        }

        var pn;
        if(e.path){//has plottable course
            pn = e.path[e.step];
            e.y = pn[1]; //get y pos

            
            if(e.sprite_ref == null){
                return;
            }

            PS.spriteMove(e.sprite_ref, e.x, e.y);
            e.step+= 1;
            if(e.step >= e.path.length){//reach end of path, delete!
                e.path = null;
                e.step = 0;
                if(type == "food"){
                    var index = foodGame.fallingFood.indexOf(e);

                    foodGame.fallingFood.splice(index, 1);
                } else {
                    //var find = foodGame.fallingVacc.find(e);
                    var index = foodGame.fallingVacc.indexOf(e);

                    foodGame.fallingVacc.splice(index, 1);
                    
                }
                PS.spriteDelete(e.sprite_ref);

            }
        }
    },




};