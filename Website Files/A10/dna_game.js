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

//sprite data
aminoA_data = '';
aminoT_data = '';
aminoC_data = '';
aminoG_data = '';
correct_data = '';
wrong_data = '';
question_data = '';
questionMark = '';
myindex= 0;
answerChecked = false;


colors= [LIGHT_BLUE, LIGHT_GREEN, LIGHT_RED, ORANGE, PURPLE, RED];
aminos= [];
sqIndex = 0;
numTries = 0; //at 3 lose happiness and quit game
xTick = 26;
activeSprites=[];

//color, acid (data)
answerSequence=[];
playerSequence=[];

speed = 120; //speed sequence is flashed on screen

//essential timers + info
setupTimer = null;
resultTimer = null;
resetTimer = null;
sqTimer = '';
isSetupTimerDone = true;
isResultTimerDone = true;
isResetTimerDone = true;
isSqTimerDone = true;
currentResult = '';
isRight = false;

resultShown = false;

//keep track of player selected acid + color
selectedColor = PS.CURRENT;
selectedAcid = '';


var dna = {
    

    //draw initial screen + start showing randomly generated sequence
    drawGame: function(){
        this.generateSequence();

        sqTimer = PS.timerStart(speed, this.flashSequence);
        isSqTimerDone = false;
        setupTimer = PS.timerStart(speed*5, this.drawOptions);
        isSetupTimerDone = false;
    },

    //reset game + clear all sprites
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
            // PS.debug("stop sequnce timer!\n");
            PS.timerStop(sqTimer);
            isSqTimerDone = true;
        }
        if(resultTimer){
            PS.timerStop(resultTimer);
            isResultTimerDone = true;
            resultTimer = null;
        }
        if(setupTimer){
            PS.timerStop(setupTimer);
            isSetupTimerDone = true;
            setupTimer = null;
        }
        if(resetTimer){
            PS.timerStop(resetTimer);
            resetTimer = null;
            isResetTimerDone = true;
        }
    

        //erase letters
        activeSprites.forEach(e=>PS.spriteShow(e, false));
        
        answerSequence = [];
        playerSequence = [];
        selectedAcid = '';
        selectedColor = '';
    },

    //x1, x2, y1, y2, data, plane, color
    //draw out all acid + color options, fill in data regions so they are selectable options
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
        // aminos.forEach(e=>PS.debug("amino: " + e + '\n'));
        //draw letters
        aminos.forEach(function(e){
            var n = PS.spriteImage(e);
            PS.spritePlane(n, PLANE_STATS);
            PS.spriteMove(n, lx, 22);
            activeSprites.push(n);
            me.fillBlock(lx, lx+4, 22, 26, e, PLANE_MAIN, PS.CURRENT);
            lx+=5;
        });
        
        if(setupTimer){
            PS.timerStop(setupTimer);
            setupTimer = null;
        }
        isSetupTimerDone = true;
    },

    //assign selected values + fill in player's guesses based on colors + acids selected
    assignCurrentValues: function(data){

        //selected a color
        if(data == LIGHT_RED || data == LIGHT_BLUE || data == MEDIUM_GREEN ||
            data == LAVENDER || data == RED || data == ORANGE || data == PURPLE || data == LIGHT_GREEN ){
            selectedColor = data;
            PS.audioPlay('xylo_eb7');

            //selected an acid
        } else if (data == aminoT_data || data == aminoC_data || data ==  aminoG_data || data == aminoA_data){ 
            selectedAcid = data;
            PS.audioPlay('xylo_eb6');
        }

        //selected a blank space for guessing
        if(data.index == 1 || data.index == 2 || data.index == 3 || data.index == 4 || data.index == 5 || data.index == 6 || data.index == 7){
            var temp = data;
            //error checking to make sure not trying to fill in empty space with invalid color/sprite
            if(selectedAcid != ''){
                var ts = PS.spriteImage(selectedAcid);
                PS.spritePlane(ts, PLANE_STATS);
                PS.spriteMove(ts, data.xs+1, data.ys+1); 
                activeSprites.push(ts);
            }
            if(selectedColor != ''){
                me.fillBlock(data.xs,data.xe,data.ys,data.ye,temp,PLANE_MAIN,selectedColor);
                
            }
            if(selectedAcid != '' && selectedColor != '') {
                playerSequence[data.index - 1] = {color:selectedColor, acid:selectedAcid};
                PS.audioPlay('xylo_eb5');
            }
            
            //once full sequence is filled out, allow option to check if player sequence is correct - 3 tries
            if(this.checkPlayerSequenceDefined()){
                questionMark = PS.spriteImage(question_data);
                PS.spritePlane(questionMark, PLANE_CORONA);
                PS.spriteMove(questionMark, 26, 15);
                me.fillBlock(26, 30, 15, 22, 'question', PLANE_MAIN, PS.CURRENT);
                activeSprites.push(questionMark);
            }           
        }
    },

    //check if player has filled out all blanks before allowing to check answer
    checkPlayerSequenceDefined: function(){
        for(i = 0; i < answerSequence.length; i++){
            if(playerSequence[i] == undefined){
                return false;
            }
        }

        return true;
    },

    //check if user input sequence matches the answer
    checkAnswer: function(){   
        var i; 
        // answerChecked = false;
        me.fillBlock(26, 30, 15, 22, '', PLANE_MAIN, PS.CURRENT);
        for(i = 0; i < answerSequence.length; i++){
            if(playerSequence[i] == undefined){
                answerChecked = true;
                return;
            }
            if(answerSequence[i].color == playerSequence[i].color && answerSequence[i].data == playerSequence[i].acid){
                //acids and colors match, continue loop
            } else {
                //increase number of guesses made; if 3, lost the game + decrease happiness + go home
                isRight = false;
                numTries++;
                isResultTimerDone = false;
                resultTimer = PS.timerStart(50, this.flashResult);
                //fill in tick
                if(xTick > DIM -1){ 
                    xTick = DIM -2;
                }
                PS.color(xTick, 23, PS.COLOR_BLACK);
                xTick+=2;

                //out of tries reset to home and reduce happiness
                if(numTries == 3){
                    statsData.changeStat('happy', -3);
                    //happy-=3;
                    PS.audioPlayChannel(allSFX[SAD_NOISE].noise, {loop:false});
                    notifType = 2;
                    
                   // me.notify(2);
                    resetTimer = PS.timerStart(120, this.waitAndReset); //longer to accomodate slower PCs
                    isResetTimerDone = false;
                    me.publicFillData(0, DIM-1, 5, DIM-5, -1);

                }

                return false;
            }
        }
        //go right answer! increase happiness + go home

        isRight = true;
        isResultTimerDone = false;
        resultTimer = PS.timerStart(50, this.flashResult);
        PS.audioPlayChannel(allSFX[HAPPY_NOISE].noise, {loop:false});
        //increase happiness and clear screen here
        statsData.changeStat('happy', 3);
        notifType = 1;
        isResetTimerDone = false;
        resetTimer = PS.timerStart(120, this.waitAndReset);
        //notif!
        return true;

    },

    //reset screen to home after a pause
    waitAndReset:function(){
        state = "home";
        isResetTimerDone = true;
        PS.statusText("Corona's Home");
        me.reset();
        PS.audioStop(current_music);
        PS.audioPlayChannel( allMusic[0].m, {loop: true});
        current_music =  allMusic[0].m;
        if(resetTimer){
            PS.timerStop(resetTimer);
        }
    },
    
    //flash correct or wrong answer result on screen for player feedback
    flashResult: function(){
        // PS.debug("flash result /called!" + myindex + "\n");
        // myindex++;
        
        if(dna.resultShown){ //already showed result, stop timer and show nothing else
            // PS.debug("dna already shown\n");
            // PS.debug("readd question mark\n");
            me.fillBlock(26, 30, 15, 22, 'question', PLANE_MAIN, PS.CURRENT);
            if(currentResult != ''){
                // PS.debug("current result is null\n");
                PS.spriteShow(currentResult, false);
                currentResult = '';
                PS.statusText("Memorize That Mutation!");
                dna.resultShown = false;
                if(resultTimer){
                    PS.timerStop(resultTimer);
                    isResultTimerDone = true;
                    resultTimer = null;
                }
                return;
            }
            if(resultTimer){
                PS.timerStop(resultTimer);
                isResultTimerDone = true;
                resultTimer = null;
            }
        }
        // PS.debug("continue on\n");
        dna.resultShown = true;

        if(isRight){
            currentResult = PS.spriteImage(correct_data);
            PS.statusText("You've found the right DNA sequence!");
        } else {
            PS.statusText("Wrong DNA sequence :(");
            currentResult = PS.spriteImage(wrong_data);
        }
        PS.spritePlane(currentResult, PLANE_STATS+1);
        PS.spriteMove(currentResult, 5, 5);
        PS.spriteShow(currentResult, true);
        
    },

    displayResult : function(){
        if(isRight){
            currentResult = PS.spriteImage(correct_data);
            PS.spriteShow(currentResult, true);

        }

    },

    //flash answer sequence at the begining 
    flashSequence : function(){
        var x = 14;
        //once reach end stop timer + hide sequence
        if(sqIndex >= answerSequence.length){
           
            me.fillBlock(x-1, x+3, 9, 14, '', PLANE_MAIN, BACKGROUND);
               
            answerSequence.forEach(e=>PS.spriteShow(e.acid, false));
            PS.timerStop(sqTimer);
            isSqTimerDone = true;
            return;
        }
        if(sqIndex > 0){
            PS.gridPlane(PLANE_MAIN);
            PS.spritePlane(answerSequence[sqIndex - 1].acid, PLANE_STATS);
            PS.spriteShow(answerSequence[sqIndex - 1].acid, false); //hide previous
            
        }

        PS.gridPlane(PLANE_MAIN);
        PS.spriteShow(answerSequence[sqIndex].acid, true);
        me.fillBlock(x-1, x+3, 9, 14, '', PLANE_MAIN, (answerSequence[sqIndex].color));
        PS.spritePlane(answerSequence[sqIndex].acid, PLANE_STATS);
        PS.spriteMove(answerSequence[sqIndex].acid, x, 10); //flash new
        PS.audioPlay('fx_boop');
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
        // answerSequence.forEach(el=>PS.debug(el.color + " " + el.acid + '\n'));
        this.fillSequence();

    },

    //takes in randon number of type color or acid and returns random color or acid for 
    //random sequence generation
    pickRand : function(num, type){
        var rc = {
            1: LIGHT_RED,
            2: LIGHT_BLUE,
            3: ORANGE,
            4: PURPLE,
            5: RED,
        }
        var ra = {
            1: 'A',
            2: 'T',
            3: 'C',
            4: 'G'
        }
        switch(type){
            case 'color':
                return rc[num];
            case 'acid':
                return ra[num];
        }
    
    },

    //load in amino acid sprites
    loadBlocks: function(){
        PS.imageLoad( "sprites/aminos/a.gif", function ( data ) {
            aminoA_data = data; // save image data
            
            PS.imageLoad( "sprites/aminos/t.gif", function ( data ) {
                aminoT_data = data; // save image data
                
                PS.imageLoad( "sprites/aminos/c.gif", function ( data ) {
                    aminoC_data = data; // save image data
                    
                    PS.imageLoad( "sprites/aminos/g.gif", function ( data ) {
                        aminoG_data = data; // save image data

                        aminos.push(aminoA_data, aminoC_data, aminoG_data, aminoT_data);

                        PS.imageLoad( "sprites/aminos/correct.gif", function ( data ) {
                            correct_data = data; // save image data

                            
                            PS.imageLoad( "sprites/aminos/incorrect.gif", function ( data ) {
                                wrong_data = data; // save image data

                                PS.imageLoad( "sprites/aminos/question.gif", function ( data ) {
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