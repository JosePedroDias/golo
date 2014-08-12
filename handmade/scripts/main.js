// create the app and start the update loop
var app = new pc.fw.Application( document.getElementById('pc-canvas') );
app.start();

// set the canvas to fill the window and automatically change resolution to be the same as the canvas size
app.setCanvasFillMode(pc.fw.FillMode.FILL_WINDOW);
app.setCanvasResolution(pc.fw.ResolutionMode.AUTO);

app.context.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);



// load model from assets
var entity;
var url = 'assets/ball.json';
// var url = 'assets/beacon.json';
// var url = 'assets/field.json';
app.context.assets.loadFromUrl(url, 'model')
.then(function(results) {
    entity = new pc.fw.Entity();
    app.context.systems.model.addComponent(entity, {
        type:  'asset',
        asset: results.asset
    });
    entity.rotate(0, 0, 0);
    app.context.root.addChild(entity);
});



// create an entity with a camera component
var camera = new pc.fw.Entity();
app.context.systems.camera.addComponent(camera, {
    clearColor: new pc.Color(0.4, 0.45, 0.5)
});
camera.translate(0, 7, 24);
app.context.root.addChild(camera);



// create an entity with a point light component
var light = new pc.fw.Entity();
app.context.systems.light.addComponent(light, {
    type:  'point',
    color: new pc.Color(1, 1, 1),
    range: 100
});
light.translate(5, 0, 15);
app.context.root.addChild(light);



app.on('update', function(dt) {
    if (entity) {
        entity.rotate(0, 10*dt, 0);
    }
});
