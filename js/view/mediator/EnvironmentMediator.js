import ViewMediator from './ViewMediator.js';
import GroundMediator from './GroundMediator.js';
import Ground from '../../model/Ground.js';
import Globals from '../../globals/Globals.js';

export default class EnvironmentMediator extends ViewMediator {

    constructor(environment, mediatorFactory) {
        super(environment, mediatorFactory);
        this.element.addObserver("TurretAdded", (e) => this.onTurretAdded(e));
        this.element.addObserver("GroundAdded", (e) => this.onGroundAdded(e));
        this.element.addObserver("StormAdded", (e) => this.onStormAdded(e));
        this.element.addObserver("StormRemoved", (e) => this.onStormRemoved(e));
        this.element.addObserver("StarAdded", (e) => this.onStarAdded(e));
        this.element.addObserver("StarRemoved", (e) => this.onStarRemoved(e));
        this.element.addObserver("gameOverSound", (e) => this.onGameOver(e));
        //Background audio
        this.background = new THREE.Audio(Globals.instance.listener);
        this.audioLoader = new THREE.AudioLoader();
        this.audioLoader.load('./js/audio/background.mp3', function (buffer) {
            this.background.setBuffer(buffer);
            this.background.setLoop(true);
            this.background.setVolume(0.2);
            this.background.play();
        }.bind(this));
        this.gameOverSound = new THREE.Audio(Globals.instance.listener);
        this.audioLoader.load('./js/audio/Game_Over.mp3', function (buffer) {
            this.gameOverSound.setBuffer(buffer);
            this.gameOverSound.setVolume(0.7);
        }.bind(this));
    }
    
    onTurretAdded(e) {
        //Loader.instance.set(e.turret.name, Loader.instance.get('./js/files/turret/turret.dae'));
        this.addChild(e.turret);      
    }
  
    onGroundAdded(e) {
        //Loader.instance.set(e.ground.name, Loader.instance.get('./js/files/ground/ground.json'));
        this.addChild(e.ground);    
    }
    
    onStormAdded(e){
        this.addChild(e.storm);
    }
    onStormRemoved(e){
        e.storm.removeGUI();
        this.removeChild(e.storm);
    }
    
    onStarAdded(e){
        this.addChild(e.star);
    }
    onStarRemoved(e){
        this.removeChild(e.star);
    }
    onGameOver(e){
        this.gameOverSound.play();
    }
    
    onFrameRendered() {

    }

}


