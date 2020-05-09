let age= 7;
let hunger= 11; 
let happy= 11;

var statsData = {
    
    //max number of ticks is 21 --> to fill bar
    
    hungerHeight: 20,
    ageHeight: 10,
    happyHeight: 15, 

    

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

    //fill in single block 
    fillLine: function(start, end, height, color){
        for(i = start; i <= end; i++){
            //PS.gridPlane(PLANE_CORONA);
            PS.color(i, height, color);
        }
    },

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
    
    clearStats : function () {
        //this.fillMeter("happy", true);
        //this.fillMeter("hunger", true);
        //this.fillMeter("age", true);
        PS.spriteShow(age_sprite, false);
        PS.spriteShow(hunger_sprite, false);
        PS.spriteShow(happy_sprite, false);
        me.fillBlock(4, 27, 9, 11, 0, PLANE_MAIN, BACKGROUND);
        me.fillBlock(4, 27, 14, 16, 0, PLANE_MAIN, BACKGROUND);
        me.fillBlock(4, 27, 19, 23, 0, PLANE_MAIN, BACKGROUND);
        
        //girl and old lady
        PS.glyph(2, 7, 0);
        PS.glyph(29, 7, 0);
        
        //empty and full plate
        PS.glyph(2, 17, 0);
        PS.glyph(29, 17, 0);
        
        //sad and happy face
        PS.glyph(2, 12, 0);
        PS.glyph(29, 12, 0);

        var temp = happy;
        // if(current_data != bigBase_data){
        //     happy+=3;
        // } else {
            //happy = temp - 3;
       // }
    },
    
    //handles decrease over time of hunger/happy and increase over time of age
    meterTick : function(){
        this.changeStat("hunger", -3);
        this.changeStat("happy", -3);
      
        //this.fillMeter("happy", false);
        //this.fillMeter("hunger", false);
    },
    
    ageTick : function(){
        age+=7;
        // PS.debug("age has changed! " + age+"\n");
       // this.fillMeter("age", false);
    },

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
        
        if(hunger < 0){
            PS.statusText("Oh no, Corona died of starvation!");
            // DB.send();
        }else if(hunger >= 21){
            PS.statusText("Corona is full!");
            // DB.send();
        }
        if(happy < 0){
            PS.statusText("Oh no, Corona died of sadness :(");
            // DB.send();
        }
        if(happy >= 21){
            PS.statusText("Corona is at max happines :)");
            // DB.send();
        }
    }


};