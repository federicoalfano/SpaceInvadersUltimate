import ParentModel from './ParentModel.js';
import Globals from '../globals/Globals.js';

export default class Environment extends ParentModel {

    constructor(name, properties = {}){
        super(name, properties);
        this.className = 'Environment';
        this.score = 0;
    }

    addGround(ground) {
        this.ground = ground;
        this.emit('GroundAdded', {ground});
    }

    addStar(star) {
        this.star=star;
        this.emit('StarAdded', {star});
    }
    removeStar(star) {
        this.star=undefined;
        this.emit('StarRemoved', {star});
    }

    addTurret(turret) {
        this.turret = turret;
        this.emit('TurretAdded', {turret});
    }

    addStorm(storm) {
        this.storm = storm;
        this.star.changeColor(this.star.properties.lightcolor);
        this.emit('StormAdded', {storm});
    }
    removeStorm(storm) {
        this.storm = undefined;
        this.emit('StormRemoved', {storm});
    }

    setScore(score) {
        this.score += score;
        this.emit("scoreUpdate", {score: this.score});
    }
    setScoretoZero() {
        this.score = 0;
        this.emit("scoreUpdate", {score: this.score});
    }
    setEnemyCount(spawned, total) {
        this.emit("totalEnemiesUpdate", {spawned: spawned, total: total});
    }
    setLevel(level) {
        this.emit("levelUpdate", {level: level});
    }
    setHeat(overheat, perc, hexcolor) {
        this.emit('heatUpdate', {overheat: overheat, heat: perc, color: hexcolor});
    }
    setGameOver(ending) {
        this.emit("gameOver", {end: ending});
        this.emit("gameOverSound",{});
    }
    setGameOverReset() {
        this.emit("gameOverReset");
    }

    showStartNextStormLevel(f,level) {//function as input
        let fun=function(){
            f();
            this.star.changeColor(Globals.instance.levelStarColors[level-1]);
        }.bind(this);
        this.emit("showStartNextWave", {func: fun});
    }
}


