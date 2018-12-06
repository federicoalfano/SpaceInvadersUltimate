import Storm from './Storm.js';
import Globals from '../globals/Globals.js';
export default class TwoPointStorm extends Storm {       
    constructor(name){
        super(name, Globals.instance.firstTpsProperties);
        this.className = 'TwoPointStorm';
    }
    tryAddEnemytoScene(enemy){
        this.emit('tryAdd', {enemy});
    }
    changedProperty(propName){
        this.emit('propertyChanged', {propName});
    }
}

