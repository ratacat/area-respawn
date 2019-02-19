## Installation
Add the bundle to /bundles, add to ranvier.json, and then set the behavior in any area's manifest.yml. 

## in the area's manifest.yml

```
title: Northern Reach
behaviors:
  area-respawn:
    spawner: true
    scaleMobLevelOnAxis: y
    flipScale: false
    mobLevels: [0,30] 
    mobToRoomRatio: 0.35
    sourceNpcsFromAreas: ["area1","otherarea"] 
 ```
 
 _spawner_ (boolean) - enable or disable entire behavior for this area
 
 _scaleMobLevelOnAxis_ (string) - use x or y. Sets the axis to scale difficulty of mob spawns along.
 
 _flipScale_ (boolean) - by default, lower coordinates on the axis correspond to lower mob levels, set this to true to cause the reverse.
 
 _mobLevels_ (array) - takes an array of two values, the first is the minimap, and 2nd is max. These values get blended a bit ~15% each direction in the code, so it's not a hard boundary.
 
 _mobToRoomRatio_ (float) - uses the number of rooms in the area to determine the amount of mobs to keep spawned
 
 _sourceNpcsFromAreas_ (array) - which areas to source mobs from, has no default


    
