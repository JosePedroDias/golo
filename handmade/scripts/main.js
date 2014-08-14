var canvas = document.getElementById('pc-canvas');
var app = new pc.fw.Application( canvas );
app.start();



app.setCanvasFillMode(pc.fw.FillMode.FILL_WINDOW);
app.setCanvasResolution(pc.fw.ResolutionMode.AUTO);
app.context.scene.ambientLight = new pc.Color(0, 0, 0);
app.context.keyboard = new pc.input.Keyboard(window);



var loadMaterial = function(materialName) {
    var promise = new RSVP.Promise(function(resolve, reject) {
        app.context.assets.loadFromUrl('assets/' + materialName + '.json', 'material')
        .then(function(results) {
            resolve(results.asset.resource);
        }, function(err) {
            reject(err);
        });
    });

    return promise;
};



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



var createRigidCylinder = function(sX, sY, sZ) { // 0.25, 7.32, 0.25
    var ent = new pc.fw.Entity();

    ent.setLocalScale( new pc.Vec3(sX, sY, sZ) );

    setTimeout(function() { // these must be computed once all transformations and graph hierarchies set up
        app.context.systems.collision.addComponent(ent, {
            "type": "cylinder",
            "height": sY,
            "radius": sX/2,
            "axis": 1
        });

        app.context.systems.rigidbody.addComponent(ent, {
            "type": "static",
            "linearDamping": 0,
            "angularDamping": 0,
            "mass": 1,
            "linearFactor": [1, 1, 1],
            "angularFactor": [1, 1, 1],
            "friction": 0.5,
            "restitution": 0.75
        });
    }, 0);

    app.context.systems.model.addComponent(ent, {
        "type": "cylinder",
        "receiveShadows": true,
        "castShadows": true
    });

    return ent;
};



var createRigidBox = function(sX, sY, sZ) {
    var ent = new pc.fw.Entity();

    ent.setLocalScale( new pc.Vec3(sX, sY, sZ) );

    setTimeout(function() { // these must be computed once all transformations and graph hierarchies set up
        app.context.systems.collision.addComponent(ent, {
            "type": "box",
            "halfExtents": [sX/2, sY/2, sZ/2]
        });

        app.context.systems.rigidbody.addComponent(ent, {
            "type": "static",
            "linearDamping": 0,
            "angularDamping": 0,
            "mass": 1,
            "linearFactor": [1, 1, 1],
            "angularFactor": [1, 1, 1],
            "friction": 0.5,
            "restitution": 0.75
        });
    }, 0);

    app.context.systems.model.addComponent(ent, {
        "type": "box",
        "receiveShadows": true,
        "castShadows": true
    });

    return ent;
};



var goalNetMat;
var goalPostMat;



var createGoal = function() {
    var goal = new pc.fw.Entity();
    goal.setName('Goal');

    var topBar = createRigidCylinder(0.25, 7.32, 0.25);
    topBar.setName('TopBar');
    topBar.setPosition(0, 2.44, 0);
    topBar.setLocalEulerAngles(0, 0, 90);
    topBar.model.material = goalPostMat;
    goal.addChild(topBar);

    var leftBar = createRigidCylinder(0.25, 2.44, 0.25);
    leftBar.setName('LeftBar');
    leftBar.setPosition(-3.66, 1.22, 0);
    leftBar.model.material = goalPostMat;
    goal.addChild(leftBar);

    var rightBar = createRigidCylinder(0.25, 2.44, 0.25);
    rightBar.setName('RightBar');
    rightBar.setPosition(3.66, 1.22, 0);
    rightBar.model.material = goalPostMat;
    goal.addChild(rightBar);

    var topNet = createRigidBox(7.32, 0.2, 1);
    topNet.setName('TopNet');
    topNet.setPosition(0, 2.44, -0.5);
    topNet.model.material = goalNetMat;
    goal.addChild(topNet);

    var leftNet = createRigidBox(0.2, 2.44, 1);
    leftNet.setName('LeftNet');
    leftNet.setPosition(-3.66, 1.22, -0.5);
    leftNet.model.material = goalNetMat;
    goal.addChild(leftNet);

    var rightNet = createRigidBox(0.2, 2.44, 1);
    rightNet.setName('RightNet');
    rightNet.setPosition(3.66, 1.22, -0.5);
    rightNet.model.material = goalNetMat;
    goal.addChild(rightNet);

    var backNet = createRigidBox(7.32, 2.44, 0.2);
    backNet.setName('BackNet');
    backNet.setPosition(0, 1.22, -1);
    backNet.model.material = goalNetMat;
    goal.addChild(backNet);

    return goal;
};



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
app.context.root.addChild(cam1);



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
    "type": "box",
    "halfExtents": [35, 0.5, 55]
});

app.context.systems.rigidbody.addComponent(fieldGround, {
    "type": "static",
    "linearDamping": 0,
    "angularDamping": 0,
    "mass": 1,
    "linearFactor": [1, 1, 1],
    "angularFactor": [1, 1, 1],
    "friction": 0.75,
    "restitution": 0
});

app.context.root.addChild(fieldGround);



var player = new pc.fw.Entity();
window.p = player;
player.setName('Player');
player.setPosition(0, 0.9, 2);
player.setLocalScale( new pc.Vec3(0.8, 1.8, 0.8) );

app.context.systems.rigidbody.addComponent(player, {
    "type": "kinematic",
    "linearDamping": 0,
    "angularDamping": 0,
    "mass": 90,
    "linearFactor": [1, 0, 1],
    "angularFactor": [0, 0, 0],
    "friction": 0.5,
    "restitution": 0
});

app.context.systems.collision.addComponent(player, {
    "type": "cylinder",
    "axis": 1,
    "height": 2,
    "radius": 0.4
});

app.context.systems.model.addComponent(player, {
    "type": "cylinder",
    "receiveShadows": true,
    "castShadows": true
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

app.context.root.addChild(player);



loadModel('ball', 'Ball')
.then(function(ball) {
    ball.setLocalScale(new pc.Vec3(0.05, 0.05, 0.05));
    ball.setPosition(0, 0.1, 0);

    ball.model.castShadows = true;

    app.context.systems.collision.addComponent(ball, {
        "type": "sphere",
        "radius": 0.11
    });

    app.context.systems.rigidbody.addComponent(ball, {
        "type": "dynamic",
        "linearDamping": 0.5,
        "friction": 1,
        "mass": 0.45,
        "angularDamping": 0.8,
        "linearFactor": [1, 1, 1],
        "angularFactor": [1, 1, 1],
        "restitution": 0
    });

    return loadModel('field', 'Field');
})
.then(function(field) {
    return loadModel('beacon', 'Beacon', player);
})
.then(function(beacon) {
    beacon.translate(0, -0.45, 0);
    
    return loadMaterial('goal_net_mat');
})
.then(function(netMat) {
    goalNetMat = netMat;
    return loadMaterial('goal_post_mat');
})
.then(function(postMat) {
    goalPostMat = postMat;

    return loadMaterial('player_mat');
})
.then(function(playerMat) {
    window.pm = playerMat;
    player.model.material = playerMat;



    var goal = createGoal();
    goal.setPosition(0, 0, -50);
    app.context.root.addChild(goal);

    goal = createGoal();
    goal.setPosition(0, 0, 50);
    goal.setLocalEulerAngles(0, 180, 0);
    app.context.root.addChild(goal);



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

    console.log('ALL DONE');
})
.catch(function(err) {
    console.log('ERR!' + err);
});



//var whiteMat app.context.root.findByName('Ball').model.data.model.meshInstances[1].material



/*var mat = new pc.scene.PhongMaterial();
mat.ambient.set(0, 0, 0);
mat.diffuse.set(0, 0, 0);
mat.emissive.set(0.5, 1, 0.2);
mat.shininess = 0;
mat.opacity = 0.5;
mat.blendType = 2;
mat.update();
//window.m = mat;
player.model.material = mat;*/
