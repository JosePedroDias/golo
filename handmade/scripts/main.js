// create the app and start the update loop
var canvas = document.getElementById('pc-canvas');
var app = new pc.fw.Application( canvas );
app.start();

// set the canvas to fill the window and automatically change resolution to be the same as the canvas size
app.setCanvasFillMode(pc.fw.FillMode.FILL_WINDOW);
app.setCanvasResolution(pc.fw.ResolutionMode.AUTO);

app.context.scene.ambientLight = new pc.Color(0, 0, 0);

app.context.keyboard = new pc.input.Keyboard(window);



var loadModel = function(modelName, entityOrEntityName, parentEntity) {
    var promise = new RSVP.Promise(function(resolve, reject) {
        app.context.assets.loadFromUrl('assets/' + modelName + '.json', 'model')
        .then(function(results) {
            var entity;

            if (typeof entityOrEntityName === 'string') {
                entity = new pc.fw.Entity();
                entity.setName(entityOrEntityName);
            }
            else {
                entity = entityOrEntityName;
            }

            app.context.systems.model.addComponent(entity, {
                type:  'asset',
                asset: results.asset
            });

            if (parentEntity === false) {
            }
            else {
                if (parentEntity === undefined) {
                    parentEntity = app.context.root;
                }
                parentEntity.addChild(entity);
            }

            resolve(entity);
        }, function(err) {
            reject(err);
        });
    });

    return promise;
};



loadModel('ball', 'Ball')
.then(function(ball) {
    ball.setLocalScale(new pc.Vec3(0.05, 0.05, 0.05));
    ball.setPosition(0, 0.1, 0);

    ball.model.castShadows = true;

    app.context.systems.collision.addComponent(ball, {
        "halfExtents": [0.5, 0.5, 0.5],
        "height": 2,
        "radius": 0.11,
        "asset": null,
        "type": "sphere",
        "axis": 1
    });

    app.context.systems.rigidbody.addComponent(ball, {
        "linearDamping": 0.5,
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
.then(function(field) {
    console.log('ents loaded');

    app.context.systems.script.addComponent(app.context.root, {
        "scripts": [
            {
                "url": "input.js",
                "attributes": [],
                "name": "input"
            },
            {
                "url": "director.js",
                "attributes": [],
                "name": "director"
            },
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
    "orthoHeight": 100,
    "farClip": 200,
    "nearClip": 0.3,
    "rect": [0, 0, 1, 1],
    "clearColorBuffer": true
});
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
    "range": 10,
    "castShadows": true,
    "intensity": 1,
    "innerConeAngle": 40,
    "type": "directional"
});
light.setPosition(0, 10, 0);
light.setLocalEulerAngles(25, -43, -4);
app.context.root.addChild(light);



var fieldGround = new pc.fw.Entity();
fieldGround.setName('FieldGround');
fieldGround.setPosition(0, -0.5, 0);

app.context.systems.collision.addComponent(fieldGround, {
    "halfExtents": [35, 0.5, 55],
    "height": 2,
    "radius": 0.5,
    "asset": null,
    "type": "box",
    "axis": 1
});

app.context.systems.rigidbody.addComponent(fieldGround, {
    "linearDamping": 0,
    "friction": 0.75,
    "mass": 1,
    "angularDamping": 0,
    "linearFactor": [1, 1, 1],
    "type": "static",
    "angularFactor": [1, 1, 1],
    "restitution": 0
});

app.context.root.addChild(fieldGround);


var player = new pc.fw.Entity();
window.p = player;
player.setName('Player');
player.setPosition(0, 0.9, 2);
player.setLocalScale( new pc.Vec3(0.8, 1.8, 0.8) );

app.context.systems.rigidbody.addComponent(player, {
    "linearDamping": 0,
    "friction": 0.5,
    "mass": 90,
    "angularDamping": 0,
    "linearFactor": [1, 0, 1],
    "type": "kinematic",
    "angularFactor": [0, 0, 0],
    "restitution": 0
});

app.context.systems.collision.addComponent(player, {
    "halfExtents": [0.75, 1.5, 0.75],
    "height": 2,
    "radius": 0.4,
    "asset": null,
    "type": "cylinder",
    "axis": 1
});

app.context.systems.model.addComponent(player, {
    // "materialAsset": "03715888-1e8d-11e4-b615-22000a4a0339",
    "receiveShadows": true,
    "castShadows": true,
    "asset": null,
    "type": "cylinder"
});

app.context.systems.script.addComponent(player, {
    "scripts": [
        {
            "url": "player.js",
            "attributes": [
                {
                    "displayName": "runSpeed",
                    "name": "runSpeed",
                    "defaultValue": 500,
                    "value": 6,
                    "type": "number",
                    "options": {}
                },
                {
                    "displayName": "strafeSpeed",
                    "name": "strafeSpeed",
                    "defaultValue": 500,
                    "value": 4,
                    "type": "number",
                    "options": {}
                }
            ],
            "name": "player"
        }
    ]
});

var mat = new pc.scene.PhongMaterial();
mat.ambient.set(0, 0, 0);
mat.diffuse.set(0, 0, 0);
mat.emissive.set(0.5, 1, 0.2);
mat.shininess = 0;
mat.opacity = 0.5;
mat.blendType = 2;
mat.update();
window.m = mat;
player.model.material = mat;

app.context.root.addChild(player);



var beacon = new pc.fw.Entity();
beacon.setName('Beacon');
beacon.setPosition(0, -0.45, 0);
loadModel('beacon', beacon, player);



// setTimeout(function() {
//     app.start();
// }, 2000);