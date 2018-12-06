import MainView from '../view/MainView.js';
import Globals from '../globals/Globals.js'
import Storm from '../model/Storm.js';
import TwoPointStorm from '../model/TwoPointStorm.js';

export default class EnvironmentController {
    constructor(environment) {
        this.environment = environment;
        this.view = new MainView(this, environment);
        this.view.initialize();
    }
    onMouseDown() {
        this.environment.turret.shoot();
    }

    onMouseMove(e) {
        let mouse = {};
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.environment.turret.mouseMoving(mouse);
    }
    onMouseUp() {
        this.environment.turret.rest();
    }
    onMountStorm(e) {
        for (let propertyName in Globals.instance.firstStormProperties) {
            if (e.custom) {
                if (Globals.instance.backupCustomStormProperties[propertyName] !== undefined) {
                    if (propertyName === 'animationscontrols' || propertyName === 'animation') {
                        for (let newpropertyName in Globals.instance.backupCustomStormProperties[propertyName]) {
                            Globals.instance.firstStormProperties[propertyName][newpropertyName] = Globals.instance.backupCustomStormProperties[propertyName][newpropertyName];
                        }
                    } else {
                        Globals.instance.firstStormProperties[propertyName] = Globals.instance.backupCustomStormProperties[propertyName];
                    }
                }
            } else {
                if (propertyName !== 'animationscontrols'&& propertyName !== 'animation') {
                    if (Globals.instance.firstStormProperties.custom)
                        Globals.instance.backupCustomStormProperties[propertyName] = Globals.instance.firstStormProperties[propertyName];
                    Globals.instance.firstStormProperties[propertyName] = Globals.instance.StormProperties[0][propertyName];
                } else {
                    for (let newpropertyName in Globals.instance.firstStormProperties[propertyName]) {
                        if (Globals.instance.firstStormProperties.custom)
                            Globals.instance.backupCustomStormProperties[propertyName][newpropertyName] = Globals.instance.firstStormProperties[propertyName][newpropertyName];
                        Globals.instance.firstStormProperties[propertyName][newpropertyName] = Globals.instance.StormProperties[0][propertyName][newpropertyName];
                    }
                }
            }
        }
        this._onMountStormDefaults(e);
        this.environment.addStorm(new Storm('storm_classic'));
    }
    onMountTPStorm(e) {
        for (let propertyName in Globals.instance.firstTpsProperties) {
            if (e.custom) {
                if (Globals.instance.backupCustomTpsProperties[propertyName] !== undefined) {
                    if (propertyName === 'animationscontrols') {
                        for (let newpropertyName in Globals.instance.backupCustomTpsProperties[propertyName]) {
                            Globals.instance.firstTpsProperties[propertyName][newpropertyName] = Globals.instance.backupCustomTpsProperties[propertyName][newpropertyName];
                        }
                    } else {
                        Globals.instance.firstTpsProperties[propertyName] = Globals.instance.backupCustomTpsProperties[propertyName];
                    }
                }
            } else {
                if (propertyName !== 'animationscontrols') {
                    if (Globals.instance.firstTpsProperties.custom)
                        Globals.instance.backupCustomTpsProperties[propertyName] = Globals.instance.firstTpsProperties[propertyName];
                    Globals.instance.firstTpsProperties[propertyName] = Globals.instance.TpsProperties[0][propertyName];
                } else {
                    for (let newpropertyName in Globals.instance.firstTpsProperties[propertyName]) {
                        if (Globals.instance.firstTpsProperties.custom)
                            Globals.instance.backupCustomTpsProperties[propertyName][newpropertyName] = Globals.instance.firstTpsProperties[propertyName][newpropertyName];
                        Globals.instance.firstTpsProperties[propertyName][newpropertyName] = Globals.instance.TpsProperties[0][propertyName][newpropertyName];
                    }
                }
            }
        }
        this._onMountStormDefaults(e);
        this.environment.addStorm(new TwoPointStorm('storm_futuristic'));
    }
    _onMountStormDefaults(e) {
        for (let propertyName in Globals.instance.backupEnemyColors) {
            if (e.custom) {
                Globals.instance.enemyColors[propertyName] = Globals.instance.backupCustomEnemyColors[propertyName];
            } else {
                Globals.instance.backupCustomEnemyColors[propertyName] = Globals.instance.enemyColors[propertyName]
                Globals.instance.enemyColors[propertyName] = Globals.instance.backupEnemyColors[propertyName];
            }
        }
        for (let propertyName in Globals.instance.backupCustomStarProperties) {
            if (e.custom) {
                Globals.instance.firstStarProperties[propertyName] = Globals.instance.backupCustomStarProperties[propertyName];
            } else {
                Globals.instance.backupCustomStarProperties[propertyName] = Globals.instance.firstStarProperties[propertyName]
                Globals.instance.firstStarProperties[propertyName] = Globals.instance.backupStarProperties[propertyName];
            }
        }
    }
    onRemoveStorm() {
        this.environment.setScore(-Globals.instance.environment.score);
        this.environment.removeStorm(this.environment.storm);
    }
}

