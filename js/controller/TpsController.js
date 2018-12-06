import Globals from '../globals/Globals.js';
import Enemy from '../model/Enemy.js';
export default class TpsController {
    constructor(element) {
        this.element = element;
    }
    onBuildStorm(id = 0) {
        for (let i = id; i < this.element.properties.maxactiveenemies; i++) {
            let endposition = Globals.instance.TPSStormGlobals.endpoints[this.generateRandomNumber(0, Globals.instance.TPSStormGlobals.endpoints.length - 1)];
            let properties = {startposition: {x: Globals.instance.TPSStormGlobals.startpoints[0][0], y: Globals.instance.TPSStormGlobals.startpoints[0][1], z: Globals.instance.TPSStormGlobals.startpoints[0][2]}, position: {x: Globals.instance.TPSStormGlobals.startpoints[0][0], y: Globals.instance.TPSStormGlobals.startpoints[0][1], z: Globals.instance.TPSStormGlobals.startpoints[0][2]}, endposition: {x: endposition[0], y: endposition[1], z: endposition[2]}, movements: 0, nextposition: {x: 0, y: 0, z: 0}, rotation: {x: 0, y: 0, z: 0}, movement: false, hit: false, dying: false, dead: false, resetdamage: false, colorChanged: false};
            if ((i + 1) % 2 !== 0) {
                properties = {startposition: {x: Globals.instance.TPSStormGlobals.startpoints[1][0], y: Globals.instance.TPSStormGlobals.startpoints[1][1], z: Globals.instance.TPSStormGlobals.startpoints[1][2]}, position: {x: Globals.instance.TPSStormGlobals.startpoints[1][0], y: Globals.instance.TPSStormGlobals.startpoints[1][1], z: Globals.instance.TPSStormGlobals.startpoints[1][2]}, endposition: {x: endposition[0], y: endposition[1], z: endposition[2]}, movements: 0, nextposition: {x: 0, y: 0, z: 0}, rotation: {x: 0, y: 0, z: 0}, movement: false, hit: false, dying: false, dead: false, resetdamage: false, colorChanged: false};
            }
            let enemy = new Enemy('enemy' + i, properties);
            this.element.addEnemy(enemy);
        }
    }
    onGUIInit() {//Guida: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage  
        if (this.element.properties.custom) {
            Globals.instance.environment.setLevel('CUSTOM');
        } else {
            Globals.instance.environment.setLevel(this.element.properties.animationscontrols.level);
            Globals.instance.environment.showStartNextStormLevel(function () {
                this.onStart_or_Pause();
            }.bind(this), this.element.properties.animationscontrols.level);
        }
    }
    onPropertyChanged(e) {//e =attribute
        switch (e.propName) {
            case 'maxactiveenemies':
                this.element.properties.animationscontrols.spawningtime = (30 * 15 / (this.element.properties.maxactiveenemies * 1.5));
                if (Object.keys(this.element.properties.activeenemies).length > this.element.properties.maxactiveenemies) {//Ci sono troppi slot
                    for (let j = Object.keys(this.element.properties.activeenemies).length - 1; j >= this.element.properties.maxactiveenemies; j--) {
                        let EnemytoReallocate = this.element.properties.activeenemies[j];
                        this.element.properties.activeenemies[j] = undefined;
                        if (EnemytoReallocate !== undefined) {
                            this.makeEnemyReset(EnemytoReallocate);
                            this.element.properties.animationscontrols.spawnedenemies -= 1;
                        }
                    }
                } else {
                    if (this.element.properties.maxactiveenemies > this.element.enemies.length) {//se vuoi piu nemici attivi, spawna piu navette in memoria
                        this.onBuildStorm(this.element.enemies.length);
                        if (!this.element.properties.animationscontrols.first_startup)
                            this.element.properties.animationscontrols.startup = true;
                    } else {
                        if (this.getActiveSize() < this.element.properties.maxactiveenemies && this.element.properties.animationscontrols.spawnedenemies + this.element.properties.readyenemies.length < this.element.properties.enemynumber) {
                            let remainingEnemies = this.element.properties.enemynumber - this.element.properties.animationscontrols.spawnedenemies;
                            if (remainingEnemies > this.element.properties.maxactiveenemies) {
                                remainingEnemies = this.element.properties.maxactiveenemies;
                            }
                            let j = 0
                            while (remainingEnemies > this.element.properties.readyenemies.length) {//Devo porre in ready tante navette inutilizzate quante quelle rimanenti
                                while (j < this.element.enemies.length) {
                                    let selectableEnemy = this.element.enemies[j];
                                    if (!this.element.properties.readyenemies.includes(selectableEnemy) && !Object.values(this.element.properties.activeenemies).includes(selectableEnemy)) {
                                        this.element.properties.readyenemies.push(selectableEnemy);
                                        j += 1;
                                        break;
                                    }
                                    j += 1;
                                    remainingEnemies -= 1;
                                }
                            }
                            if (!this.element.properties.animationscontrols.first_startup)
                                this.element.properties.animationscontrols.startup = true;
                        }
                    }
                }
                break;
            case 'enemynumber':
                if (this.element.properties.animationscontrols.spawnedenemies + this.element.properties.readyenemies.length > this.element.properties.enemynumber) {//Troppa roba
                    while (this.element.properties.animationscontrols.spawnedenemies + this.element.properties.readyenemies.length > this.element.properties.enemynumber && this.element.properties.readyenemies.length > 0) {//Cerco prima di svuotare i ready
                        this.element.properties.readyenemies.shift();
                    }
                    if (this.element.properties.animationscontrols.spawnedenemies > this.element.properties.enemynumber) {//Se ancora non ci siamo vedo se siamo in gameover
                        let enemyDestroyed = this.element.properties.animationscontrols.spawnedenemies - this.getActiveSize();
                        if (enemyDestroyed > this.element.properties.enemynumber) {//Svuota gli active e poni gli spawned a enemynumber per triggerare il gameover
                            for (let j = Object.keys(this.element.properties.activeenemies).length - 1; j > 0; j--) {
                                let Enemytostop = this.element.properties.activeenemies[j];
                                this.element.properties.activeenemies[j] = undefined;
                                if (Enemytostop !== undefined) {
                                    this.makeEnemyReset(Enemytostop);
                                }
                            }
                            this.element.properties.animationscontrols.spawnedenemies = this.element.properties.enemynumber;
                        } else {//Elimino solo gli active in sovranumero
                            var j = Object.keys(this.element.properties.activeenemies).length - 1;
                            while (enemyDestroyed + this.getActiveSize() > this.element.properties.enemynumber) {
                                let Enemytostop = this.element.properties.activeenemies[j];
                                this.element.properties.activeenemies[j] = undefined;
                                if (Enemytostop !== undefined) {
                                    this.makeEnemyReset(Enemytostop);
                                }
                                j--;
                            }
                            this.element.properties.animationscontrols.spawnedenemies = this.element.properties.enemynumber;
                        }
                    }
                } else {
                    let remainingEnemies = this.element.properties.enemynumber - (this.element.properties.animationscontrols.spawnedenemies);
                    if (remainingEnemies >= this.element.properties.maxactiveenemies) {
                        remainingEnemies = this.element.properties.maxactiveenemies;
                    }
                    remainingEnemies -= this.element.properties.readyenemies.length;
                    let j = 0
                    while (remainingEnemies > 0) {//Devo porre in ready tante navette inutilizzate quante quelle rimanenti
                        while (j < this.element.enemies.length) {
                            let selectableEnemy = this.element.enemies[j];
                            if (!this.element.properties.readyenemies.includes(selectableEnemy) && !Object.values(this.element.properties.activeenemies).includes(selectableEnemy)) {
                                this.element.properties.readyenemies.push(selectableEnemy);
                                j += 1;
                                break;
                            }
                            j += 1;
                        }
                        remainingEnemies -= 1;
                        if (!this.element.properties.animationscontrols.first_startup)
                            this.element.properties.animationscontrols.startup = true;
                    }
                }
                break;
        }
    }
    onStart_or_Pause() {
        if (this.element.properties.animationscontrols.first_startup) {
            this.element.properties.animationscontrols.startup = true;
            this.element.properties.animationscontrols.first_startup = false;
        } else {
            this.element.properties.animationscontrols.pause = !this.element.properties.animationscontrols.pause;
        }
    }
    onExtReset(e) {
        this.onReset(e.score);
    }
    onReset(scoreset = false) {
        this.element.properties.animationscontrols.reset = true;
        this.element.properties.scoreReset = scoreset;
    }
    onEnemyHit(e) {
        e.value.element.properties.hit = true;
        this.updateScore();
    }
    onTryEnemyAdded(e) {
        if (this.element.properties.animationscontrols.spawnedenemies + this.element.properties.readyenemies.length < this.element.properties.enemynumber) {
            this.element.properties.readyenemies.push(e.enemy);
        }
    }
    onTurretOverHeated(e) {
        if(!this.element.properties.animationscontrols.pause && !this.element.properties.animationscontrols.gameover && !this.element.properties.animationscontrols.first_startup)
            Globals.instance.environment.setScore(-Math.round(25*this.element.properties.maxspeed+5*this.element.properties.maxactiveenemies+375/this.element.properties.randomMovements));
    }
    onEnemyColorChanged() {
        for (let i = 0; i < this.element.enemies.length; i++) {
            this.element.enemies[i].properties.colorChanged = true;
        }
    }
    onGame(){
        if(!this.element.properties.animationscontrols.gameover && !this.element.properties.animationscontrols.pause) {//if playing        
            if (this.element.properties.animationscontrols.startup) {//startup animation
                this.deployEnemies();
            }
            if (this.getActiveSize()> 0) {//animation of movement
                this.moveEnemies();
            }
            //Update gui components
            Globals.instance.environment.setEnemyCount(this.element.properties.animationscontrols.spawnedenemies,this.element.properties.enemynumber);
            if(this.getActiveSize()===0 && this.element.properties.readyenemies.length===0 && this.element.properties.animationscontrols.spawnedenemies===this.element.properties.enemynumber){//Win condition
                if(this.element.properties.custom || this.element.properties.animationscontrols.level===Globals.instance.TpsProperties.length){
                    this.element.properties.animationscontrols.gameover=true;
                    Globals.instance.environment.setGameOver('WIN');
                }else{
                    this.element.properties.animationscontrols.level+=1;
                    for(let prop in Globals.instance.TpsProperties[this.element.properties.animationscontrols.level-1]){
                        this.element.properties[prop]=Globals.instance.TpsProperties[this.element.properties.animationscontrols.level-1][prop];
                    }
                    this.onReset();
                    Globals.instance.environment.setLevel(this.element.properties.animationscontrols.level);
                }
            }
        }
        if (this.element.properties.animationscontrols.reset) {//reset game
            this.makeGameReset();
            if(!this.element.properties.custom && this.element.properties.animationscontrols.level<=Globals.instance.TpsProperties.length){
                this.onPropertyChanged({propName:'maxactiveenemies'});
                this.onPropertyChanged({propName:'enemynumber'});
                Globals.instance.environment.showStartNextStormLevel(function () {
                    this.onStart_or_Pause();
                }.bind(this),this.element.properties.animationscontrols.level);
            }
        }
    }
    deployEnemies() {
        if (this.element.properties.animationscontrols.currentspawningtime === 0) {
            var cenemy = this.element.properties.readyenemies.shift();
            if (cenemy !== undefined) {
                var next = this.obtainNewRandomPosition();
                cenemy.properties.nextposition = {x: next[0], y: next[1], z: next[2]};
                for (var i = 0; i < this.element.properties.maxactiveenemies; i++) {
                    if (this.element.properties.activeenemies[i] === undefined) {
                        this.element.properties.activeenemies[i] = cenemy;
                        break;
                    }
                }
                this.element.properties.animationscontrols.spawnedenemies += 1;
            }
        } else {
            if (this.element.properties.animationscontrols.currentspawningtime >= this.element.properties.animationscontrols.spawningtime) {
                this.element.properties.animationscontrols.currentspawningtime = -1;
            }
        }
        this.element.properties.animationscontrols.currentspawningtime += 1;
        if (this.element.properties.readyenemies.length === 0 || this.element.properties.animationscontrols.spawnedenemies === this.element.properties.enemynumber) {
            this.element.properties.animationscontrols.currentspawningtime = 0;
            this.element.properties.animationscontrols.startup = false;
        }
    }
    moveEnemies() {
        for (var i = 0; i <= this.element.properties.maxactiveenemies; i++) {
            var currentEnemy = this.element.properties.activeenemies[i];
            if (currentEnemy === undefined) {
                continue;
            }
            if (!currentEnemy.properties.dying && !currentEnemy.properties.dead) {//If the enemy isn't dying or its dead
                if (!this.samePoint(currentEnemy.properties.position, currentEnemy.properties.nextposition)) {//regular move to the next point
                    let positionDeltas = this.getCoordinateChanges(currentEnemy.properties.position, currentEnemy.properties.nextposition, this.element.properties.maxspeed);
                    currentEnemy.properties.position.x += positionDeltas.x;
                    currentEnemy.properties.position.y += positionDeltas.y;
                    currentEnemy.properties.position.z += positionDeltas.z;
                    currentEnemy.hasMoved();
                } else {
                    if (!this.samePoint(currentEnemy.properties.position, currentEnemy.properties.endposition)) {//choose to generate a new random point or go for the endpoint
                        if (currentEnemy.properties.movements < this.element.properties.randomMovements) {
                            var next = this.obtainNewRandomPosition();
                            currentEnemy.properties.nextposition = {x: next[0], y: next[1], z: next[2]};
                            currentEnemy.properties.movements += 1;
                        } else {
                            let preendposition = {x: currentEnemy.properties.endposition.x, y: currentEnemy.properties.endposition.y, z: currentEnemy.properties.endposition.z};
                            preendposition.y += 30;
                            if (this.samePoint(currentEnemy.properties.position, preendposition)) {
                                currentEnemy.properties.nextposition = currentEnemy.properties.endposition;
                            } else {
                                currentEnemy.properties.nextposition = preendposition;
                            }
                        }
                    } else {
                        this.element.properties.animationscontrols.gameover = true;
                        Globals.instance.environment.setGameOver('LOSE');
                    }
                }
            } else {
                if(currentEnemy.properties.dead){
                    this.updateScore(currentEnemy);
                    this.element.properties.activeenemies[i]=undefined;
                    this.makeEnemyReset(currentEnemy);
                    if(this.element.properties.animationscontrols.spawnedenemies+this.element.properties.readyenemies.length<this.element.properties.enemynumber){
                        this.element.properties.readyenemies.push(currentEnemy);
                        if(!this.element.properties.animationscontrols.startup){
                            this.element.properties.animationscontrols.startup=true;
                        }
                    }
                }
            }
        }
    }
    makeEnemyReset(enemy){//Enemy model
        let endposition = Globals.instance.TPSStormGlobals.endpoints[this.generateRandomNumber(0, Globals.instance.TPSStormGlobals.endpoints.length - 1)];
        let properties = {startposition:{x:enemy.properties.startposition.x,y:enemy.properties.startposition.y,z:enemy.properties.startposition.z} , position: {x:enemy.properties.startposition.x,y:enemy.properties.startposition.y,z:enemy.properties.startposition.z}, endposition:{x:endposition[0],y:endposition[1],z:endposition[2]}, movements:0, nextposition:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0}, movement:true, hit:false, dying:false, dead:false,resetdamage:true,colorChanged:false};//movement=true to reset the position   
        enemy.properties=properties;
    }
    makeGameReset(){//Resets the enemies
        this.element.properties.activeenemies={};
        this.element.properties.readyenemies=[];
        for (let i = 0; i < this.element.enemies.length; i++) {
            this.makeEnemyReset(this.element.enemies[i]);
            if(this.element.properties.readyenemies.length<this.element.properties.enemynumber && this.element.properties.readyenemies.length<this.element.properties.maxactiveenemies){
                this.element.properties.readyenemies.push(this.element.enemies[i]);
            }else{
                break;
            }
        } 
        this.element.properties.animationscontrols.startup=false;
        this.element.properties.animationscontrols.first_startup=true;
        this.element.properties.animationscontrols.pause=false;
        this.element.properties.animationscontrols.currentspawningtime=0;
        this.element.properties.animationscontrols.gameover=false;
        this.element.properties.animationscontrols.spawnedenemies=0;
        this.element.properties.animationscontrols.reset=false;
        if(this.element.properties.scoreReset){
            Globals.instance.environment.setScoretoZero();
        }
        Globals.instance.environment.setEnemyCount(this.element.properties.animationscontrols.spawnedenemies,this.element.properties.enemynumber);
        Globals.instance.environment.setGameOverReset();
    }
    updateScore(enemy=undefined){
        if(enemy===undefined){//only a hit
            Globals.instance.environment.setScore(10);
        }else{//EnemyElimination
            Globals.instance.environment.setScore(Math.round(25*this.element.properties.maxspeed+5*this.element.properties.maxactiveenemies+375/this.element.properties.randomMovements+2.5*this.element.properties.animationscontrols.spawnedenemies));
        }
    }
    //Support-Functions
    generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    obtainNewRandomPosition(){
        var res=[this.generateRandomNumber(Globals.instance.TPSStormGlobals.xboundaries[0],Globals.instance.TPSStormGlobals.xboundaries[1]),this.generateRandomNumber(Globals.instance.TPSStormGlobals.yboundaries[0],Globals.instance.TPSStormGlobals.yboundaries[1]),this.generateRandomNumber(Globals.instance.TPSStormGlobals.zboundaries[0],Globals.instance.TPSStormGlobals.zboundaries[1])];
        return res;
    }
    getActiveSize(){
        let res=Object.keys(this.element.properties.activeenemies).length;
        for(var i=0;i<Object.keys(this.element.properties.activeenemies).length;i++){
            if(this.element.properties.activeenemies[Object.keys(this.element.properties.activeenemies)[i]]===undefined){
                res--;
            }
        }
        return res;
    }
    getCoordinateChanges(startpoint, endpoint, speed) {//generates next point to reach with passed speed (correcting trajectory to not pass it)
        let res = {};
        if (speed < Math.abs(endpoint.x - startpoint.x)) {
            res.x = (Math.sign(endpoint.x - startpoint.x) * speed);
        } else {
            res.x = (endpoint.x - startpoint.x);
        }
        if (speed < Math.abs(endpoint.y - startpoint.y)) {
            res.y = (Math.sign(endpoint.y - startpoint.y) * speed);
        } else {
            res.y = (endpoint.y - startpoint.y);
        }
        if (speed < Math.abs(endpoint.z - startpoint.z)) {
            res.z = (Math.sign(endpoint.z - startpoint.z) * speed);
        } else {
            res.z = (endpoint.z - startpoint.z);
        }
        return res;
    }
    samePoint(A,B){
        return (A.x===B.x && A.y===B.y && A.z===B.z);
    }
}