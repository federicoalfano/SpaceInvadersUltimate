import ViewMediator from './ViewMediator.js';
import Globals from '../../globals/Globals.js';
export default class GroundMediator extends ViewMediator {

    constructor(element, mediatorFactory) {
        super(element, mediatorFactory);



    }

    makeObject3D() {

        //this.object3D = Loader.instance.get(this.element.name);
        
        
        let container = Globals.instance.loaded_objects.get(this.element.name).clone();
        container.castShadow = true;
        container.receiveShadow = true;
        container.position.set(0, -20, 0);
        return container;

    }

    onFrameRenderered() {

    }
}


