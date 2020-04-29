var dress = {
    // cowboy: '',
    // cowboy_data: '',

    // bowtie:'',
    // bowtie_data:'',

    // pride: '',
    // pride_data: '',

    // bigBase: '',
    // bigBase_data: '',

    // sunglasses: '',
    // sunglasses_data: '',

     outfits: [],
     outfitIndex: 0,
    
    // big_width: 0,


    //load all outfit sprites and store data
    loadOutfits: function(){
        PS.imageLoad( "sprites/outfits/bigCorona.bmp", function ( data ) {
			// PS.debug( "big corona loaded\n" );

			bigBase_data = data; // save image data
            big_width = data.width;
            
            
            coronaCurrent_sprite = PS.spriteImage( bigBase_data );
            corona_max = DIM - data.width; // calculate maximum corona x-position
            corona_width = big_width;
            current_width = big_width;
            current_data = data;

			PS.spritePlane( coronaCurrent_sprite, PLANE_CORONA ); // assign plane
			PS.spriteMove( coronaCurrent_sprite, 9,  DIM - big_width - 3); // move to initial position
			//PS.spriteCollide(corona_sprite, coronaCollide); //define collision function for corona
            // PS.debug("beeg: " + bigBase_data + "\n");
			PS.imageLoad( "sprites/outfits/coronaBow.bmp", function ( data ) {
				// PS.debug( "bowtie loaded\n" );
				bowtie_data = data; // save image data
				bowtie_width = data.width; // save image data
                bowtie = PS.spriteImage(bowtie_data);
				
				PS.imageLoad( "sprites/outfits/coronaSunglasses.bmp", function ( data ) {
                    // PS.debug( "sunglasses loaded\n" );
					sunglasses_data = data; // save image data
                    sunglasses_width = data.width; // save image data
                    sunglasses = PS.spriteImage(sunglasses_data);
                    
					PS.imageLoad( "sprites/outfits/cowboyCorona.bmp", function ( data ) {
                        // PS.debug( "cowboy loaded\n" );
						cowboy_data = data; // save image data
                        cowboy_width = data.width; // save image data
                        cowboy = PS.spriteImage(cowboy_data);
						
						PS.imageLoad( "sprites/outfits/prideCorona.bmp", function ( data ) {
                            // PS.debug( "pride loaded\n" );
                            pride_data = data; // save image data
                            pride_width = data.width; // save image data
                            pride = PS.spriteImage(pride_data);
                           
						} );
					} );
				} );
			} );
		} );
    },

    swapSprite : function(isLeft){
        
        //this.outfitIndex = x;
        isLeft? this.outfitIndex -= 1 : this.outfitIndex += 1;
        if(this.outfitIndex < 0){
            this.outfitIndex = this.outfits.length -1;
        } 
        if(this.outfitIndex >= this.outfits.length){
            this.outfitIndex = 0;
        }

        PS.spriteDelete(coronaCurrent_sprite);
        coronaCurrent_sprite = PS.spriteImage( this.outfits[this.outfitIndex].sprite);
        current_data = this.outfits[this.outfitIndex].sprite;
        current_width = this.outfits[this.outfitIndex].width;
        
        PS.spritePlane( coronaCurrent_sprite, PLANE_CORONA ); // assign plane
        PS.spriteMove( coronaCurrent_sprite, this.outfits[this.outfitIndex].x, this.outfits[this.outfitIndex].y ); // move to initial position

        // PS.debug("outfit index is? " + this.outfitIndex + "\n");
    },

    drawOutfits : function(){
        // PS.debug("draw outfit called");
        corona_x = 9;
        corona_y = 10;
		corona_width = bigBase_data.width;
        corona_max = DIM - bigBase_data.width - 1; // calculate maximum corona x-position
        PS.spriteDelete(coronaCurrent_sprite);
        coronaCurrent_sprite = PS.spriteImage( bigBase_data );
        
        
        PS.spritePlane( coronaCurrent_sprite, PLANE_CORONA ); // assign plane
        PS.spriteMove( coronaCurrent_sprite, corona_x, corona_y ); // move to initial position
        PS.spriteMove( arrowLeft, corona_x - 5, corona_y + 13 ); // move to initial position
        PS.spriteMove( arrowRight, corona_x + 15, corona_y + 13 ); // move to initial position
        
        PS.spriteShow(arrowLeft, true);
        PS.spriteShow(arrowRight, true);

        this.outfits.unshift({sprite: bigBase_data, x: 9, y: 10, width: big_width}, {sprite: cowboy_data, x:8, y: 7, width: corona_width}, 
            {sprite: bowtie_data, x: 9, y: 9, width: bowtie_width}, {sprite: pride_data, x: 9, y: 10, width: pride_width}, {sprite: sunglasses_data, x: 6, y: 10, width: sunglasses_width});
        // this.outfits.forEach(e=>PS.debug(e+"\n"));


        //draw outfit options at top
    },

    fillBlock: function(x1, x2, y1, y2, data){
        for(var i = x1; i <=x2; i++){
            for(var j = y1; j<= y2; j++){
                PS.gridPlane(PLANE_CORONA);
                PS.color(i, j, BACKGROUND);
                PS.data(i, j, data);
            }
        }
    },


};