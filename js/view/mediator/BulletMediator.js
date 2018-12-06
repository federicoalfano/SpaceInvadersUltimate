import ViewMediator from './ViewMediator.js';
import Globals from '../../globals/Globals.js';
export default class BulletMediator extends ViewMediator {
    constructor(element, mediaFactory) {
        super(element, mediaFactory);
        this.speed = 0.2;
        this.position = 0;



    }

    makeObject3D() {

        let geometry = new THREE.SphereBufferGeometry(0.275, 3, 2);
        let material = new THREE.MeshBasicMaterial({color: 0xffff00});
        let meshR = new THREE.Mesh(geometry, material);
        let meshL = meshR.clone();
    
    
        let container = new THREE.Object3D();
        container.add(meshR);
        container.add(meshL);

        this.pathL = new THREE.Line3(new THREE.Vector3(2, 0, 20), this.element.properties.end_point);
        this.pathR = new THREE.Line3(new THREE.Vector3(-2, 0, 20), this.element.properties.end_point);
        this.element.properties.box = new THREE.Box3().setFromObject(container);
        return container;



    }
    onFrameRenderered() {
      
        if (this.object3D.children[0].position.z<Globals.instance.camera.far){
            this.position+=this.speed;
            this.pathL.at(this.position, this.object3D.children[1].position);
            this.pathR.at(this.position, this.object3D.children[0].position);
        }
        else{
            this.element.properties.parent.removeBullet();
        }

    }

}

