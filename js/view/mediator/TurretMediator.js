import ViewMediator from './ViewMediator.js';
import Globals from '../../globals/Globals.js';
import Bullet from '../../model/Bullet.js';
export default class TurretMediator extends ViewMediator {
    constructor(element, mediaFactory) {

        super(element, mediaFactory);

        this.element.addObserver('mouseMoved', () => {
            this.mouse_moved = true;
        });
        this.element.addObserver('mouseDown', (e) => {
            this.shooting = true;
        });
        this.element.addObserver('mouseUp', () => {
            this.shooting = false;
        });
        this.element.addObserver('bulletAdded', (e) => {
            this.onBulletAdded(e)
        });
        this.element.addObserver('bulletRemoved', (e) => {
            this.onBulletRemoved(e)
        });
                this.mouse_moved = false;
        this.shoot_animation = {speed: 0.07, direction: -1, range: 0.18, limit: 200, boundary: 100, actual_step: 0, heat: false};
        this.starting_color_canne = new THREE.Color("rgb( 192,192,192 )");
        this.final_color_canne = new THREE.Color("rgb( 236, 29, 0 )");
        this.raycaster = new THREE.Raycaster();
        this.sound = new THREE.Audio(Globals.instance.listener);
        this.overheatsound = new THREE.Audio(Globals.instance.listener);
        this.audioLoader = new THREE.AudioLoader();
        this.audioLoader.load('./js/audio/shoot.mp3', function (buffer) {
            this.sound.setBuffer(buffer);
            this.sound.setVolume(0.5);
        }.bind(this));
        this.audioLoader.load('./js/audio/Turret_overHeat.mp3', function (buffer) {
            this.overheatsound.setBuffer(buffer);
            this.overheatsound.setVolume(0.6);
        }.bind(this));


    }
    onBulletRemoved(e) {
        this.removeChild(e.bullet);
    }
    onBulletAdded(e) {
        this.addChild(e.bullet);
    }
    makeObject3D() {

        //this.object3D = Loader.instance.get(this.element.name);
        let container = new THREE.Object3D();
        this.turret = new THREE.Object3D();
        this.turret.add(Globals.instance.loaded_objects.get(this.element.name).clone());
        container.add(this.turret);
        let geometry = new THREE.PlaneBufferGeometry(1550, 600, 2);
        let material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});
        material.opacity = 0;

        this.plane = new THREE.Mesh(geometry, material);
        this.plane.position.set(0, 220, -570);
        this.plane.material.transparent = true;

        container.add(this.plane);

        this.supporto = container.getObjectByName('Supporto', true);
        this.bracci = container.getObjectByName('Bracci', true);
        this.canne = container.getObjectByName('Canne', true);
        this.turret.scale.set(10, 10, 10);
        
        this.supporto.receiveShadow = true;
        this.bracci.receiveShadow = true;
        this.canne.receiveShadow = true;

        this.turret.position.set(0, -20, 50);
        this.turret.rotation.y = (THREE.Math.degToRad(180));


        this.supporto.children[1].material = new THREE.MeshStandardMaterial({envMap: null, roughness: 0.7, metalness: 1, color: new THREE.Color("rgb( 32,32,32 )")});
        this.bracci.children[1].material = new THREE.MeshStandardMaterial({envMap: null, roughness: 0.7, metalness: 1, color: new THREE.Color("rgb( 80,80,80 )")});
        this.canne.material = new THREE.MeshStandardMaterial({envMap: null, roughness: 0.7, metalness: 1, color: new THREE.Color("rgb( 192,192,192 )")});
        return container;



    }
    onFrameRenderered() {
        super.onFrameRenderered();
        if (this.mouse_moved) {
            this.supporto.rotation.y = -this.element.mouse.x;
            this.bracci.rotation.x = Math.min(0, -this.element.mouse.y);
            this.mouse_moved = false;


        }
        if (this.shooting && !this.shoot_animation.heat) {

            this.canne.material.color = this.nextColor(this.canne.material.color, this.final_color_canne, this.shoot_animation.limit);
            this.shoot_animation.actual_step++;
            Globals.instance.environment.setHeat(false, (Math.round(this.shoot_animation.actual_step / this.shoot_animation.limit * 100)), this.canne.material.color.getHexString());
            if (Math.abs(this.canne.position.z) >= this.shoot_animation.range) {
                this.raycaster.setFromCamera(this.element.mouse, Globals.instance.camera);
                if (Globals.instance.environment.storm !== undefined)
                    Globals.instance.environment.storm.getIntersection(this.raycaster);
                let intersection = this.raycaster.intersectObject(this.plane);
                if (intersection[0] !== undefined) {
                    let points = intersection[0].point;
                    let vector = new THREE.Vector3(points.x, points.y, points.z);
                    let properties = {parent: this.element, end_point: this.turret.worldToLocal(vector), ray: this.raycaster.ray};
                    let bullet = new Bullet('bullet', properties);
                    this.element.addBullet(bullet);
                }
                this.shoot_animation.direction *= -1;
                if (!this.sound.isPlaying) {
                    this.sound.play();
                }
            }
            this.canne.position.z += this.shoot_animation.speed * this.shoot_animation.direction;
            if (this.shoot_animation.actual_step == this.shoot_animation.limit) {
                if (Globals.instance.environment.storm !== undefined) {
                    Globals.instance.environment.storm.turretOverHeated();
                }
                this.shoot_animation.heat = true;
                if(!this.overheatsound.isPlaying){
                    this.overheatsound.play();
                }
            }

        } else {
            if (this.shoot_animation.actual_step > 0) {
                this.shoot_animation.actual_step--;
            }
            if (this.shoot_animation.actual_step == this.shoot_animation.limit - this.shoot_animation.boundary) {
                this.shoot_animation.heat = false;
            }
            if (this.shoot_animation.heat) {
                Globals.instance.environment.setHeat(true,(Math.round(this.shoot_animation.actual_step / this.shoot_animation.limit * 100)),this.canne.material.color.getHexString());
            } else {
                Globals.instance.environment.setHeat(false,(Math.round(this.shoot_animation.actual_step / this.shoot_animation.limit * 100)),this.canne.material.color.getHexString());
            }
            this.canne.material.color = this.nextColor(this.canne.material.color, this.starting_color_canne, this.shoot_animation.limit);
        }


    }
    nextColor(start, end, nsteps) {
        let next_color = new THREE.Color(start.r + (end.r - start.r) / nsteps, start.g + (end.g - start.g) / nsteps, start.b + (end.b - start.b) / nsteps);
        return next_color;
    }

}

