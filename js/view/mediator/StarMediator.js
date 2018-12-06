import ViewMediator from './ViewMediator.js';
import Globals from '../../globals/Globals.js';
export default class StarMediator extends ViewMediator {

    constructor(element, mediatorFactory,controller) {
        super(element, mediatorFactory);
        this.element.properties.OrbitRadius = 250 + this.element.properties.distanceunits; //la costante definisce la distanza di base dal ground (fissa)
        this.element.properties.OrbitAngle = this.getRandomNumber(0, 360);
        this.element.properties.RotateSpeed = 0.001;
        this.element.addObserver("changeStarColor", (e) => controller.onchangeStarColor(e));
        this.element.addObserver("changeStarSpeed", (e) => controller.onchangeStarSpeed(e));
        this.element.addObserver("starStop", () => controller.onStarStop());
        this.element.addObserver("move", () => controller.onOrbitAnimation());
    }

    makeObject3D() {
        
        let container=new THREE.Object3D();
        let material = new THREE.MeshBasicMaterial({map:  new THREE.TextureLoader().load( './images/sun-texture.jpg' ), side: THREE.DoubleSide,color:this.element.properties.lightcolor});
        let mesh = new THREE.Mesh(new THREE.SphereGeometry(this.element.properties.size, 35, 35), material);
        mesh.name='Star';
        container.add(mesh);
        let light = new THREE.PointLight(this.element.properties.lightcolor, 2, 0);
        light.name='Emit';
        light.castShadow = true;
        light.shadow.mapSize.width = 512;
        light.shadow.mapSize.height = 512;
        light.shadow.camera.near = this.element.properties.size;
        light.shadow.camera.far = 550 + this.element.properties.distanceunits;
        mesh.add(light);
        var spriteMaterial = new THREE.SpriteMaterial( 
	{ map: new THREE.TextureLoader().load( './images/glow.png' ),color: this.element.properties.lightcolor, transparent: true, blending: THREE.AdditiveBlending});
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(200, 200, 1.0);
        sprite.name='Glow';
        mesh.add(sprite);
        mesh.position.y = this.element.properties.ycoordinate;
        container.rotation.z+=this.element.properties.zrotation* Math.PI / 180;
        return container;
    }
    
    

    onFrameRenderered() {
        
        if(!this.element.properties.stop) {
            this.element.move();
            this.object3D.getObjectByName("Star").position.x = this.element.properties.Movements.x;
            this.object3D.getObjectByName("Star").position.z = this.element.properties.Movements.z;
            this.object3D.getObjectByName("Star").rotation.y = this.element.properties.Movements.y;
        }
        if(this.element.properties.colorChanged) {
            this.object3D.getObjectByName("Star").material.color.setHex(this.element.properties.lightcolor);
            this.object3D.getObjectByName("Emit").color.setHex(this.element.properties.lightcolor);
            this.object3D.getObjectByName("Glow").material.color.setHex(this.element.properties.lightcolor);
            this.element.properties.colorChanged=false;
        }
    }
    
    //Support
    getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }
}


