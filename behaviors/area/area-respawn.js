'use strict';

const { Logger } = require('ranvier');
const { Random } = require('rando-js');
const _ = require('lodash');

/**
 * Behavior for having a constant respawn tick happening every [interval]
 * seconds. As opposed to one giant full area respawn every 10 minutes this will
 * constantly try to respawn an entity (item/npc) in an area's rooms based on
 * the entity's respawn chance until it hits the entity's maxLoad for the room.
 *
 * config:
 *   interval: number=30
 *.  spawner
          scaleMobLevelOnAxis boolean (pick an axis[x,y,z] to scale mob level upon
          scaleMobLevel array (level range for spawning mobs)
          mobToRoomRatio float (greater then 0)
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
              let area = config.sourceNpcsFromArea || this.name;

              //choose a random room in this area
              let key = _getRandomKey(this.rooms);
              let room = this.rooms.get(key);

              //build an array of npc definitions from this area
              let npcs = [];
              for (const [key,value] of state.MobFactory.entities) {
                if (key.indexOf(area) > -1){
                  npcs.push(value);
                }
              }

              //randomy choose one and turn it into an object
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

