var prom = {

    loadShit: function(){
        //promises promises


    },

    loadOne: function(){
        return new Promise((resolve, reject)=>{
            PS.imageLoad( "sprites/arrowRight.gif", function ( data ) {
                resolve(data);
        })});
    },

    assignData: function(){
        arrowRight_data = data; // save image data
        arrowRight = PS.spriteImage( arrowRight_data );
    }

    /**const promise1 = Promise.resolve(3);
        const promise2 = 42;
        const promise3 = new Promise(function(resolve, reject) {
        setTimeout(resolve, 100, 'foo');
        });

        Promise.all([promise1, promise2, promise3]).then(function(values) {
        console.log(values);
        });
        // expected output: Array [3, 42, "foo"]
    */

    /**
     * function loadthing(){
     * retunr new promise((resolve, reject)=> {ps.audioload(thing, {
     * lock:true, onLoad: function(data){
     * retunr resolve(data)}});
     * }}
     * 
     * promise.all([load1(), load2()...]).then(data=>{
     * channel1 = data[0].channel;
     * channel2 = data[2],channel
     * })
     * 
     * 
     * 
     */


};