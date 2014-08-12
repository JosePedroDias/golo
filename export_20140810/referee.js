pc.script.create('referee', function(context) {
    var Referee = function (entity) {
        this.entity = entity;
    };

    Referee.prototype = {
        initialize: function () {
        },

        update: function (dt) {
        }
    };

    return Referee;
});