pc.script.create('input', function(context) {
    var Input = function(entity) {
        this.entity = entity;
    };

    Input.prototype = {
        initialize: function() {
            this.player = context.root.findByName('Player');
            this.ball   = context.root.findByName('Ball');
            
            this.initialPlayerPos = this.player.getPosition().clone();
            this.initialBallPos   = this.ball.getPosition().clone();
            
            this.ps = this.player.script.player;
            this.spaceDownT = 0;
        },
        
        resetEntity: function(ent, pos) {
            var rb = ent.rigidbody;
            ent.setPosition(pos.x, pos.y, pos.z);
            rb.syncEntityToBody();
            rb.linearVelocity.set(0, 0, 0);
            rb.angularVelocity.set(0, 0, 0);
        },

        update: function(dt) { 
            var k = context.keyboard;
            var i = pc.input;
            
            
            
            // PLAYER
            
            if (k.isPressed( i.KEY_W )) {
                this.ps.moveForward(dt);
            }
            if (k.isPressed( i.KEY_S )) {
                this.ps.moveBackward(dt);
            }
            
            if (k.isPressed( i.KEY_D )) {
                this.ps.strafeRight(dt);
            }
            if (k.isPressed( i.KEY_A )) {
                this.ps.strafeLeft(dt);
            }
            
            if (k.wasPressed( i.KEY_SPACE )) {
                this.spaceDownT = new Date().valueOf();
            }
            else if (k.wasReleased( i.KEY_SPACE )) {
                var pwr = new Date().valueOf() - this.spaceDownT;
                //console.log('SPACE', pwr);
                this.ps.shoot( pwr * 0.001 );
            }
            
            
            
            // STATE
            
            if (k.wasPressed( i.KEY_R )) {
                this.resetEntity(this.player, this.initialPlayerPos);
                this.resetEntity(this.ball,   this.initialBallPos);
            }
        }
    };

    return Input;
});