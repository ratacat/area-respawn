## Installation
Add the bundle to /bundles, add to ranvier.json, and then set the behavior in any area's manifest.yml. 

## in the area's manifest.yml

```
title: Northern Reach
behaviors:
  area-respawn:
    spawner: true
    scaleMobLevelOnAxis: y
    scaleMobLevel: [0,30] 
    mobToRoomRatio: 0.35
    sourceNpcsFromArea: "" 
 ```
 
 spawner boolean  true or false, enable or disable entire behavior for this area
 *scaleMobLevelOnAxis  true or false, *not currently working*
 *scaleMobLevel  Array, *not currently working*
 mobToRoomRatio:  0.35, uses the number of rooms in the area to determine the amount of mobs to keep spawned
 sourceNpcsFromArea: "", leave blank to use all npc definitions from same area, or enter an area's name as a string to source npcs from there instead.
