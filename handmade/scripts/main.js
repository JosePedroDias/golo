// create the app and start the update loop
var app = new pc.fw.Application( document.getElementById('pc-canvas') );
app.start();

// set the canvas to fill the window and automatically change resolution to be the same as the canvas size
app.setCanvasFillMode(pc.fw.FillMode.FILL_WINDOW);
app.setCanvasResolution(pc.fw.ResolutionMode.AUTO);

app.context.scene.ambientLight = new pc.Color(0, 0, 0);



var loadModel = function(modelName, entityName) {
    var promise = new RSVP.Promise(function(resolve, reject) {
        app.context.assets.loadFromUrl('assets/' + modelName + '.json', 'model')
        .then(function(results) {
            var entity = new pc.fw.Entity();
            entity.setName(entityName);
            app.context.systems.model.addComponent(entity, {
                type:  'asset',
                asset: results.asset
            });
            entity.rotate(0, 0, 0);
            app.context.root.addChild(entity);
            resolve(entity);
        }, function(err) {
            reject(err);
        });
    });

    return promise;
};



loadModel('ball', 'Ball')
.then(function(ballEnt) {
    ballEnt.setLocalScale(new pc.Vec3(0.05, 0.05, 0.05));
    ballEnt.setPosition(0, 0.1, 0);

    app.context.systems.collision.addComponent(ballEnt, {
        "enabled": true,
        "halfExtents": [0.5, 0.5, 0.5],
        "height": 2,
        "radius": 0.11,
        "asset": null,
        "type": "sphere",
        "axis": 1
    });

    app.context.systems.rigidbody.addComponent(ballEnt, {
        "linearDamping": 0.5,
        "enabled": true,
        "friction": 1,
        "mass": 0.45,
        "angularDamping": 0.8,
        "linearFactor": [1, 1, 1],
        "type": "dynamic",
        "angularFactor": [1, 1, 1],
        "restitution": 0
    });
    return loadModel('field', 'Field');
})
.then(function(fieldEnt) {
    console.log('ents loaded');

    app.context.systems.script.addComponent(app.context.root, {
        "enabled": true,
        "scripts": [
            // {
            //     "url": "input.js",
            //     "attributes": [],
            //     "name": "input"
            // },
            // {
            //     "url": "director.js",
            //     "attributes": [],
            //     "name": "director"
            // },
            {
                "url": "referee.js",
                "attributes": [],
                "name": "referee"
            }
        ]
    });
})
.catch(function(err) {
    console.log('ERR!' + err);
});




// create an entity with a camera component
var cam1 = new pc.fw.Entity();
cam1.setName('Cam1');
app.context.systems.camera.addComponent(cam1, {
    "priority": 0,
    "fov": 60,
    "clearDepthBuffer": true,
    "projection": 0,
    "clearColor": [0, 0, 0, 1],
    "enabled": true,
    "orthoHeight": 100,
    "farClip": 200,
    "nearClip": 0.3,
    "rect": [0, 0, 1, 1],
    "clearColorBuffer": true
});
//cam1.translate(0, 7, 24);
cam1.setPosition(4.325071811676025, 4.0127339363098145, 16.261337280273438);
cam1.setLocalEulerAngles(-29.945960998535156, 55.79564666748047, 0.000002187304289691383);
app.context.root.addChild(cam1);



// create an entity with a point light component
var light = new pc.fw.Entity();
light.setName('Light');
app.context.systems.light.addComponent(light, {
    "color": [1, 1, 1],
    "shadowResolution": 2048,
    "outerConeAngle": 45,
    "enabled": true,
    "range": 10,
    "castShadows": true,
    "intensity": 1,
    "innerConeAngle": 40,
    "type": "directional"
});
light.translate(5, 0, 15);
app.context.root.addChild(light);
