import Globals from '../globals/Globals.js';
export default class StarController {
    constructor(element) {
        this.element = element;
    }
    onchangeStarColor(e){
        this.element.properties.lightcolor=e.color;
        this.element.properties.colorChanged=true;
    }
    onchangeStarSpeed(e){
        this.element.properties.speed=e.speed;
    }
    onStarStop(){
        this.element.properties.stop=!this.element.properties.stop;
    }
    onOrbitAnimation(){
        this.element.properties.OrbitAngle= (this.element.properties.OrbitAngle-this.element.properties.speed)%360;
        let radians = this.element.properties.OrbitAngle * Math.PI / 180;
        this.element.properties.Movements.x=Math.cos(radians) * this.element.properties.OrbitRadius;
        this.element.properties.Movements.z=Math.sin(radians) * this.element.properties.OrbitRadius;
        this.element.properties.Movements.y= (this.element.properties.Movements.y-this.element.properties.RotateSpeed)%360;
        
    }
}