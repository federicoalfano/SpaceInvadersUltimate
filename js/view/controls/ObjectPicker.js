import Observable from '../../Observable.js';

export default class ObjectPicker extends Observable {
    constructor(mediator, renderingContext) {
        super();
        this.mediator = mediator;
        this.renderingContext = renderingContext;

    }

    initialize() {

        this.renderingContext.renderer.domElement.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.renderingContext.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.renderingContext.renderer.domElement.addEventListener('mouseup',(e)=>this.onMouseUp(e));
        this.renderingContext.startClassicButton.addEventListener('click',(e)=>this.onClassicMode(e));
        this.renderingContext.startFuturisticButton.addEventListener('click',(e)=>this.onFuturisticMode(e));
        this.renderingContext.startCustomClassicButton.addEventListener('click',(e)=>this.onCustomClassicMode(e));
        this.renderingContext.startCustomFuturisticButton.addEventListener('click',(e)=>this.onCustomFuturisticMode(e));
        this.renderingContext.returnMenuButton.addEventListener('click',(e)=>this.onReturn(e));
        
    }

    onMouseUp(e){
        this.emit('mouseup', {})
    }

    onMouseDown(e) {

        this.emit('mousedown', {});
    }

    onMouseMove(e) {

        this.emit('mousemove', e);
    }
    onClassicMode(e) {
        this.renderingContext.inpageTitle[0].style.visibility = 'hidden';
        this.renderingContext.inpageTitle[1].style.visibility = 'hidden';
        this.renderingContext.startClassicButton.style.visibility = 'hidden';
        this.renderingContext.startFuturisticButton.style.visibility = 'hidden';
        this.renderingContext.startCustomClassicButton.style.visibility = 'hidden';
        this.renderingContext.startCustomFuturisticButton.style.visibility = 'hidden';
        this.renderingContext.heatBarContainer.style.visibility = 'visible';
        this.renderingContext.enemyCounter.style.visibility = 'visible';
        this.renderingContext.scoreCounter.style.visibility = 'visible';
        this.renderingContext.levelCounter.style.visibility = 'visible';
        this.emit('mountStorm', {custom:false});
    }
    onFuturisticMode(e) {
        this.renderingContext.inpageTitle[0].style.visibility = 'hidden';
        this.renderingContext.inpageTitle[1].style.visibility = 'hidden';
        this.renderingContext.startClassicButton.style.visibility = 'hidden';
        this.renderingContext.startFuturisticButton.style.visibility = 'hidden';
        this.renderingContext.startCustomClassicButton.style.visibility = 'hidden';
        this.renderingContext.startCustomFuturisticButton.style.visibility = 'hidden';
        this.renderingContext.heatBarContainer.style.visibility = 'visible';
        this.renderingContext.enemyCounter.style.visibility = 'visible';
        this.renderingContext.scoreCounter.style.visibility = 'visible';
        this.renderingContext.levelCounter.style.visibility = 'visible';
        this.emit('mountTPStorm', {custom:false});
    }
    onCustomClassicMode(e) {
        this.renderingContext.inpageTitle[0].style.visibility = 'hidden';
        this.renderingContext.inpageTitle[1].style.visibility = 'hidden';
        this.renderingContext.startClassicButton.style.visibility = 'hidden';
        this.renderingContext.startFuturisticButton.style.visibility = 'hidden';
        this.renderingContext.startCustomClassicButton.style.visibility = 'hidden';
        this.renderingContext.startCustomFuturisticButton.style.visibility = 'hidden';
        this.renderingContext.heatBarContainer.style.visibility = 'visible';
        this.renderingContext.enemyCounter.style.visibility = 'visible';
        this.renderingContext.scoreCounter.style.visibility = 'visible';
        this.renderingContext.levelCounter.style.visibility = 'visible';
        this.emit('mountStorm', {custom:true});
    }
    onCustomFuturisticMode(e) {
        this.renderingContext.inpageTitle[0].style.visibility = 'hidden';
        this.renderingContext.inpageTitle[1].style.visibility = 'hidden';
        this.renderingContext.startClassicButton.style.visibility = 'hidden';
        this.renderingContext.startFuturisticButton.style.visibility = 'hidden';
        this.renderingContext.startCustomClassicButton.style.visibility = 'hidden';
        this.renderingContext.startCustomFuturisticButton.style.visibility = 'hidden';
        this.renderingContext.heatBarContainer.style.visibility = 'visible';
        this.renderingContext.enemyCounter.style.visibility = 'visible';
        this.renderingContext.scoreCounter.style.visibility = 'visible';
        this.renderingContext.levelCounter.style.visibility = 'visible';
        this.emit('mountTPStorm', {custom:true});
    }
    onReturn(e) {
        this.renderingContext.heatBarContainer.style.visibility = 'hidden';
        this.renderingContext.enemyCounter.style.visibility = 'hidden';
        this.renderingContext.scoreCounter.style.visibility = 'hidden';
        this.renderingContext.levelCounter.style.visibility = 'hidden';
        this.renderingContext.gameOverText.style.visibility = 'hidden';
        this.renderingContext.gameOverTitle.style.visibility = 'hidden';
        this.renderingContext.returnMenuButton.style.visibility = 'hidden';
        this.renderingContext.enemyCounter.innerHTML = "ENEMIES: " + 0 + "/" + 0;
        this.renderingContext.scoreCounter.innerHTML = "SCORE: " + 0;
        this.renderingContext.levelCounter.innerHTML = "LEVEL: " + 1;
        this.renderingContext.inpageTitle[0].style.visibility = 'visible';
        this.renderingContext.inpageTitle[1].style.visibility = 'visible';
        this.renderingContext.startClassicButton.style.visibility = 'visible';
        this.renderingContext.startFuturisticButton.style.visibility = 'visible';
        this.renderingContext.startCustomClassicButton.style.visibility = 'visible';
        this.renderingContext.startCustomFuturisticButton.style.visibility = 'visible';
        this.emit('removeStorm', {});
    }
    onShowStartNextWave(e){
       this.renderingContext.startWaveButton.style.visibility = 'visible';
       let removable=function(){//Execute the passed function and turn invisible
           e.func();
           this.renderingContext.startWaveButton.style.visibility = 'hidden';
           this.renderingContext.startWaveButton.removeEventListener('click',removable,false);
       }.bind(this);
       this.renderingContext.startWaveButton.addEventListener('click',removable ,false);
    }
    //Reversal object interaction
    onScoreUpdate(e){
        this.renderingContext.scoreCounter.innerHTML="SCORE: " +e.score;
    }
    onLevelUpdate(e){
        this.renderingContext.levelCounter.innerHTML="LEVEL: " +e.level;
    }
    onTotalEnemiesUpdate(e){
        let toWrite="";
        if(e.spawned=== undefined || e.total === undefined) {
            toWrite = "ENEMIES: " + 0 + "/" + 0;
        } else {
            toWrite = "ENEMIES: " + e.spawned + "/" + e.total;
        }
        if(this.renderingContext.enemyCounter.innerHTML!==toWrite)
            this.renderingContext.enemyCounter.innerHTML=toWrite;
     }
    onHeatUpdate(e) {
        let ctx = this.renderingContext.heatBarContainer.getContext('2d');
        let filled = e.heat * this.renderingContext.heatBarContainer.width/100;
        ctx.clearRect(0, 0, this.renderingContext.heatBarContainer.width, this.renderingContext.heatBarContainer.height);
        ctx.fillStyle = "#"+e.color;
        ctx.fillRect(0, 0, filled, this.renderingContext.heatBarContainer.height);
        ctx.fillStyle = 'orangered';
        ctx.strokeStyle = 'black';
        ctx.font = "40px Mensch-Bold";
        if(e.overheat){
            let toWrite="OVERHEAT: "+e.heat;
            ctx.fillText(toWrite, 95, 45);
            ctx.strokeText(toWrite, 95, 45);
        } else {
            let toWrite = "HEAT: " + e.heat;
            ctx.fillText(toWrite, 170, 45);
            ctx.strokeText(toWrite, 170, 45);
        }
    }
    onGameOverUpdate(e) {
        this.renderingContext.gameOverText.innerHTML = e.end;
        this.renderingContext.gameOverText.style.visibility = 'visible';
        this.renderingContext.gameOverTitle.style.visibility = 'visible';
        this.renderingContext.returnMenuButton.style.visibility = 'visible';
    }
    onGameOverReset() {
        this.renderingContext.gameOverText.style.visibility = 'hidden';
        this.renderingContext.gameOverTitle.style.visibility = 'hidden';
        this.renderingContext.returnMenuButton.style.visibility = 'hidden';
    }
}


