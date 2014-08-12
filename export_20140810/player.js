pc.script.attribute('runSpeed',    'number', 500);//, {min:0, max:1000});
pc.script.attribute('strafeSpeed', 'number', 500);

pc.script.create('player', function(context) {
    var Player = function(entity) {
        this.entity = entity;
        
        //this.fw = pc.Vec3.FORWARD;
        //this.ri = pc.Vec3.RIGHT;
    };

    Player.prototype = {
        initialize: function() {
            this.ball = context.root.findByName('Ball');
        },
        
        
        
        moveForward: function(dt) {
            var p = this.entity.getPosition();
            p.z -= dt * this.runSpeed;
            this.entity.setPosition(p);
        },
        
        moveBackward: function(dt) {
            var p = this.entity.getPosition();
            p.z += dt * this.runSpeed * 0.75;
            this.entity.setPosition(p);
        },
        
        
        
        strafeRight: function(dt) {
            var p = this.entity.getPosition();
            p.x += dt * this.strafeSpeed;
            this.entity.setPosition(p);
        },
        
        strafeLeft: function(dt) {
            var p = this.entity.getPosition();
            p.x -= dt * this.strafeSpeed;
            this.entity.setPosition(p);
        },
        
        
        
        
        /*moveForward: function(dt) {
            var f = this.fw.clone().scale( dt * this.runSpeed );
            this.entity.rigidbody.applyImpulse(f);
        },
        
        moveBackward: function(dt) {
            var f = this.fw.clone().scale( -dt * this.runSpeed* 0.75 );
            this.entity.rigidbody.applyImpulse(f);
        },
        
        
        
        strafeRight: function(dt) {
            var f = this.ri.clone().scale( dt * this.strafeSpeed );
            this.entity.rigidbody.applyImpulse(f);
        },
        
        strafeLeft: function(dt) {
            var f = this.ri.clone().scale( -dt * this.strafeSpeed );
            this.entity.rigidbody.applyImpulse(f);
        },*/
        
        
        
        shoot: function(dt) {
            if (dt > 1) { dt = 1; }
            var f = this.ball.getPosition().clone().sub( this.entity.getPosition() );
            if (f.length() > 1.3) { return; } // 0.8 + 0.5
            f.normalize();
            f.y = 0.25;
            f.normalize();
            f = f.scale( dt * 20 );
            this.ball.rigidbody.applyImpulse(f);
        },
        
        
        
        update: function(dt) {
        }
    };

    return Player;
});