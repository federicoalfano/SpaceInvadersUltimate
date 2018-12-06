import ViewMediator from './ViewMediator.js';
import Globals from '../../globals/Globals.js';
export default class EnemyMediator extends ViewMediator {

    constructor(element, mediaFactory) {
        super(element, mediaFactory);
        this.rollingAnimation={isRolling:false,damage:0,degreeSpeed:20,currentDegree:0,maxFirstOscillationDegrees:14, phases:3, t: 0};
        this.explosionAnimation={explosionCurrentScale:0.0001,explosionSpeed:0.05, explosionBaseScale:0.0001, explosionMaxScale:1, explosionUpdates:0};
        this.counter = 0;
    }

    makeObject3D() {
        this.movementSpeed = 0.3;
        this.totalObjects = 1000;
        this.objectSize = 2;
        this.dirs = [];
        this.status = true;
        let scale_factor = 30;
        this.colors = [new THREE.Color("rgb("+Math.round(Globals.instance.enemyColors.almostDead[0])+","+Math.round(Globals.instance.enemyColors.almostDead[1])+","+Math.round(Globals.instance.enemyColors.almostDead[2])+" )"),new THREE.Color("rgb("+Math.round(Globals.instance.enemyColors.damaged[0])+","+Math.round(Globals.instance.enemyColors.damaged[1])+","+Math.round(Globals.instance.enemyColors.damaged[2])+" )"),new THREE.Color("rgb("+Math.round(Globals.instance.enemyColors.normal[0])+","+Math.round(Globals.instance.enemyColors.normal[1])+","+Math.round(Globals.instance.enemyColors.normal[2])+" )")];//They go from rigth to left
        let container = new THREE.Object3D();
        this.explosion = this.explodeAnimation(0, 0);
        this.explosion.visible = false;
        this.enemy = Globals.instance.loaded_objects.get('enemy').clone();
        container.add(this.enemy);
        container.add(this.explosion);
        container.rotation.x = THREE.Math.degToRad(this.element.properties.rotation.x);//45
        container.scale.set(scale_factor, scale_factor, scale_factor);
        container.position.set(this.element.properties.position.x, this.element.properties.position.y, this.element.properties.position.z);
        this.enemy.getObjectByName("Cylinder").material = new THREE.MeshStandardMaterial({envMap: null, roughness: 0.7, metalness: 1, color: this.colors[this.colors.length - 1]});
        this.enemy.getObjectByName("Sphere").material = new THREE.MeshStandardMaterial({envMap: null, roughness: 0.7, metalness: 1, color: this.colors[this.colors.length - 1]});
        this.enemy.getObjectByName("Cylinder").castShadow = true;
        this.enemy.getObjectByName("Sphere").castShadow = true;
        this.enemy.getObjectByName("Cylinder").receiveShadow = true;
        this.enemy.getObjectByName("Sphere").receiveShadow = true;
        //adding Explosion Audio
        this.explosionAudio = new THREE.PositionalAudio(Globals.instance.listener);
        this.hitAudio = new THREE.PositionalAudio(Globals.instance.listener);
        this.audioLoader = new THREE.AudioLoader();
        this.audioLoader.load('./js/audio/Enemy_Explosion.mp3', function (buffer) {
            this.explosionAudio.setBuffer(buffer);
            this.explosionAudio.setRefDistance(40);
        }.bind(this));
        this.audioLoader.load('./js/audio/Enemy_Hit.mp3', function (buffer) {
            this.hitAudio.setBuffer(buffer);
            this.hitAudio.setRefDistance(10);
        }.bind(this));
        this.enemy.add(this.explosionAudio);
        this.enemy.add(this.hitAudio);
        return container;
    }

    onFrameRenderered() {
        if (this.element.properties.movement && !this.element.properties.dying) {
            this.object3D.position.x += (this.element.properties.position.x - this.object3D.position.x);
            this.object3D.position.y += (this.element.properties.position.y - this.object3D.position.y);
            this.object3D.position.z += (this.element.properties.position.z - this.object3D.position.z);
            this.element.properties.movement = false;
        }
        if (this.element.properties.hit && !this.element.properties.dying && !this.element.properties.dead) {//Hit animation
            
            this.rollingAnimation.isRolling = true;
            this.rollingAnimation.damage += 1;
            if (this.rollingAnimation.damage >= this.colors.length) {
                this.rollingAnimation.damage = 0;
                this.element.properties.dying = true;
                this.enemy.visible = false;
                this.explosion.visible = true;
                this.explosionAudio.play();
            }else{
                if(!this.hitAudio.isPlaying)
                    this.hitAudio.play();
            }
            this.object3D.getObjectByName("Cylinder").material.color = this.colors[this.colors.length - 1 - this.rollingAnimation.damage];
            this.object3D.getObjectByName("Sphere").material.color = this.colors[this.colors.length - 1 - this.rollingAnimation.damage];
            this.element.properties.hit = false;
        }else{
            this.element.properties.hit = false;
        }
        if (this.rollingAnimation.isRolling) {//Rolling animation
            let temp_degree = (this.rollingAnimation.currentDegree+this.rollingAnimation.degreeSpeed)%360;
            if(temp_degree<this.rollingAnimation.currentDegree){
                ++this.rollingAnimation.t < this.rollingAnimation.phases?this.rollingAnimation.isRolling=true:(this.rollingAnimation.isRolling=false, this.rollingAnimation.t=0);
            }
            this.rollingAnimation.currentDegree = temp_degree;
            this.object3D.rotation.z = THREE.Math.degToRad(this.rollingAnimation.maxFirstOscillationDegrees*Math.exp(-this.rollingAnimation.t/this.rollingAnimation.phases)*Math.sin(THREE.Math.degToRad(this.rollingAnimation.currentDegree))); // Moto armonico smorzato
        }
        if (this.element.properties.dying) {//death Animation going on
            this.explosionAnimation.explosionCurrentScale+=this.explosionAnimation.explosionSpeed;
            if(this.explosionAnimation.explosionCurrentScale>this.explosionAnimation.explosionMaxScale){
                this.explosionAnimation.explosionCurrentScale=this.explosionAnimation.explosionBaseScale;
                this.element.properties.dying=false;
                this.element.properties.dead=true;
            }
          
            this.updateExplosion();
            this.explosionAnimation.explosionUpdates+=1;

            //this.object3D.getObjectByName("BOOM").scale.set(this.explosionAnimation.explosionCurrentScale,this.explosionAnimation.explosionCurrentScale,this.explosionAnimation.explosionCurrentScale);
        }
        if(this.element.properties.colorChanged){
            this.colors = [new THREE.Color("rgb("+Math.round(Globals.instance.enemyColors.almostDead[0])+","+Math.round(Globals.instance.enemyColors.almostDead[1])+","+Math.round(Globals.instance.enemyColors.almostDead[2])+" )"),new THREE.Color("rgb("+Math.round(Globals.instance.enemyColors.damaged[0])+","+Math.round(Globals.instance.enemyColors.damaged[1])+","+Math.round(Globals.instance.enemyColors.damaged[2])+" )"),new THREE.Color("rgb("+Math.round(Globals.instance.enemyColors.normal[0])+","+Math.round(Globals.instance.enemyColors.normal[1])+","+Math.round(Globals.instance.enemyColors.normal[2])+" )")];
            this.object3D.getObjectByName("Cylinder").material.color = this.colors[this.colors.length - 1 - this.rollingAnimation.damage];
            this.object3D.getObjectByName("Sphere").material.color = this.colors[this.colors.length - 1 - this.rollingAnimation.damage];
            this.element.properties.colorChanged=false;
        }
        if(this.element.properties.resetdamage){
            this.rollingAnimation.damage = 0;
            this.updateExplosion(-this.explosionAnimation.explosionUpdates);
            this.explosionAnimation.explosionUpdates=0;
            this.enemy.visible = true;
            this.explosion.visible = false;
            this.object3D.getObjectByName("Cylinder").material.color = this.colors[this.colors.length - 1 - this.rollingAnimation.damage];
            this.object3D.getObjectByName("Sphere").material.color = this.colors[this.colors.length - 1 - this.rollingAnimation.damage];
            this.element.properties.resetdamage = false;
        }
    }
    updateExplosion(times=1) {
        var pCount = this.totalObjects;
        while (pCount--) {
            var particle = this.explosion.geometry.vertices[pCount];
            particle.y += this.dirs[pCount].y*times;
            particle.x += this.dirs[pCount].x*times;
            particle.z += this.dirs[pCount].z*times;
        }
        this.explosion.geometry.verticesNeedUpdate = true;
    }
    explodeAnimation(x, y){
        var geometry = new THREE.Geometry();
        for (var i = 0; i < this.totalObjects; i++)
        {
            var vertex = new THREE.Vector3();
            vertex.x = x;
            vertex.y = y;
            vertex.z = 0;
            geometry.vertices.push(vertex);
            this.dirs.push({x: (Math.random() * this.movementSpeed) - (this.movementSpeed / 2), 
                y: (Math.random() * this.movementSpeed) - (this.movementSpeed / 2), 
                z: (Math.random() * this.movementSpeed) - (this.movementSpeed / 2)});
        }
        var material = new THREE.PointsMaterial({size: this.objectSize, color: 0xFF0000});
        var particles = new THREE.Points(geometry, material);
        this.object = particles;
        this.status = true;
        return this.object;
    }

}

