import Singleton from '../Singleton.js';

export default class Globals extends Singleton {

    constructor() {
        super();
        this.loaded_objects = new Map();
        this.manager = new THREE.LoadingManager();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 700);
        this.StormGlobals = {LINES: 5, COLUMNS: 5, SIZE: {x: 500, y: 300, z: 0},landing_speed: 5};
        this.TPSStormGlobals = {startpoints: [[240, 200, -200], [-240, 200, -200]], endpoints: [[30, -20, -30], [-30, -20, -30], [35, -20, 20], [-35, -20, 20], [40, -20, 40], [-40, -20, 40]], xboundaries: [-170, +170], yboundaries: [30, 80], zboundaries: [-200, -70]};
        this.firstStormProperties = {speed:13,custom:true,scoreReset:false,animation : {direction: 1, maxX: 0, minX: 0},animationscontrols:{reset: false,resetVisual:false, gameover: false, killedenemies: 0, pause: true, maxX: 0, minX: 0,level:1}};
        this.StormProperties =[{speed:11,custom:false,scoreReset:false,animation : {direction: 1, maxX: 0, minX: 0},animationscontrols:{reset: false,resetVisual:false, gameover: false, killedenemies: 0, pause: true, maxX: 0, minX: 0,level:1}},{speed:13},{speed:15},{speed:17},{speed:19}];//5 levels
        this.backupCustomStormProperties = {};
        this.firstTpsProperties = {maxspeed: 2, randomMovements: 15, maxactiveenemies: 5, enemynumber: 10,custom:true,scoreReset:false,animationscontrols:{startup:false,first_startup:true,pause:false,spawningtime:(30*15/(5*1.5)),currentspawningtime:0, reset:false , gameover:false, spawnedenemies:0,level:1}};
        this.TpsProperties = [{maxspeed: 1, randomMovements: 20, maxactiveenemies: 5, enemynumber: 15,custom:false,scoreReset:false,animationscontrols:{startup:false,first_startup:true,pause:false,spawningtime:(30*15/(5*1.5)),currentspawningtime:0, reset:false , gameover:false, spawnedenemies:0,level:1}},{maxspeed: 1.2, randomMovements: 15, maxactiveenemies: 6, enemynumber: 20},{maxspeed: 2, randomMovements: 38, enemynumber: 35},{maxspeed: 2.1, randomMovements: 45, maxactiveenemies: 8, enemynumber: 40},{maxspeed: 2.5, randomMovements: 50, maxactiveenemies: 10, enemynumber: 30}];//5 levels
        this.backupCustomTpsProperties = {};
        this.enemyColors={almostDead:[255,0,0],damaged:[255,204,0],normal:[102,153,153]};
        this.backupEnemyColors={almostDead:[255,0,0],damaged:[255,204,0],normal:[102,153,153]};
        this.backupCustomEnemyColors={almostDead:[255,0,0],damaged:[255,204,0],normal:[102,153,153]};
        this.levelStarColors=[0xf5d99f,0xdeb55c,0xde995c,0xd77642,0xed7055];
        this.firstStarProperties={size:75, ycoordinate:100 ,zrotation:22.5,distanceunits:300,speed:0.01,lightcolor:0xf5d99f,stop:false,colorChanged:false,Movements:{x:0,y:0,z:0}};
        this.backupStarProperties={size:75, ycoordinate:100 ,zrotation:22.5,distanceunits:300,speed:0.01,lightcolor:0xf5d99f,stop:false,colorChanged:false};
        this.backupCustomStarProperties={size:75, ycoordinate:100 ,zrotation:22.5,distanceunits:300,speed:0.01,lightcolor:0xf5d99f,stop:false,colorChanged:false};
    }
}


