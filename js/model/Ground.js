import ParentModel from './ParentModel.js';

export default class Ground extends ParentModel{
        constructor(name, properties = {}){
            super(name, properties);
            this.className = 'Ground';
            
        }

        
}
