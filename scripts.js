import Globals from './js/globals/Globals.js';
import Environment from './js/model/Environment.js';
import EnvironmentController from './js/controller/EnvironmentController.js';
import Turret from './js/model/Turret.js';
import Ground from './js/model/Ground.js';
import Storm from './js/model/Storm.js';
import TwoPointStorm from './js/model/TwoPointStorm.js';
import Enemy from './js/model/Enemy.js';
import Star from './js/model/Star.js';
import ViewMediatorFactory from './js/view/ViewMediaFactory.js';

var elem = document.getElementById("myBar");
Globals.instance.manager.onLoad = function () {
   var bar = document.getElementById("myProgress");
    
    Globals.instance.environment = new Environment('Mars');
    const envController = new EnvironmentController(Globals.instance.environment);
    const factory = new ViewMediatorFactory();
    const ground = new Ground('ground');
    Globals.instance.environment.addGround(ground);
    const turret = new Turret('turret');
    Globals.instance.environment.addTurret(turret);
    const sun=new Star('sun');
    Globals.instance.environment.addStar(sun);
    bar.style.visibility = "hidden";
    elem.style.visibility = "hidden";

};
Globals.instance.manager.onStart = function (url, itemsLoaded, itemsTotal) {
        elem.style.visibility = "visible";

}
Globals.instance.manager.onProgress = function (url, itemsLoaded, itemsTotal) {

        let width = (itemsLoaded/itemsTotal)*100;
        console.log(width);
        elem.style.width = width + '%';
        elem.innerHTML = width + '%';

};
let turret_loader = new THREE.ColladaLoader(Globals.instance.manager);
let enemy_loader = new THREE.ColladaLoader(Globals.instance.manager);
let ground_loader = new THREE.MTLLoader(Globals.instance.manager);

ground_loader.load('./js/files/ground/ground.mtl', (materials)=>{
    materials.preload();
    new THREE.OBJLoader(Globals.instance.manager).setMaterials( materials ).load('./js/files/ground/ground.obj',(object)=>{       
        Globals.instance.loaded_objects.set('ground', object.getObjectByName('Ground'));
    });
});
turret_loader.load('./js/files/turret/turret.dae', (object)=>{
    Globals.instance.loaded_objects.set('turret', object.scene);});
enemy_loader.load('./js/files/enemy/enemy.dae', (object) => {
    Globals.instance.loaded_objects.set('enemy', object.scene);
});
