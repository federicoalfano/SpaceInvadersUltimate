import Globals from '../../globals/Globals.js';
import ViewMediator from './ViewMediator.js';
import ViewMediatorFactory from '../ViewMediaFactory.js';
import GUIStorm from '../gui/GUIStorm.js';
export default class StormMediator extends ViewMediator {

    constructor(element, mediatorFactory, controller) {
        super(element, mediatorFactory);
        this.element.addObserver('EnemyAdded', (e) => this.onEnemyAdded(e));
        this.element.addObserver('EnemyRemoved', (e) => this.onEnemyRemoved(e));
        this.element.addObserver('EnemyIntersections', (e) => this.getIntersection(e));
        this.element.addObserver('EnemyHit', (e) => controller.onEnemyHit(e));
        this.element.addObserver('TurretOverHeated', (e) => controller.onTurretOverHeated(e));
        this.element.addObserver('GUIRemoved', () => this.onGUIRemoved());
        this.element.addObserver('GUIInit', () => controller.onGUIInit());
        this.element.addObserver('buildStorm', () => controller.onBuildStorm());
        this.element.addObserver('play', () => controller.onGame());
        this.element.addObserver('start', () => controller.onStart_or_Pause());
        this.element.addObserver('reset', (e) => controller.onExtReset(e));
        this.element.addObserver('EnemyColorChanged', () => controller.onEnemyColorChanged());
        this.element.buildStorm();
        this.GUI_Init();
    }
    makeObject3D() {
        let geometry = new THREE.PlaneBufferGeometry(Globals.instance.StormGlobals.SIZE.x, Globals.instance.StormGlobals.SIZE.y, Globals.instance.StormGlobals.SIZE.z);
        let material = new THREE.MeshBasicMaterial({transparent: true, wireframe: true, opacity: 0.0});
        let mesh = new THREE.Mesh(geometry, material);
        let container = new THREE.Object3D();
        container.add(mesh);
        container.position.set(50, 40, -90);
        container.rotation.x = THREE.Math.degToRad(-45);
        container.visible = false;
        return container;
    }
    GUI_Init() {
        if (this.element.properties.custom) {
            this.gui = new GUIStorm(this.element);
            this.gui.makeGUI();
        }
        this.element.initGUI();
    }
    onGUIRemoved(){
        this.element.reset(true);
        if(this.gui!==undefined){
            this.gui.destroy();
            this.gui=undefined;
        }
    }
    onEnemyRemoved(e){
        this.removeChild(e.enemy);
    }
    onEnemyAdded(e) {
        this.addChild(e.enemy);
    }
    getIntersection(e){   
        if(!this.element.properties.animationscontrols.pause && !this.element.properties.animationscontrols.gameover) {
            for (const [key, value] of this.childMediators.entries()) {
                let intersection = e.raycaster.intersectObject(value.object3D, true);
                if (intersection.length > 0) {
                    this.element.enemyHit(value);
                    break;
                }
            }
        }
    }
    onFrameRenderered() {
        this.element.playGame();
        if (!this.element.properties.animationscontrols.gameover && !this.element.properties.animationscontrols.pause) {//if playing
            this.object3D.visible = true;
        }
        if (this.element.properties.animationscontrols.resetVisual) {
            this.object3D.visible = false;
            this.element.properties.animationscontrols.resetVisual=false;
        }
        super.onFrameRenderered();
    }
}


