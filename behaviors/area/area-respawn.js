'use strict';

const { Logger } = require('ranvier');
const { Random } = require('rando-js');
const _ = require('lodash');

/**
 * Behavior for spawning mobs in an area without hardcoding specific spawn points.
 * 
 * Example of area's manifest.yml to enable
 *  title: Northern Reach
 *  behaviors:
 *    area-respawn:
        spawner: true
        scaleMobLevelOnAxis: y
        flipScale: false
        mobLevels: [0,30] 
        mobToRoomRatio: 0.35
        sourceNpcsFromAreas: ["area1","otherarea"] 

 */
module.exports = {
  listeners: {
    updateTick: state => {
      let lastRespawnTick = Date.now();
      return function (config) {

        const numNpcs = this.npcs.size;
        const numRooms = this.rooms.size;

       
        //if enabled
        if (config.spawner) {

          //if area is below mobToRoomRatio (set in area manifest.yml)
          if ( ( numNpcs / numRooms ) < config.mobToRoomRatio ) {

            for (let i = 1;i<(numRooms / 1000);i++) {

              //pull npc defs from a different area, or default to this one
              let areas = config.sourceNpcsFromAreas || [this.name];

              //choose a random room in this area
              let key = _getRandomKey(this.rooms);
              let room = this.rooms.get(key);

              //build an array of npc definitions from these areas
              let npcs = [];
              for (const [key,value] of state.MobFactory.entities) {
                areas.forEach(function(area){
                  if (key.indexOf(area) > -1){
                    npcs.push(value);
                  }
                });
              }

              //determines whether to scale on the x axis or y
              var scaleMobLevelOnAxis = config.scaleMobLevelOnAxis;

              //since the rooms of an area are fed into a map, they are in order, however, when using procedurally generated areas, there may be gaps in the coordinates. So in order to calculate what the appropriate level range of a mob should be for any particular room, we are going to use the rows instead of the coordinate values.

              //lets calculate number of rows in the area
              if (scaleMobLevelOnAxis){
                  let rows = [];

                  //store them in area metadata
                  if (!this.metadata.rows) {
                    this.rooms.forEach(function(room){
                      if (!rows.includes(room.coordinates[scaleMobLevelOnAxis])){
                        rows.push(room.coordinates[scaleMobLevelOnAxis]);
                      }
                    });

                    rows.sort(function(a, b) {
                      return a - b;
                    });

                    this.metadata.numOfRows = rows.length;
                    this.metadata.rows = rows;
                  }


                  //find out where this room is in the series of rows
                  let roomRow = this.metadata.rows.findIndex(function(row){
                      return room.coordinates[scaleMobLevelOnAxis] == row;
                  });

                  //calculate percent of distance from start, apply config.flipScale to reverse
                  let percentMultiplier = config.flipScale ? (this.metadata.numOfRows - roomRow) / this.metadata.numOfRows : roomRow / this.metadata.numOfRows;

                  let [min,max] = config.mobLevels;

                  //no dividing by 0
                  if (min === 0)
                    min = min + 1;

                  //fit row distance within min,max level bounds
                  let level = (((max-min) * percentMultiplier) + min);
                  

                  //get npcs + or - 15% of fitted level, +1, -2 for lower level ranges with less relative range via percent
                  let lowerBound = Math.round(level * 0.85 -2);
                  let upperBound = Math.round(level * 1.15 +1);
                  let levelNpcs = npcs.filter(function(npc){
                    if (npc.level >= lowerBound){
                      if (npc.level <= upperBound){
                        return true;
                      }
                    }
                  });

                  npcs = levelNpcs;

              }

              //randomly choose one and turn it into an object
              let npc = _.sample(npcs);
              if (typeof npc === 'string') {
                npc = { id: npc };
              }
              npc = Object.assign({
                respawnChance: 100,
                maxLoad: 1,
                replaceOnRespawn: false
              }, npc);

              //have the room spawn it or throw an error
              if (Random.probability(npc.respawnChance)) {
                try {
                  room.spawnNpc(state, npc.entityReference);
                } catch (err) {
                  Logger.error(err.message);
                }
              }
            }
          }
        }
      };

    function _getRandomKey(collection) {
      let index = Math.floor(Math.random() * collection.size);
      let cntr = 0;
      for (let key of collection.keys()) {
          if (cntr++ === index) {
              return key;
      }
    }
}

    }
  }
};
                  