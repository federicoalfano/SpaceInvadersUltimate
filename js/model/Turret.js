import ParentModel from './ParentModel.js';

export default class Turret extends ParentModel{
        
        constructor(name, properties={}){
            super(name, properties);
            this.className = 'Turret';
            this.mouse_moved;
            this.bullets = [];
            this.mouse = {};
            
        }
        addBullet(bullet){
            this.bullets.push(bullet);
            this.emit('bulletAdded', {bullet});
        }
        
        removeBullet(){
            let bullet = this.bullets.shift();
            this.emit('bulletRemoved', {bullet});
        }
        shoot(){
            
            this.emit('mouseDown', {});
        }
        rest(){
            this.emit('mouseUp', {});
        }
        mouseMoving(mouse){
            this.mouse = mouse;
            this.emit('mouseMoved', {});
        }
}


