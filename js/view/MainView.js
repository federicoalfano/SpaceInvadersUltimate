import RenderingContext from './RenderingContext.js';
import EnvironmentMediator from './mediator/EnvironmentMediator.js';
import ViewMediatorFactory from './ViewMediaFactory.js';
import GuiControls from './controls/GuiControls.js';
export default class MainView {

    constructor(controller, environment) {
        this.controller = controller;
        this.environment = environment;
        this.renderingContext = this.createRenderingContext();
        this.environmentMediator = new EnvironmentMediator(environment, new ViewMediatorFactory());
        this.objectPicker = new GuiControls(this.environmentMediator, this.renderingContext);
        
    }

    createRenderingContext() {
        const domContainer = document.createElement('div');

        document.body.appendChild(domContainer);

        return RenderingContext.getDefault(domContainer);
    }
    
    initialize(){
        const scene = this.renderingContext.scene;
        const object3D = this.environmentMediator.object3D;
        this.objectPicker.initialize();
        this.objectPicker.addObserver('mousedown', (e) => this.controller.onMouseDown());
        this.objectPicker.addObserver('mousemove', (e) => this.controller.onMouseMove(e));
        this.objectPicker.addObserver('mouseup', (e)=>this.controller.onMouseUp());
        //new observers
        this.objectPicker.addObserver('mountStorm', (e)=>this.controller.onMountStorm(e));
        this.objectPicker.addObserver('mountTPStorm', (e)=>this.controller.onMountTPStorm(e));
        this.objectPicker.addObserver('removeStorm', (e)=>this.controller.onRemoveStorm());
        //reversals observers from environment to GUI
        this.environment.addObserver('scoreUpdate', (e)=>this.objectPicker.onScoreUpdate(e));
        this.environment.addObserver('levelUpdate', (e)=>this.objectPicker.onLevelUpdate(e));
        this.environment.addObserver('totalEnemiesUpdate', (e)=>this.objectPicker.onTotalEnemiesUpdate(e));
        this.environment.addObserver('heatUpdate', (e)=>this.objectPicker.onHeatUpdate(e));
        this.environment.addObserver('gameOver', (e)=>this.objectPicker.onGameOverUpdate(e));
        this.environment.addObserver('gameOverReset', (e)=>this.objectPicker.onGameOverReset(e));
        this.environment.addObserver('showStartNextWave', (e)=>this.objectPicker.onShowStartNextWave(e));
        scene.add(object3D);
        //this.controls = new THREE.OrbitControls(this.renderingContext.camera);
        window.addEventListener('resize', (e) =>this.onWindowsResize(), false);
        this.render();
        
    }
    
    render() {
        
        requestAnimationFrame(() => this.render());
        //this.controls.update();
        this.environmentMediator.onFrameRenderered();
        this.renderingContext.renderer.render(this.renderingContext.scene, this.renderingContext.camera);
        this.renderingContext.stats.update();
    }
    
    onWindowsResize() {
        this.renderingContext.camera.aspect = window.innerWidth / window.innerHeight;
        this.renderingContext.camera.updateProjectionMatrix();

        this.renderingContext.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
}


