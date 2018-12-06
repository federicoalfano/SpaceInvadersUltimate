import ParentModel from './ParentModel.js';

export default class Bullet extends ParentModel{
        constructor(name, properties){
            super(name, properties);
            this.className = 'Bullet';
        }
}