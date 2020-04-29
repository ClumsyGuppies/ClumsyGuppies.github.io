let age= 7;
let hunger= 11; 
let happy= 11;

var statsData = {
    
    //max number of ticks is 21 --> to fill bar
    
    hungerHeight: 17,
    ageHeight: 7,
    happyHeight: 12, 

    

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
        
        PS.spriteMove(age_sprite, 4, 6);
        PS.spriteMove(happy_sprite, 4, 11);
        PS.spriteMove(hunger_sprite, 4, 16);

        this.fillMeter("happy", false);
        this.fillMeter("hunger", false);
        this.fillMeter("age", false);

        //girl and old lady
        PS.glyph(2, 7, 0x1f469);
        PS.glyph(29, 7, 0x1f475);
        
        //empty and full plate
        PS.glyph(2, 17, 0x1f374);
        PS.glyph(29, 17, 0x1f958);
        
        //sad and happy face
        PS.glyph(2, 12, 0x1f622);
        PS.glyph(29, 12, 0x1f60a);
        
        PS.border( PS.ALL, PS.ALL, 0 );
        
    },
    
    clearStats : function () {
        this.fillMeter("happy", true);
        this.fillMeter("hunger", true);
        this.fillMeter("age", true);
        PS.spriteShow(age_sprite, false);
        PS.spriteShow(hunger_sprite, false);
        PS.spriteShow(happy_sprite, false);
        
        //girl and old lady
        PS.glyph(2, 7, 0);
        PS.glyph(29, 7, 0);
        
        //empty and full plate
        PS.glyph(2, 17, 0);
        PS.glyph(29, 17, 0);
        
        //sad and happy face
        PS.glyph(2, 12, 0);
        PS.glyph(29, 12, 0);

        // var temp = happy;
        // if(current_data != bigBase_data){
        //     happy+=3;
        // } else {
        //     happy = temp - 3;
        // }
    },
    
    //handles decrease over time of hunger/happy and increase over time of age
    meterTick : function(){
        hunger-=3;
        happy-=3;
        // PS.debug("happy and hunger have decreased! " + happy+" " + hunger + "\n");
        if(hunger < 0){
            PS.statusText("Oh no, Corona died of starvation!");
        }
        //this.fillMeter("happy", false);
        //this.fillMeter("hunger", false);
    },
    
    ageTick : function(){
        age+=7;
        // PS.debug("age has changed! " + age+"\n");
       // this.fillMeter("age", false);
    }


};