import Globals from '../globals/Globals.js';
import Storm from '../model/Storm.js';
import TwoPointStorm from '../model/TwoPointStorm.js';
export default class RenderingContext {
    constructor(scene, camera, renderer,stats) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.stats=stats;
         //External containers introduction:
        this.startClassicButton=document.getElementById('StartClassic');
        this.startFuturisticButton=document.getElementById('StartFuturistic');
        this.startCustomClassicButton=document.getElementById('StartCustomClassic');
        this.startCustomFuturisticButton=document.getElementById('StartCustomFuturistic');
        this.returnMenuButton=document.getElementById('Return');
        this.startWaveButton=document.getElementById('StartWave');
        this.inpageTitle=[document.getElementById('Space'),document.getElementById('Ultimate')];
        this.gameOverTitle=document.getElementById('GameoverTitle');
        this.gameOverText=document.getElementById('Gameover');
        this.heatBarContainer=document.getElementById('HeatBar');
        this.enemyCounter=document.getElementById('Enemies');
        this.scoreCounter=document.getElementById('Score');
        this.levelCounter=document.getElementById('Level');
        //Initial visibility 
        this.inpageTitle[0].style.visibility = 'visible'; 
        this.inpageTitle[1].style.visibility = 'visible'; 
        this.startClassicButton.style.visibility = 'visible'; 
        this.startFuturisticButton.style.visibility = 'visible'; 
        this.startCustomClassicButton.style.visibility = 'visible'; 
        this.startCustomFuturisticButton.style.visibility = 'visible'; 
    }

    static getDefault(containerElement) {     
        const width = window.innerWidth, height = window.innerHeight;
        const container = document.getElementById('container');
        const scene = new THREE.Scene();
        const camera = Globals.instance.camera;
        const renderer = new THREE.WebGLRenderer({alpha: true, transparent: true});
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        const stats = new Stats();
        
        camera.position.set(0, -5, 100);
        camera.lookAt(0,30, -100);
        renderer.setSize(width, height);
        scene.add(new THREE.AmbientLight(0xffdccc, 0.75));
        
        Globals.instance.listener = new THREE.AudioListener();
        camera.add(Globals.instance.listener);
        
        const light = new THREE.DirectionalLight(0xffffff, 0.8);
        var loader = new THREE.TextureLoader();
        loader.load('../images/background.jpg', function (texture) {
            scene.background = texture;
        });
        light.position.set(1, 1, 1);
        scene.add(light);

        containerElement.appendChild(renderer.domElement);
        container.appendChild(stats.dom);

        return new RenderingContext(scene, camera, renderer, stats);
    }
}
