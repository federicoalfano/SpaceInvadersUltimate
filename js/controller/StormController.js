import Globals from '../globals/Globals.js';
import Enemy from '../model/Enemy.js';
export default class StormController {
    constructor(element) {
        this.element = element;
    }
    onGUIInit() {
        if (this.element.properties.custom) {
            Globals.instance.environment.setLevel('CUSTOM');
        } else {
            Globals.instance.environment.setLevel(this.element.properties.animationscontrols.level);
            Globals.instance.environment.showStartNextStormLevel(function () {
                this.onStart_or_Pause();
            }.bind(this), this.element.properties.animationscontrols.level);
        }
    }
    onBuildStorm() {
        for (var i = 0; i < Globals.instance.StormGlobals.LINES; i++) {
            for (var j = 0; j < Globals.instance.StormGlobals.COLUMNS; j++) {
                let pos = {x: i * (Globals.instance.StormGlobals.SIZE.x / (1.5 * Globals.instance.StormGlobals.COLUMNS)) - Globals.instance.StormGlobals.SIZE.x / 2, y: j * (Globals.instance.StormGlobals.SIZE.y / (3 * Globals.instance.StormGlobals.COLUMNS)) + Globals.instance.StormGlobals.SIZE.y / 5, z: 0};
                if (this.element.properties.animation.maxX < pos.x) {
                    this.element.properties.animation.maxX = pos.x;
                    this.element.properties.animationscontrols.maxX = pos.x;
                }
                if (this.element.properties.animation.minX > pos.x) {
                    this.element.properties.animation.minX = pos.x;
                    this.element.properties.animationscontrols.minX = pos.x;
                }
                let properties = {startposition: {x: pos.x, y: pos.y, z: pos.z}, hiddenposition: {x: 0, y: -500, z: 0}, position: {x: pos.x, y: pos.y, z: pos.z}, rotation: {x: 45, y: 0, z: 0}, movement: false, hit: false, dying: false, dead: false, resetdamage: false, colorChanged: false};
                let enemy = new Enemy('enemy' + i + j, properties);
                this.element.addEnemy(enemy);
            }
        }
    }
    onStart_or_Pause() {
        this.element.properties.animationscontrols.pause = !this.element.properties.animationscontrols.pause;
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
    onTurretOverHeated(e) {
        if (!this.element.properties.animationscontrols.pause && !this.element.properties.animationscontrols.gameover)
            Globals.instance.environment.setScore(-Math.round(this.element.properties.speed * 100));
    }
    onGame() {
        if (!this.element.properties.animationscontrols.gameover && !this.element.properties.animationscontrols.pause) {//if playing
            let subY = 0;
            let currentBoundary = {maxX: undefined, minX: undefined};
            if (this.element.properties.animationscontrols.maxX > this.element.properties.animation.maxX + (Globals.instance.StormGlobals.SIZE.x / 4) || this.element.properties.animationscontrols.minX < this.element.properties.animation.minX) {
                subY -= Globals.instance.StormGlobals.landing_speed;
                this.element.properties.animation.direction *= -1;
            }
            for (let i = 0; i < this.element.enemies.length; i++) {
                let cEnemy = this.element.enemies[i];
                if (cEnemy.properties.dead || cEnemy.properties.dying) {//Non muove i morti o morenti
                    if (cEnemy.properties.dead && !this.samePoint(cEnemy.properties.position, cEnemy.properties.hiddenposition)) {//reset a Hidden una tantum se morto
                        this.updateScore(cEnemy);
                        this.element.properties.animationscontrols.killedenemies += 1;
                        this.makeEnemyReset(cEnemy, true);
                    }
                    continue;
                }
                //Movement      
                cEnemy.properties.position.x += this.element.properties.animation.direction * (this.element.properties.speed / (this.element.enemies.length - this.element.properties.animationscontrols.killedenemies));
                cEnemy.properties.position.y += subY;
                cEnemy.properties.movement = true;
                //Memorize new Boundaries
                if (currentBoundary.maxX === undefined && currentBoundary.minX === undefined) {
                    currentBoundary.maxX = cEnemy.properties.position.x;
                    currentBoundary.minX = cEnemy.properties.position.x;
                } else {
                    if (currentBoundary.maxX < cEnemy.properties.position.x) {
                        currentBoundary.maxX = cEnemy.properties.position.x;
                    }
                    if (this.element.properties.animation.minX > cEnemy.properties.position.x) {
                        currentBoundary.minX = cEnemy.properties.position.x;
                    }
                }
                //Check lose condition
                if (cEnemy.properties.position.y <= -80) {
                    this.element.properties.animationscontrols.gameover = true;
                    Globals.instance.environment.setGameOver('LOSE');
                }
            }
            //update current x positions
            this.element.properties.animationscontrols.maxX = currentBoundary.maxX;
            this.element.properties.animationscontrols.minX = currentBoundary.minX;
            Globals.instance.environment.setEnemyCount(this.element.enemies.length - this.element.properties.animationscontrols.killedenemies, this.element.enemies.length);
            if (this.element.enemies.length === this.element.properties.animationscontrols.killedenemies) {//Win condition
                if (this.element.properties.custom || this.element.properties.animationscontrols.level === Globals.instance.StormProperties.length) {
                    this.element.properties.animationscontrols.gameover = true;
                    Globals.instance.environment.setGameOver('WIN');
                } else {
                    this.element.properties.animationscontrols.level += 1;
                    for (let prop in Globals.instance.StormProperties[this.element.properties.animationscontrols.level - 1]) {
                        this.element.properties[prop] = Globals.instance.StormProperties[this.element.properties.animationscontrols.level - 1][prop];
                    }
                    this.onReset();
                    Globals.instance.environment.setLevel(this.element.properties.animationscontrols.level);
                }
                ;
            }
        }
        if (this.element.properties.animationscontrols.reset) {
            this.makeGameReset();
            if (!this.element.properties.custom && this.element.properties.animationscontrols.level <= Globals.instance.StormProperties.length) {
                Globals.instance.environment.showStartNextStormLevel(function () {
                    this.onStart_or_Pause();
                }.bind(this), this.element.properties.animationscontrols.level);
            }
        }
    }
    makeEnemyReset(enemy, toHidden = false) {//Enemy model reset
        let properties = {startposition: {x: enemy.properties.startposition.x, y: enemy.properties.startposition.y, z: enemy.properties.startposition.z}, hiddenposition: {x: enemy.properties.hiddenposition.x, y: enemy.properties.hiddenposition.y, z: enemy.properties.hiddenposition.z}, position: {x: enemy.properties.startposition.x, y: enemy.properties.startposition.y, z: enemy.properties.startposition.z}, rotation: {x: 45, y: 0, z: 0}, movement: true, hit: false, dying: false, dead: false, resetdamage: true, colorChanged: false};//movement=true to reset the position   
        if (toHidden) {
            properties = {startposition: {x: enemy.properties.startposition.x, y: enemy.properties.startposition.y, z: enemy.properties.startposition.z}, hiddenposition: {x: enemy.properties.hiddenposition.x, y: enemy.properties.hiddenposition.y, z: enemy.properties.hiddenposition.z}, position: {x: enemy.properties.hiddenposition.x, y: enemy.properties.hiddenposition.y, z: enemy.properties.hiddenposition.z}, rotation: {x: 45, y: 0, z: 0}, movement: true, hit: false, dying: false, dead: true, resetdamage: true, colorChanged: false};//movement=true to reset the position
        }
        enemy.properties = properties;
    }
    makeGameReset() {//Resets the enemies
        for (let i = 0; i < this.element.enemies.length; i++) {
            this.makeEnemyReset(this.element.enemies[i]);
        }
        this.element.properties.animationscontrols.killedenemies = 0;
        this.element.properties.animationscontrols.pause = true;
        this.element.properties.animationscontrols.gameover = false;
        this.element.properties.animationscontrols.reset = false;
        this.element.properties.animationscontrols.resetVisual= true;
        this.element.properties.animationscontrols.maxX = this.element.properties.animation.maxX;
        this.element.properties.animationscontrols.minX = this.element.properties.animation.minX;
        if (this.element.properties.scoreReset) {
            Globals.instance.environment.setScoretoZero();
        }
        Globals.instance.environment.setEnemyCount(this.element.enemies.length - this.element.properties.animationscontrols.killedenemies, this.element.enemies.length);
        Globals.instance.environment.setGameOverReset();
    }
    updateScore(enemy = undefined) {
        if (enemy === undefined) {//only a hit
            Globals.instance.environment.setScore(10+this.element.properties.animationscontrols.killedenemies);
        } else {//EnemyElimination
            Globals.instance.environment.setScore(Math.round(this.element.properties.speed * 15 + this.element.properties.animationscontrols.killedenemies * 25));
        }
    }
    onEnemyColorChanged() {
        for (let i = 0; i < this.element.enemies.length; i++) {
            this.element.enemies[i].properties.colorChanged = true;
        }
    }
    //Support
    samePoint(A, B) {
        return (A.x === B.x && A.y === B.y && A.z === B.z);
    }
}


