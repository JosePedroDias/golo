pc.script.create('director', function(context) {
    var Director = function(entity) {
        this.entity = entity;
        
        this.distance =  4;
        this.height   =  4;
    };

    Director.prototype = {
        initialize: function() {
            this.player = context.root.findByName('Player');
            
            this.cam1 = context.root.findByName('Cam1');
            this.cam2 = context.root.findByName('Cam2');
        },

        update: function(dt) {
            var c = this.cam1;
            var p = this.player;
            var pp = p.getPosition().clone();
            var pp2 = p.getPosition();
            
            pp.add( pc.Vec3.UP.clone().scale( this.height ) );
            pp.add( p.forward.clone().scale( -this.distance ) );
            c.setPosition( pp );
            c.lookAt( pp2 );
        }
    };

    return Director;
});