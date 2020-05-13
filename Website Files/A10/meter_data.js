//corona main metrics
let age= 0;
let hunger= 15; 
let happy= 18;

//corona age sprites + data + width
var corona0_data = '';
var corona1_data = '';
var corona2_data = '';
var corona3_data = '';
var corona4_data = '';

var corona0_width = '';
var corona1_width = '';
var corona2_width = '';
var corona3_width = '';
var corona4_width = '';

//age details:
/**
 * corona0: lasts until first fed 0
 * corona1: 30s 5
 * corona2: 30s 10
 * corona3: 90s, unlocked outfits 16 
 * corona4: 10-30s, then kill 21
 */

//grid shadow info
shadowTimer = '';
shadowOn = false;
var prevStatus = '';
deathTimer = '';




var statsData = {
    
    //max number of ticks is 21 --> to fill bar
    
    //y positions on screen
    hungerHeight: 20,
    ageHeight: 10,
    happyHeight: 15, 

    //fill in indicated data meter on stats page
    fillMeter : function(meter, toClear){
        var height = 0;
        var ticks = 0;
        var color;

        var xs = 5, xe = 6;

        switch(meter){
            case "happy":
                height = this.happyHeight;
                ticks = happy;
                color = PS.COLOR_YELLOW;
                
                break;
            case "hunger":
                height = this.hungerHeight;
                ticks = hunger;
                color = PS.COLOR_RED;
                break;
            case "age":
                height = this.ageHeight;
                ticks = age;
                color = 0x87f9ff;
                break;
        }

        if(ticks > 21){
            ticks = 21;
        } 
        if(ticks < 0){
            ticks = 0;
        }

        //for each tick, fill in block of corresponding meter
        for (let i = 0; i < ticks; i++) {
            //change color white to background when new bmp loaded
            toClear? this.fillLine(xs, xe, height, BACKGROUND): this.fillLine(xs, xe, height, color);
            xs++;
            xe++;
        }



    },

    //fill in single block w/color but no data
    fillLine: function(start, end, height, color){
        for(i = start; i <= end; i++){
            //PS.gridPlane(PLANE_CORONA);
            PS.color(i, height, color);
        }
    },

    //draw stats meter sprites + fill them
    drawStats : function () {

        PS.gridPlane(PLANE_CORONA);

        PS.spriteShow(age_sprite, true);
        PS.spriteShow(hunger_sprite, true);
        PS.spriteShow(happy_sprite, true);
        
        PS.spriteMove(age_sprite, 4, 9);
        PS.spriteMove(happy_sprite, 4, 14);
        PS.spriteMove(hunger_sprite, 4, 19);
        me.fillBlock(4, 27, 9, 11, 'age', PLANE_MAIN, PS.CURRENT);
        me.fillBlock(4, 27, 14, 16, 'happy', PLANE_MAIN, PS.CURRENT);
        me.fillBlock(4, 27, 19, 23, 'hunger', PLANE_MAIN, PS.CURRENT);

        this.fillMeter("happy", false);
        this.fillMeter("hunger", false);
        this.fillMeter("age", false);
        
        PS.border( PS.ALL, PS.ALL, 0 );
        
    },
    
    //reset stats
    clearStats : function () {

        PS.spriteShow(age_sprite, false);
        PS.spriteShow(hunger_sprite, false);
        PS.spriteShow(happy_sprite, false);
        me.fillBlock(4, 27, 9, 11, 0, PLANE_MAIN, BACKGROUND);
        me.fillBlock(4, 27, 14, 16, 0, PLANE_MAIN, BACKGROUND);
        me.fillBlock(4, 27, 19, 23, 0, PLANE_MAIN, BACKGROUND);
        

    },
    
    //handles decrease over time of hunger/happy 
    meterTick : function(){
        hunger-=3;
        happy-=3;

        if(hunger < 7){
            //low hunger alert
            PS.statusText("Corona's hunger meter is getting low!");
            notifType = 2;
            // if(statsData.shadowOn){
            //     statsData.shadowOn = false;
            //     PS.timerStop(statsData.shadowTimer);
            // }
            // PS.gridShadow(true, 0xc40000);
            // statsData.shadowOn = true;
            // statsData.shadowTimer = PS.timerStart(120, statsData.pulseShadow);
        }
        if(happy < 8){
            //low happiness alert
            PS.statusText("Corona's happy meter is getting low!");
            notifType = 2;

            // if(statsData.shadowOn){
            //     statsData.shadowOn = false;
            //     PS.timerStop(statsData.shadowTimer);
            // }
            // PS.gridShadow(true, 0xc40000);
            // statsData.shadowOn = true;
            // statsData.shadowTimer = PS.timerStart(120, statsData.pulseShadow);
        }
      
        //this.fillMeter("happy", false);
        //this.fillMeter("hunger", false);
    },
    
    //general function to change indicated stat value from anywhere
    changeStat: function(stat, value){
        switch(stat){
            case 'hunger':
                hunger+=value;
                break;
            case 'happy':
                happy+=value;
                break;
            case 'age':
                age+=value;
                break;
            default:
                break;
        }
        //check if values have maxed or minned here

        //change grid shadow to help notify player of a change, works with notif system
        // if(statsData.shadowOn){
        //     statsData.shadowOn = false;
        //     PS.timerStop(statsData.shadowTimer);
        // }
        // value < 0? PS.gridShadow(true, PS.COLOR_RED): PS.gridShadow(true, PS.COLOR_GREEN); 
        // statsData.shadowOn = true;
        // statsData.shadowTimer = PS.timerStart(60, this.pulseShadow);
        
        //handle death scenarios + notif of maxing
        if(hunger < 0){
            PS.statusText("Oh no, Corona died of starvation!");
            this.showDeathScreen();
            deathTimer = PS.timerStart(200, this.startOver);
        }else if(hunger >= 21 && stat == 'hunger'){
            PS.statusText("Corona is full!");
        }
        if(happy < 0){
            PS.statusText("Oh no, Corona died of sadness :(");
            this.showDeathScreen();
            deathTimer = PS.timerStart(200, this.startOver);
        }
        if(happy >= 21 && stat == 'happy'){
            PS.statusText("Corona is at max happines :)");
            
        }
    },

    //load age + meter sprites
    loadAges: function(){
        PS.imageLoad( "sprites/coronaAges/corona0.gif", function ( data ) {
            corona0_data = data; // save image data
            corona0_width = data.width; // save image data

            
            coronaCurrent_sprite = PS.spriteImage( corona0_data );
            corona_max = DIM - data.width; // calculate maximum corona x-position
            corona_width = corona0_width;
            current_width = corona0_width;
            current_data = data;

            currentSmall_data = data;
		    currentSmall_width = data.width;

            PS.spritePlane( coronaCurrent_sprite, PLANE_STATS ); // assign plane
            corona_y = DIM-corona0_width - 5;
			PS.spriteMove( coronaCurrent_sprite, 9,  DIM - corona0_width - 5); // move to initial position
            
            PS.imageLoad( "sprites/coronaAges/corona1.gif", function ( data ) {
                corona1_data = data; // save image data
                corona1_width = data.width; // save image data
                
                PS.imageLoad( "sprites/coronaAges/corona2.gif", function ( data ) {
                    corona2_data = data; // save image data
                    corona2_width = data.width; // save image data
                    
                    PS.imageLoad( "sprites/coronaAges/corona3.gif", function ( data ) {
                        corona3_data = data; // save image data
                        corona3_width = data.width; // save image data
                        
                        PS.imageLoad( "sprites/coronaAges/corona4.gif", function ( data ) {
                            corona4_data = data; // save image data
                            corona4_width = data.width; // save image data
                
                        } );
                    } );
                } );
            } );
        } );
    },

    //change sprite + positioning based on new age of corona
    setAgeSprites: function(){
        // PS.debug("set age sprites called! " + age + "\n");
        if(ageTimer != '' && ageTimer != null){
            PS.timerStop(ageTimer);
        }

        //on each age change, start new timer until next age change
        switch(age){
            case 5:
                // PS.debug("age 1 reached\n");
                current_data = corona1_data;
                current_width = corona1_width;
                currentSmall_data = corona1_data;
                currentSmall_width = corona1_width;
                corona_y = 23;
                ageTimer = PS.timerStart(1800, this.increaseAndCall); //30 sec for now
                
                break;
            case 10:
                // PS.debug("age 2 reached\n");
                current_data = corona2_data;
                current_width = corona2_width;
                currentSmall_data = coronaSmall_data;
                currentSmall_width = coronaSmall_width;
                if(state == 'block'){
                    //do nothing
                }else if(state == 'feed'){
                    corona_y = 20;
                } else {
                    corona_y = 17;
                }
                ageTimer = PS.timerStart(1800, this.increaseAndCall); //30 sec for now

                break;
            case 15: 
                current_data = corona3_data;
                current_width = corona3_width;
                currentSmall_data = coronaSmall_data;
                currentSmall_width = coronaSmall_width;
                if(state == 'block'){
                    //do nothing
                } else if(state!= 'feed'){
                    corona_y = 14;
                }
                ageTimer = PS.timerStart(5400, this.increaseAndCall); //90 sec for now

                break;
            case 21: 
                current_data = corona4_data;
                current_width = corona4_width;
                currentSmall_data = coronaSmall_data;
                currentSmall_width = coronaSmall_width;
                if(state == 'block'){
                    //do nothing
                } else {
                    corona_y = 14;
                }
                state = "home";
                PS.statusText("Corona has reached full age!");
                me.reset();
                PS.audioStop(current_music);
                PS.audioPlayChannel( allMusic[0].m, {loop: true});
                current_music =  allMusic[0].m;
                // PS.debug( "home time\n" );
                ageTimer = PS.timerStart(200, this.increaseAndCall); //10 sec for now

                break;

        }

        if(state == 'stats' || state == 'play' || state == 'block'){
            //no
            return;
        }

        if(state != 'home'){
            PS.spriteShow(coronaCurrent_sprite, false);
            coronaCurrent_sprite = PS.spriteImage(currentSmall_data);
            PS.spritePlane( coronaCurrent_sprite, PLANE_STATS); // assign plane
            if(age != 5){

                me.setPublicCollide();
            }
            corona_max = DIM - currentSmall_width;
            
        } else {

            PS.spriteShow(coronaCurrent_sprite, false);

            coronaCurrent_sprite = PS.spriteImage(current_data);
            PS.spritePlane( coronaCurrent_sprite, PLANE_STATS); // assign plane
         
            corona_max = DIM - current_width;
        }
       // prevStatus = PS.statusText();
        if(age == 21){
           //don't
        } else {

            PS.statusText("Corona has aged!");
        }
        PS.statusColor(LIGHT_BLUE);
        // PS.gridShadow(true, LIGHT_BLUE);
        // statsData.shadowOn = true;
        // statsData.shadowTimer = PS.timerStart(120, statsData.pulseShadow);
        PS.spriteMove( coronaCurrent_sprite, corona_x, corona_y ); 
     
    },

    //increase age + call death screen if corona has reached max age
    increaseAndCall : function(){
        // PS.debug("calling increase and call\n");
        switch(age){
            case 5:
            case 10:
                age+=5;
                break;
            case 15:
                age+=6;
                break;
            case 21:
                statsData.showPlayerDeathScreen();
                return;
                //deathTimer = PS.timerStart(200, this.startOver);
            
        }
        //set new aged sprite
        statsData.setAgeSprites();
    },

    //used to set grid shadow for short time before returning to normal
    pulseShadow : function(){
       // PS.statusText(prevStatus)
        PS.statusColor(DARK_GREEN);
        // PS.gridShadow(false, LIGHT_BLUE);
        // if(statsData.shadowOn == true){

            // PS.timerStop(statsData.shadowTimer);
        // }
        // statsData.shadowOn = false;

    },

    //death screen for corona
    showDeathScreen: function(){
        me.reset();
        // PS.debug("death screen called \n");

        PS.spriteShow(coronaCurrent_sprite, false);
        coronaDeathSprite = PS.spriteImage(coronaDeath_data);
        PS.spritePlane(coronaDeathSprite, PLANE_STATS);
        PS.spriteMove(coronaDeathSprite, 0, 0);
        
        coronaGhostSprite = PS.spriteImage(coronaGhost_data);
        PS.spritePlane(coronaDeathSprite, PLANE_STATS);
        PS.spriteMove(coronaGhostSprite, 15, 10);
        PS.data(PS.ALL, PS.ALL, -1);
        canMove = false;
    },

    //reload window to start new game
    startOver: function(){
        location.reload();
    },

    //death screen for you
    showPlayerDeathScreen: function(){
        me.reset();
        // PS.debug("death screen called \n");
        PS.spriteShow(coronaCurrent_sprite, false);
        playerDeathSprite = PS.spriteImage(playerDeath_data);
        PS.spritePlane(playerDeathSprite, PLANE_STATS);
        PS.spriteMove(playerDeathSprite, 0, 0);
        PS.data(PS.ALL, PS.ALL, -1);

        PS.audioPlay('fx_wilhelm');
        if(ageTimer != null && ageTimer != ''){
            PS.timerStop(ageTimer);
        }
        canMove = false;
        
    }


};