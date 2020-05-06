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

aminoA_data = '';
aminoT_data = '';
aminoC_data = '';
aminoG_data = '';
correct_data = '';
wrong_data = '';
question_data = '';
questionMark = '';


colors= [LIGHT_BLUE, LIGHT_GREEN, LIGHT_RED, ORANGE, PURPLE, RED];
aminos= [];
sqIndex = 0;
numTries = 0; //at 3 lose happiness and quit game
xTick = 26;
activeSprites=[];
//color, acid (data)
answerSequence=[];
playerSequence=[];
speed = 120; //increase on each click for difficulty?
setupTimer = '';
resultTimer = '';
resetTimer = '';
sqTimer = '';
isSetupTimerDone = true;
isResultTimerDone = true;
isResetTimerDone = true;
isSqTimerDone = true;
currentResult = '';
isRight = false;


selectedColor = PS.CURRENT;
selectedAcid = '';


var dna = {
    

    drawGame: function(){
        this.generateSequence();

        sqTimer = PS.timerStart(speed, this.flashSequence);
        isSqTimerDone = false;
        setupTimer = PS.timerStart(speed*8, this.drawOptions);
        isSetupTimerDone = false;
    },

    clearGame: function(){
        var x= 2;
        var x1 = 6;
        var x2 = 10;
        var y1 = 6;
        var y2 = 11;

        var cx = 10;
        var lx = 7;
        answerSequence.forEach(function(e){

            me.fillBlock(x-1, x+3, 9, 14, '', PLANE_MAIN, BACKGROUND);
            x+=5;
        });

        for(i = 0; i < 4; i++){
             me.fillBlock(x1,x2,y1,y2,0,PLANE_MAIN,BACKGROUND);
 
             x1+=5;
             x2+=5; 
 
         }


        answerSequence.forEach(e=>PS.spriteShow(e.acid, false));
        
        //erase colors
        colors.forEach(function(e){
            //data is self, color info
            me.fillBlock(cx, cx+1, 16, 17, 0, PLANE_MAIN, BACKGROUND);
            cx+=2;
        });
       // PS.debug("timer sq and timer setup val: " + sqTimer + " " + setupTimer + '\n');
        sqIndex = 0;
        numTries = 0;
        xTick = 26;
        for(i = 0; i < 3; i++){
            PS.color(xTick, 23, BACKGROUND);
            xTick+=2;
        }
        xTick = 26;
        //clear timers
        if(!isSqTimerDone && sqTimer != ''){
            //PS.debug("stop sequnce timer!\n");
            PS.timerStop(sqTimer);
            isSqTimerDone = true;
        }
       // PS.debug("result timer? " + isResultTimerDone+'\n');
        if(!isResultTimerDone && resultTimer != ''){
          //  PS.debug("stop resutl timer!\n");
            PS.timerStop(resultTimer);
            isResultTimerDone = true;
        }
        if(!isSetupTimerDone && setupTimer != ''){
            // PS.debug("stop setup timer!\n");
            PS.timerStop(setupTimer);
            isSetupTimerDone = true;
        }
        if(!isResetTimerDone && resetTimer != ''){
            // PS.debug("stop reset timer!\n");
            PS.timerStop(resetTimer);
            isResetTimerDone = true;
        }
    

        //erase letters
        activeSprites.forEach(e=>PS.spriteShow(e, false));
        
        answerSequence = [];
        playerSequence = [];
    },

    //x1, x2, y1, y2, data, plane, color
    drawOptions : function(){
        var x1 = 6;
        var x2 = 10;
        var y1 = 6;
        var y2 = 11;

        var cx = 10;
        var lx = 7;

        var blockIndex = 1;
        PS.gridPlane(PLANE_MAIN);
        //draw blank blocks
        for(i = 0; i < 4; i++){
           // this.outline(x, x+4, 10, 14);

            //top and bottom
            for(j = x1; j <=x2; j++){
                PS.color(j, y1, PS.COLOR_BLACK);
                PS.color(j, y2, PS.COLOR_BLACK);
            }
            //left sides
            for(j = y1; j <=y2; j++){
                PS.color(x1, j, PS.COLOR_BLACK);
                PS.color(x2, j, PS.COLOR_BLACK);
            }
            me.fillBlock(x1,x2,y1,y2,{index:blockIndex, xs:x1,xe:x2,ys:y1,ye:y2},PLANE_MAIN,PS.CURRENT);

            x1+=5;
            x2+=5;
            blockIndex++;


        }
        
        //draw colors
        colors.forEach(function(e){
            //data is self, color info
            me.fillBlock(cx, cx+1, 16, 17, e, PLANE_MAIN, e);
            cx+=2;
        });
        
        //draw letters
        aminos.forEach(function(e){
            var n = PS.spriteImage(e);
            PS.spritePlane(n, PLANE_STATS);
            PS.spriteMove(n, lx, 22);
            activeSprites.push(n);
            me.fillBlock(lx, lx+4, 22, 26, e, PLANE_MAIN, PS.CURRENT);
            lx+=5;
        });
        
        PS.timerStop(setupTimer);
        isSetupTimerDone = true;
    },

    assignCurrentValues: function(data){

        if(data == LIGHT_RED || data == LIGHT_BLUE || data == MEDIUM_GREEN ||
            data == LAVENDER || data == RED || data == ORANGE || data == PURPLE || data == LIGHT_GREEN ){
            selectedColor = data;
            // PS.debug("selected color is " + selectedColor + '\n');
        } else if (data == aminoT_data || data == aminoC_data || data ==  aminoG_data || data == aminoA_data){
            selectedAcid = data;
            // PS.debug("selected acid is " + selectedAcid + '\n');
        }

        if(data.index == 1 || data.index == 2 || data.index == 3 || data.index == 4 || data.index == 5 || data.index == 6 || data.index == 7){
            // PS.debug("This is an empty block and about to be filled hopefully?" + selectedAcid + "\n");
            var temp = data;
            if(selectedAcid != ''){
                var ts = PS.spriteImage(selectedAcid);
                PS.spritePlane(ts, PLANE_STATS);
            }
            me.fillBlock(data.xs,data.xe,data.ys,data.ye,temp,PLANE_MAIN,selectedColor);
            PS.spriteMove(ts, data.xs+1, data.ys+1); 
            activeSprites.push(ts);
            playerSequence[data.index - 1] = {color:selectedColor, acid:selectedAcid};
            //none of player sequence undefined

            if(this.checkPlayerSequenceDefined()){
                // PS.debug("checking if defined here\n");
                questionMark = PS.spriteImage(question_data);
                PS.spritePlane(questionMark, PLANE_CORONA);
                PS.spriteMove(questionMark, 26, 15);
                me.fillBlock(26, 30, 15, 22, 'question', PLANE_MAIN, PS.CURRENT);
                activeSprites.push(questionMark);
                //this.checkAnswer();
            }           
        }
    },

    checkPlayerSequenceDefined: function(){
        for(i = 0; i < answerSequence.length; i++){
            if(playerSequence[i] == undefined){
                // PS.debug("sequnce not finsihed \n");
                return false;
            }
        }

        return true;
    },

    //check if user inputted sequence matches the answer
    checkAnswer: function(){   
        var i; 
       
        for(i = 0; i < answerSequence.length; i++){
            if(playerSequence[i] == undefined){
                // PS.debug("sequnce not finsihed \n");
                return;
            }
            if(answerSequence[i].color == playerSequence[i].color && answerSequence[i].data == playerSequence[i].acid){
                //acids and colors match, continue loop
                // PS.debug("this part matches!\n");
            } else {
                // PS.debug("wrong sequence boo hoo\n");
                isRight = false;
                numTries++;
                isResultTimerDone = false;
                resultTimer = PS.timerStart(50, this.flashResult);
                //fill in tick
                PS.color(xTick, 23, PS.COLOR_BLACK);
                xTick+=2;

                //out of tries reset to home and reduce happiness
                if(numTries == 3){
                    // PS.debug("ran out of tries! less happy");
                    statsData.changeStat('happy', -3);
                    //happy-=3;
                    me.notify(2);
                    resetTimer = PS.timerStart(90, this.waitAndReset);
                    isResetTimerDone = false;
                    DB.send();

                }

                return false;
            }
        }
        // PS.debug("correct sequence reached!\n");
        isRight = true;
        isResultTimerDone = false;
        resultTimer = PS.timerStart(50, this.flashResult);
        DB.send();
        //increase happiness and clear screen here
        // PS.debug("happy value befiore= " + happy + '\n');
        statsData.changeStat('happy', 3);
       // happy+=3;
        me.notify(1);
        // PS.debug("happy value after= " + happy + '\n');
        isResetTimerDone = false;
        resetTimer = PS.timerStart(90, this.waitAndReset);
        //notif!
        return true;

    },

    waitAndReset:function(){
        state = "home";
        isResetTimerDone = true;
        PS.statusText("Corona's Home");
        me.reset();
        PS.audioStop(current_music);
        PS.audioPlayChannel( allMusic[0].m, {loop: true});
        current_music =  allMusic[0].m;
        // PS.debug( "home time\n" );
        PS.timerStop(resetTimer);
    },

    flashResult: function(){
        // PS.debug("flash result!\n");
        isResultTimerDone = true;
        if(currentResult != ''){
            // PS.debug("reset result!\n");
            PS.spriteShow(currentResult, false);
            PS.timerStop(resultTimer);
            
            currentResult = '';
            PS.statusText("Memorize That Mutation!");
            return;
        }
        if(isRight){
            // PS.debug("right result!\n");
            currentResult = PS.spriteImage(correct_data);
            PS.statusText("You've found the right DNA sequence!");
        } else {
            // PS.debug("wrong result!\n");
            PS.statusText("Wrong DNA sequence :(");
            currentResult = PS.spriteImage(wrong_data);
        }
        PS.spritePlane(currentResult, PLANE_STATS+1);
        PS.spriteMove(currentResult, 5, 5);
        PS.spriteShow(currentResult, true);
        
    },

    //flash answer sequence
    flashSequence : function(){
        var x = 14;
        if(sqIndex >= answerSequence.length){
           

            me.fillBlock(x-1, x+3, 9, 14, '', PLANE_MAIN, BACKGROUND);
               
            answerSequence.forEach(e=>PS.spriteShow(e.acid, false));
            PS.timerStop(sqTimer);
            isSqTimerDone = true;
            return;
        }
        if(sqIndex > 0){
            // PS.debug("sequence undex is 0 nothing to hide \n");
            PS.gridPlane(PLANE_MAIN);
          //  me.fillBlock(x-1, x+3, 9, 14, '', PLANE_MAIN, BACKGROUND);
            PS.spritePlane(answerSequence[sqIndex - 1].acid, PLANE_STATS);
            PS.spriteShow(answerSequence[sqIndex - 1].acid, false); //hide previous
            
        }

        // PS.debug("sequence undex is above 0 hude a thing!" + sqIndex + " \n");
        PS.gridPlane(PLANE_MAIN);
        PS.spriteShow(answerSequence[sqIndex].acid, true);
        me.fillBlock(x-1, x+3, 9, 14, '', PLANE_MAIN, (answerSequence[sqIndex].color));
        PS.spritePlane(answerSequence[sqIndex].acid, PLANE_STATS);
        PS.spriteMove(answerSequence[sqIndex].acid, x, 10); //flash new
        sqIndex < answerSequence.length? sqIndex++: sqIndex = answerSequence.length;

    },


    //x1, x2, y1, y2, data, plane, color
    //replace acid tag placeholders with actual sprite information
    fillSequence : function(){
        var newLetter;
        var matchSprites = {
            'A': aminoA_data,
            'T': aminoT_data,
            'C': aminoC_data,
            'G': aminoG_data
        };
        
        //create separate sprite for each letter
        answerSequence.forEach(function(e){
            newLetter = PS.spriteImage(matchSprites[e.acid]);
            e.data = matchSprites[e.acid]; //store data for comparison later
            e.acid = newLetter;
            // PS.debug("new letter "+ newLetter +  "\n");           
            //e.acid = matchSprites[e.acid]; //data
        })
    },

    //generate random sequence of amino acids and colors for player to guess
    generateSequence : function(){

        for(i = 0; i < 4; i++){

            var randColor = PS.random(5);
            var randAcid = PS.random(4);
    
            var rc = this.pickRand(randColor, 'color');
            var ra = this.pickRand(randAcid, 'acid');


            answerSequence.push({color: rc, acid: ra, data:ra});

        }
        // PS.debug("anwer sequence is: \n");
        //answerSequence.forEach(el=>PS.debug(el.color + " " + el.acid + '\n'));
        this.fillSequence();

    },

    //takes in randon number of type color or acid and returns random color or acid for 
    //random sequence generation
    pickRand : function(num, type){
        // PS.debug("num is " + num + '\n');
        var rc = {
            1: LIGHT_RED,//pinkTile,
            2: LIGHT_BLUE,//blueTile,//
            //3: MEDIUM_GREEN,//greenTile,//
            3: ORANGE,//orangeTile
            4: PURPLE,//purpleTile
           // 6: LAVENDER,//yellowTile,//
            5: RED,//redTile,
        }
        var ra = {
            1: 'A',
            2: 'T',
            3: 'C',
            4: 'G'
        }
        switch(type){
            case 'color':
                // PS.debug("rand color chosen " + rc[num] + '\n');
                return rc[num];
            case 'acid':
                // PS.debug("rand acid chosen " + ra[num] + '\n');
                return ra[num];
        }
    
    },

    //load in amino acid sprites
    loadBlocks: function(){
        PS.imageLoad( "sprites/aminos/a.gif", function ( data ) {
            // PS.debug( "a loaded\n" );
            aminoA_data = data; // save image data
            
            PS.imageLoad( "sprites/aminos/t.gif", function ( data ) {
                // PS.debug( "t loaded\n" );
                aminoT_data = data; // save image data
                
                PS.imageLoad( "sprites/aminos/c.gif", function ( data ) {
                    // PS.debug( "c loaded\n" );
                    aminoC_data = data; // save image data
                    
                    PS.imageLoad( "sprites/aminos/g.gif", function ( data ) {
                        // PS.debug( "g loaded\n" );
                        aminoG_data = data; // save image data

                        aminos.push(aminoA_data, aminoC_data, aminoG_data, aminoT_data);

                        PS.imageLoad( "sprites/aminos/smile.gif", function ( data ) {
                            // PS.debug( "g loaded\n" );
                            correct_data = data; // save image data

                            
                            PS.imageLoad( "sprites/aminos/wrong.gif", function ( data ) {
                                // PS.debug( "g loaded\n" );
                                wrong_data = data; // save image data

                                PS.imageLoad( "sprites/aminos/question.gif", function ( data ) {
                                    // PS.debug( "g loaded\n" );
                                    question_data = data; // save image data
    
                                } );
                            } );
                        } );
                    } );
                } );
            } );
        } );		
    }
     
};