pc.script.create('referee', function(context) {
    var Referee = function(entity) {
        this.entity = entity;
    };

    Referee.prototype = {
        initialize: function() {
            this.ball = context.root.findByName('Ball');

            this.ball.collision.on('collisionstart', function(result) {
                console.log('collisionstart', result.other.name);
            });

            this.ball.collision.on('triggerenter', function(other) {
                console.log('triggerenter', other.name);
            });
        },

        update: function(dt) {
        }
    };

    return Referee;
});