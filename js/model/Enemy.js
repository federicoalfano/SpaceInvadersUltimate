import ParentModel from './ParentModel.js';

export default class Enemy extends ParentModel {

    constructor(name, properties = {}){
        super(name, properties);
        this.className = 'Enemy';
    }
    hasMoved(){
        this.properties.movement=true;
    }
    hasBeenHit(){
        this.properties.hit=true;
    }

}

