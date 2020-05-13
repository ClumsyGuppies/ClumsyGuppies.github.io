var dress = {

    //all outift info, big and small
     outfits: [],
     outfitIndex: 0,
     sOutfits: [],
    
    //load all outfit sprites and store data
    loadOutfits: function(){
        PS.imageLoad( "sprites/outfits/coronaLarge.gif", function ( data ) {
			PS.debug( "big corona loaded\n" );

			bigBase_data = data; // save image data
            big_width = data.width;
            
            PS.debug("beeg: " + bigBase_data + "\n");
			PS.imageLoad( "sprites/outfits/coronaBow.gif", function ( data ) {
				PS.debug( "bowtie loaded\n" );
				bowtie_data = data; // save image data
				bowtie_width = data.width; // save image data
                bowtie = PS.spriteImage(bowtie_data);
				
				PS.imageLoad( "sprites/outfits/coronaGlasses.gif", function ( data ) {
                    PS.debug( "sunglasses loaded\n" );
					sunglasses_data = data; // save image data
                    sunglasses_width = data.width; // save image data
                    sunglasses = PS.spriteImage(sunglasses_data);
                    
					PS.imageLoad( "sprites/outfits/coronaCowboy.gif", function ( data ) {
                        PS.debug( "cowboy loaded\n" );
						cowboy_data = data; // save image data
                        cowboy_width = data.width; // save image data
                        cowboy = PS.spriteImage(cowboy_data);
						
						PS.imageLoad( "sprites/outfits/coronaPride.gif", function ( data ) {
                            PS.debug( "pride loaded\n" );
                            pride_data = data; // save image data
                            pride_width = data.width; // save image data
                            pride = PS.spriteImage(pride_data);
                           
                            PS.imageLoad( "sprites/outfits/coronaMask.gif", function ( data ) {
                                PS.debug( "mask loaded\n" );
                                mask_data = data; // save image data
                                mask_width = data.width; // save image data
                                mask = PS.spriteImage(mask_data);
                               
                                PS.imageLoad( "sprites/outfits/coronaTiara.gif", function ( data ) {
                                    PS.debug( "crown  loaded\n" );
                                    crown_data = data; // save image data
                                    crown_width = data.width; // save image data
                                    crown = PS.spriteImage(crown_data);
                                   
                                    PS.imageLoad( "sprites/smallSprites/smallBow.gif", function ( data ) {
                                        PS.debug( "small bow loaded\n" );
                                        sBowtie_data = data; // save image data
                                        sBowtie_width = data.width; // save image data
                                        sBowtie_height = data.height; // save image data
                                        sBowtie = PS.spriteImage(sBowtie_data);
                                       
                                        PS.imageLoad( "sprites/smallSprites/smallHat.gif", function ( data ) {
                                            PS.debug( "small hat loaded\n" );
                                            sCowboy_data = data; // save image data
                                            sCowboy_width = data.width; // save image data
                                            sCowboy_height = data.height; // save image data
                                            sCowboy = PS.spriteImage(sCowboy_data);
                                           
                                            PS.imageLoad( "sprites/smallSprites/smallMask.gif", function ( data ) {
                                                PS.debug( "small mask loaded\n" );
                                                sMask_data = data; // save image data
                                                sMask_width = data.width; // save image data
                                                sMask_height = data.height; // save image data
                                                sMask = PS.spriteImage(sMask_data);
                                               
                                                PS.imageLoad( "sprites/smallSprites/smallPride.gif", function ( data ) {
                                                    PS.debug( "small pride loaded\n" );
                                                    sPride_data = data; // save image data
                                                    sPride_width = data.width; // save image data
                                                    sPride_height = data.height; // save image data
                                                    sPride = PS.spriteImage(sPride_data);
                                                   
                                                    PS.imageLoad( "sprites/smallSprites/smallSunglasses.gif", function ( data ) {
                                                        PS.debug( "small glasses loaded\n" );
                                                        sSunglasses_data = data; // save image data
                                                        sSunglasses_width = data.width; // save image data
                                                        sSunglasses_height = data.height; // save image data
                                                        sSunglasses = PS.spriteImage(sSunglasses_data);
                                                       
                                                        PS.imageLoad( "sprites/smallSprites/smallTiara.gif", function ( data ) {
                                                            PS.debug( "small crown loaded\n" );
                                                            sCrown_data = data; // save image data
                                                            sCrown_width = data.width; // save image data
                                                            sCrown_height = data.height; // save image data
                                                            sCrown = PS.spriteImage(sCrown_data);
                                                           
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
		} );
    },

    //change currently displayed sprite based on arrow input + current outfitIndex
    swapSprite : function(isLeft){

        var randomSound = PS.random(5) -1;

        isLeft? this.outfitIndex -= 1 : this.outfitIndex += 1;
        if(this.outfitIndex < 0){
            this.outfitIndex = this.outfits.length -1;
        } 
        if(this.outfitIndex >= this.outfits.length){
            this.outfitIndex = 0;
        }

        //swap sprite being shown, set current sprite information for use on other screens
        PS.spriteDelete(coronaCurrent_sprite);
        coronaCurrent_sprite = PS.spriteImage( this.outfits[this.outfitIndex].sprite);
        current_data = this.outfits[this.outfitIndex].sprite;
        current_width = this.outfits[this.outfitIndex].width;
        currentSmall_data = this.sOutfits[this.outfitIndex].sprite;
        currentSmall_width = this.sOutfits[this.outfitIndex].width;
        
        PS.spritePlane( coronaCurrent_sprite, PLANE_STATS ); // assign plane
        PS.spriteMove( coronaCurrent_sprite, this.outfits[this.outfitIndex].x, this.outfits[this.outfitIndex].y ); // move to initial position

        //reaction sound, random
        PS.audioPlayChannel(allSFX[randomSound].noise, {loop:false});
        PS.debug("outfit index is? " + this.outfitIndex + "\n");
    },

    //draw closet page, arrows + first available outfit
    drawOutfits : function(){
        PS.debug("draw outfit called");
        corona_x = 9;
        corona_y = 10;
		corona_width = bigBase_data.width;
        corona_max = DIM - bigBase_data.width - 1; // calculate maximum corona x-position
        PS.spriteDelete(coronaCurrent_sprite);
        coronaCurrent_sprite = PS.spriteImage( bigBase_data );
        
        
        PS.spritePlane( coronaCurrent_sprite, PLANE_STATS ); // assign plane
        PS.spriteMove( coronaCurrent_sprite, corona_x, corona_y ); // move to initial position
        PS.spriteMove( arrowLeft, corona_x - 5, corona_y + 13 ); // move to initial position
        PS.spriteMove( arrowRight, corona_x + 15, corona_y + 13 ); // move to initial position
        
        PS.spriteShow(arrowLeft, true);
        PS.spriteShow(arrowRight, true);

        //assign available big + small outfits to necessary arrays along with their preferred positioning on other screens + widths
        this.outfits.unshift({sprite: bigBase_data, x: 9, y: 10, width: big_width}, {sprite: cowboy_data, x:8, y: 7, width: corona_width}, 
            {sprite: bowtie_data, x: 9, y: 9, width: bowtie_width}, {sprite: pride_data, x: 9, y: 10, width: pride_width}, {sprite: sunglasses_data, x: 6, y: 10, width: sunglasses_width},
            {sprite: mask_data, x: 9, y: 10, width: mask_width}, {sprite: crown_data, x: 9, y: 9, width: crown_width});
        this.sOutfits.unshift({sprite: coronaSmall_data, x: 9, y: 10, width: coronaSmall_width}, {sprite: sCowboy_data, x:8, y: 7, width: sCowboy_width}, 
            {sprite: sBowtie_data, x: 9, y: 9, width: sBowtie_width}, {sprite: sPride_data, x: 9, y: 10, width: sPride_width}, {sprite: sSunglasses_data, x: 6, y: 10, width: sSunglasses_width},
            {sprite: sMask_data, x: 9, y: 10, width: sMask_width}, {sprite: sCrown_data, x: 9, y: 9, width: sCrown_width});
        this.outfits.forEach(e=>PS.debug(e+"\n"));


        //draw outfit options at top
    },

   


};