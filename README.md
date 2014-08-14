# videos

screencasts so far:

1. [taming playcanvas               ](https://www.youtube.com/watch?v=BVQba4VGNsA)
1. [football game prototype - part 2](https://www.youtube.com/watch?v=VHecVoHl7ec)
1. [football game prototype - part 3](https://www.youtube.com/watch?v=jXmTCGL03mc)



# demos

* [ongoing prototype](http://josepedrodias.github.io/golo/handmade/index.html)
* [older version crafted with the PC web editor](http://josepedrodias.github.io/golo/export_20140810/index.html)

The demo uses keys WSAD to move, space to shoot.  
Shooting works only at close distance from ball and there's no feedback whatsoever apart from the ball getting the impulse.



# directory structure


* **handmade** latest version

* **export_20140810** holds the PlayCanvas exports from the web editor (for historic purposes)

I've [collected some notes](PLAYCANVAS_NOTES.md) on how to convert exported assets so they can be imperatively loaded



# TODOs

* add trigger volumes for goals and field bounds
* make referee infer if goal is scored or side/endline trespassing
* ease camera movement
* buffer keyboard keys to add some movement ramp (instead of 0/1)
* add mouse/gamepad support for improved playability
* test importing player animations
* model goal and import it
* generate and trigger sound fx to ball collisions (against player, post, grass)
* alternate camera setups
* design versatile player mesh (textured equipment, couple of hair styles, etc)
* design multiplayer capabilities
	* centralized fixed server
	* player closest to ball?
* support AI players
* import portuguese league teams
