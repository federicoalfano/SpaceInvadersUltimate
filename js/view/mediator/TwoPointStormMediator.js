import Globals from '../../globals/Globals.js';
import ViewMediator from './ViewMediator.js';
import ViewMediatorFactory from '../ViewMediaFactory.js';
import GUITPSStorm from '../gui/GUITPSStorm.js';
import Enemy from '../../model/Enemy.js';

export default class TwoPointStormMediator extends ViewMediator {

    constructor(element, mediatorFactory, controller) {
        super(element, mediatorFactory);    
        this.element.properties.readyenemies=[];
        this.element.properties.activeenemies={};
        this.element.addObserver('EnemyAdded', (e) => this.onEnemyAdded(e));
        this.element.addObserver('tryAdd', (e) => controller.onTryEnemyAdded(e));
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
        this.element.addObserver('propertyChanged',(e) =>controller.onPropertyChanged(e));
        this.element.buildStorm();
        this.GUI_Init();
    }
    
    GUI_Init(){//Guida: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage  
        if (this.element.properties.custom) {
            this.gui = new GUITPSStorm(this.element);
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
    //Event-Handlers
    getIntersection(e){ 
        if (!this.element.properties.animationscontrols.pause && !this.element.properties.animationscontrols.gameover && !this.element.properties.animationscontrols.first_startup) {
            for (const [key, value] of this.childMediators.entries()) {
                let intersection = e.raycaster.intersectObject(value.object3D, true);
                if (intersection.length > 0) {
                    this.element.enemyHit(value);
                    break;
                }
            }
        }
    }
    onEnemyAdded(e) {
        this.addChild(e.enemy);
        this.element.tryAddEnemytoScene(e.enemy);
    }
    //Animation controls
    onFrameRenderered() { 
        this.element.playGame();
        super.onFrameRenderered();
    }
}