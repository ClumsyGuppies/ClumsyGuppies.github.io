var blockGame = {

    //block breaker sprite info
    blockBreaker : '',
    blockBreaker_data : '',
    blockBreaker_width : 0,
    whiteCell: '',
    whiteCell_data: '',
    miniCorona: '',
    miniCorona_data: '',  

    //pathfinding data for bouncing corona
    miniPath : 0,
    miniStep:0,
    mx: 0, //mini x pos
    my: 0, //mini y pos
    xprev: 0,
    isWin: false,
    
    allCells : [], //all white blood cells to break
    fullBreaker: [], //corona left right
    result: '',

    //based on xpos of paddle or white cell hit
    //equals change to xpos
    angles:{
        //paddle
        2: 4,
        5: 0,
        8: 4,
        //cells
        1: 8,
        6: 1,
        11: -1,
        16: -6,
        21: -10,
        26: -15
    },
    
    
    drawBlockGame : function(){
       //draw white blood cells at top
       var x = 1;
       var y = 5;

       for(j = 0; j < 2; j++){
            for (let i = 0; i < 6; i++) {
                    
                var newSprite = PS.spriteImage(whiteCell_data);
                PS.spritePlane(newSprite, PLANE_CORONA);
                PS.spriteMove(newSprite, x, y);
                this.allCells.push({sprite: newSprite, xpos: x, hits: 0});
                x+=5; 
            }
            x=1;
            y+=4;
        }
        // this.allCells.forEach(e=>PS.debug("white block positinos : " + e.xpos + "\n"));

        //replace player control with little paddle board

        PS.spriteShow(coronaCurrent_sprite, false);
        coronaCurrent_sprite = PS.spriteImage(blockBreaker_data);
        PS.spritePlane( coronaCurrent_sprite, PLANE_STATS); // assign plane
        corona_y = 25;
        corona_x = 15;
        PS.spriteMove( coronaCurrent_sprite, 5, corona_y ); // move to initial position
        PS.spriteShow(coronaCurrent_sprite, true);
        blockGame.fullBreaker.push({sprite: coronaCurrent_sprite, xpos:5, data: blockBreaker_data }); 
        var nx = 2;
        
        //move 3 sprites as one; these are additional block sprites on either side of main, positioning is used to calulate angles
        for(i = 0; i < 2; i++){
            var newBlock = PS.spriteImage(blockBreaker_data);
            PS.spritePlane( newBlock, PLANE_CORONA); // assign plane
            PS.spriteMove( newBlock, nx, corona_y ); // move to initial position
            this.fullBreaker.push({sprite: newBlock, xpos:nx, data: blockBreaker_data });
            nx+=6;
        }
        corona_max = DIM - 6;

        //spawn mini corona dude to bounce off blocks
        var nx = PS.random(DIM-1);//5;
        mx = 5;
        my = DIM-10;
        blockGame.miniCorona = PS.spriteImage(miniCorona_data);
        PS.spritePlane(blockGame.miniCorona, PLANE_CORONA);
        PS.spriteMove(blockGame.miniCorona, mx, my);
        PS.spriteCollide(blockGame.miniCorona, this.miniCollide);

        this.miniPath = PS.line( mx, my, nx, 5 );//create new random path and assign
        blockGame.xprev = nx;
        // PS.debug("xprev: " + blockGame.xprev + "\n");
        
    },

    //reset block game + erase all sprites
    clearBlockGame : function(){
        this.allCells.forEach(e=>PS.spriteShow(e.sprite, false));
        this.fullBreaker.forEach(e=>PS.spriteShow(e.sprite, false));

        this.allCells = [];
        this.fullBreaker = [];

        if(blockGame.miniCorona != '' && blockGame.miniCorona != null){
            PS.spriteShow(blockGame.miniCorona, false);

        }

    },

    //load block game sprites
    loadBlocks : function(){
        PS.imageLoad( "sprites/blockBreaker/block_breaker.gif", function ( data ) {
            blockBreaker_data = data; // save image data
            blockBreaker_width = data.width; // save image data

            PS.imageLoad( "sprites/blockBreaker/whiteBloodCell.gif", function ( data ) {
                whiteCell_data = data; // save image data
    
                PS.imageLoad( "sprites/blockBreaker/tiny_corona.gif", function ( data ) {
                    miniCorona_data = data; // save image data
        
                } );
            } );
        } );
    },

    //collision handling for white blood cells
    miniCollide : function(s1, p1, s2, p2, type){
        var find = blockGame.fullBreaker.find(e => e.sprite == s2);
        var find2 = blockGame.allCells.find(e => e.sprite == s2);
    
        var indexCell;
        
        //hit the paddle, create new path up
        if(find){
            PS.audioPlay('xylo_a4');
            blockGame.makeNewPath(find.xpos, true); //pass in x pos of paddle hit
           return;
        }
        
        //hit white blood cell, either win or create new path down
        if(find2){
            // PS.debug("i hit a white blood cell!\n");
            PS.audioPlay('xylo_ab5');
            blockGame.makeNewPath(find2.xpos, false); //pass in x pos of paddle hit
            find2.hits+=1;
            if(find2.hits == 2){ //takes 2 hits to break block
                indexCell = blockGame.allCells.indexOf(find2);
                blockGame.allCells.splice(indexCell, 1); //remove from all cells
                PS.spriteShow(find2.sprite, false); //delete sprite

                if(blockGame.allCells.length == 6){
                    statsData.changeStat('happy', 2);
                    PS.audioPlayChannel(allSFX[HAPPY_NOISE].noise, {loop:false});
                }
                
                if(blockGame.allCells.length <= 0){
                    statsData.changeStat('happy', 5);
                    blockGame.isWin = true;
                    PS.audioPlayChannel(allSFX[LAUGH_NOISE].noise, {loop:false});
                    resultTimer = PS.timerStart(10, blockGame.showWin);
                }
            }
            return;
        }
    },

    //handle bouncing of mini corona, put in same timer as big corona + food movement
    miniMovement: function(){
        var pn;
        if(this.miniPath){//has plottable course
            pn = this.miniPath[this.miniStep];
            mx = pn[0]; //get x pos
            my = pn[1]; //get y pos
 
            PS.spriteMove(blockGame.miniCorona, mx, my);
            this.miniStep+= 1;

            //generate new path if bounces off top
            if(my == 5){
                blockGame.makeNewPath(mx, false);
            }
            
            //reduce happiness if bounces off bottom
            if(my == DIM - 8){
                statsData.changeStat('happy', -2);
                PS.audioPlayChannel(allSFX[HURT_NOISE].noise, {loop:false});
            }
            if(this.miniStep >= this.miniPath.length){//reach end of path, shoudldn't happen unless hits the top
                this.miniPath = null;
                this.miniStep = 0;


            }
        }

    },

    //make new path when mini corona bounces off of blocks or paddle
    makeNewPath: function(blockX, isPaddle){
        var nx;
        var ny;

        nx = this.calculateAngle(blockGame.xprev, blockX);
        
        //cap destination to stay onscreen
        isPaddle? ny = 5: ny = DIM-8;
        if(nx < 2){
            nx = 2;
        } else if (nx > DIM-3){
            nx = DIM -3;
        }

        //flip direction
        this.miniPath = PS.line(mx, my, nx, ny);
        this.miniStep = 0; //reset path
        if(blockX < 2){
            blockGame.xprev = 2;
        } else if (blockX > DIM - 3){
            blockGame.xprev = DIM-3;
        } else {
            blockGame.xprev = blockX;
        }

    },

    //calculate next x pos based off of where the corona launched from and where it landed  
    calculateAngle : function(xpre, xhit){
        var dif = mx - blockGame.xprev;

        if(dif == 0){
            return PS.random(DIM-1);
        } else {
            if(xhit == 2 && dif < 0){ //left side of paddle
                return mx - dif;
            } else if (xhit == 8 && dif > 0){
                return mx - dif;
            } else {
                return mx + dif;
            }
        }
    },

    //show + erase winning sprite, then go home
    showWin: function(){
        
        if(blockGame.isWin){
            blockGame.result = PS.spriteImage(correct_data);
            PS.statusText("You broke down the immune system!");
            blockGame.isWin = false;
            PS.spritePlane(blockGame.result, PLANE_STATS+1);
            PS.spriteMove(blockGame.result, 5, 5);
            PS.spriteShow(blockGame.result, true);
        } else {
            if(blockGame.result != '' && blockGame.result != null){
                PS.spriteShow(blockGame.result, false);
            }
            PS.timerStop(resultTimer);
            state = "home";
            PS.statusText("Corona's Home");
            me.reset();
            PS.audioStop(current_music);
            PS.audioPlayChannel( allMusic[0].m, {loop: true});
            current_music =  allMusic[0].m;
        }
    }

};