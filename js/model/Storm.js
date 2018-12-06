import ParentModel from './ParentModel.js';
import Globals from '../globals/Globals.js';
export default class Storm extends ParentModel {

    constructor(name, properties = {}){
        if (Object.values(properties).length === 0) {
            super(name, Globals.instance.firstStormProperties);
        } else {
            super(name, properties);
        }
        this.className = 'Storm'
        this.enemies = [];
    }

    addEnemy(enemy) {
        this.enemies.push(enemy);
        this.emit('EnemyAdded', {enemy});
    }
    getIntersection(raycaster){
        this.emit('EnemyIntersections', {raycaster});
    }
    turretOverHeated(){
        this.emit('TurretOverHeated', {});
    }
    initGUI(){
        this.emit('GUIInit', {});
    }
    removeGUI(){
        this.emit('GUIRemoved', {});
    }
    buildStorm(){
        this.emit('buildStorm', {}); 
    }
    enemyHit(value){
        this.emit('EnemyHit', {value}); 
    }
    playGame(){
        this.emit('play', {});
    }
    reset(scoreReset){
        this.emit('reset', {score:scoreReset});
    }
    start_pause(){
        this.emit('start', {});
    }
    updateStormColors(){
        this.emit('EnemyColorChanged', {});
    }
    removeEnemy(enemy){
        const index = this.enemies.indexOf(enemy);
        if (index !== -1) {
            this.enemies.splice(index, 1);
            this.emit('EnemyRemoved', { enemy });
}
    }
}