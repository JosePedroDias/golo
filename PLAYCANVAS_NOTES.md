# export format

assets such as image files and meshes get exported to json files in the file system, under
`assets/<userName>/<projectName>/<prefix>/<assetGuid>/<assetName>.json/jpg/png`

script files you created get exported to their own names in the file system.

the hierarchy of entities/components/properties gets exported via `data.js`:

* Its 1st line defines the hierarchy to local var `content`
* The 2nd line states: `pc.content = new pc.fw.ContentFile(content);`

this content structure features everything you defined in the playcanvas editor.

the script files used by the engine get exported to `code.playcanvas.com` dir (pc itself and ammo.js)

`bootstrap.js` glues everything together:

* a progress widget is defined
* errors are intercepted to a visual console
* window frame communication is set up (for synching changes I presume)



# from declarative content JSON to explicit stuff

Getting rid of the content JSON data is paramount if you want to code without the PC web editor.
Follow the code from the [load model demo](http://playcanvas.github.io/#load_model/index.html)

How do you convert your assets you ask?

First open `data.js` and prettify the content JSON to an auxiliary file (we'll call it `content.json` but this will be useless at the end of the process)

You'll also need an auxiliary mapping of editor guids and human-understandable asset names.

Move all assets out of the `<prefix>/<assetGuid>` directories.
If you try to open an asset such as a model via `pc.fw.Application.context.assets.loadFromUrl` as the example shows,
you'll see in the dev tools PC requests an additional mapping file.

So if you had an asset named `ball.json` with guid `abc` and request loading `ball.json`, PC will also look for `ball.mapping.json`.
You need to create this file with the following structure:

```javascript
{"mapping": [
    {"path": "ball\_black\_mat.json"},
    {"path": "ball\_white\_mat.json"}
]}
```

The thing is, materials are defined under the content JSON we've mentioned above but aren't persisted to individual files.
What we must do for each asset is look for its definition on `content.json`

```javascript
"abc": {
    "name": "ball",
    ...
    "file": {
        ...
        "filename": "ball.json"
    },
    "type": "model",
    "data": {
        "mapping": [
            {"material": "qweqwe"},
            {"material": "asdasd"}
        ]
    }
}
```

Those material guids must be sought and persisted to individual files with suggestive names.

Notice that PC editor wraps object data into an internal structure useless to us, so, if you look for material `qweqwe`:

```javascript
"qweqwe": {
    "name": "my material",
    "resource_id": "qweqwe",
    "has_thumbnail": false,
    "file": null,
    "type": "material",
    "data": {
        "name": "my material",
        "parameters": [
            {
                "data": [0.5,0.5,0.5],
                "type": "vec3",
                "name": "ambient"
            },
            ...
            {
                "type": "float",
                "data": 3,
                "name": "blendType"
            }
        ],
        "shader": "phong"
    }
}
```

From the above data, you only need to persist the contents of the data property:

```javascript
{
    "name": "my material",
    "parameters": [
        {
            "data": [0.5,0.5,0.5],
            "type": "vec3",
            "name": "ambient"
        },
        ...
        {
            "type": "float",
            "data": 3,
            "name": "blendType"
        }
    ],
    "shader": "phong"
}
```

Once all these files are created, update the mapping file keeping the order coherent with `content.json`.

So one thing remains. How do we reference textures?

In `content.json` textures reference other guids.
If you fetch those you'll find info mostly of use by the editor.

What we must do is edit the material we've persisted, replacing the guid

```javascript
{
    "type": "texture",
    "data": "zxczxc",
    "name": "diffuseMap"
}
```

for the file path

```javascript
{
    "type": "texture",
    "data": "grass.jpg",
    "name": "diffuseMap"
}
```

For this to work we must add an attribute to the material:
`"mapping_format": "path"`



# recreating entities and their components (content.json to JS calls)

name     -> `ent.setName(name)`
position -> `ent.setPosition(x, y, z)`
rotation -> `ent.setLocalEulerAngles(degX, degY, degZ)`
scale    -> `ent.setLocalScale( new pc.Vec3(sX, sY, sZ) )`

`application.context.systems.collision.addComponent(ent, {options})`
// works with other components. replace collision with: rigidbody, camera, light...

`application.context.root.addChild(ent)` // or other parent entity...
