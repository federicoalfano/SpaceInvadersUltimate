import ParentModel from './ParentModel.js';
import Globals from '../globals/Globals.js';
export default class Star extends ParentModel {
    constructor(name, properties = {}){
        super(name, Globals.instance.firstStarProperties);
        this.className='Star';
    }
    changeColor(color){
        this.emit('changeStarColor',{color});
    }
    changeSpeed(speed){
        this.emit('changeStarSpeed',{speed});
    }
    stop(){
        this.emit('starStop',{});
    }
    move(){
        this.emit('move',{});
    }
}


