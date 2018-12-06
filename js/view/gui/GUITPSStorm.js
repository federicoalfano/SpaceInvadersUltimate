import GUIMediator from'./GUIMediator.js';
import Globals from '../../globals/Globals.js';
import Enemy from '../../model/Enemy.js';
export default class GUITPSStorm extends GUIMediator {

    constructor(element) {
        super(element);
        this.populate();
    }
    makeGUI() {
        let folders = [{
                folderName: 'Space Invaders Futuristic Mode',
                parts: [
                    {type: 'slider', properties: this.element.properties, prop_name: 'maxspeed', min: 1, max: 5, step: 0.1, activator: false},
                    {type: 'slider', properties: this.element.properties, prop_name: 'randomMovements', min: 5, max: 50, step: 1, activator: false},
                    {type: 'slider', properties: this.element.properties, prop_name: 'maxactiveenemies', min: 1, max: 10, step: 1, activator: true, func: function (value) {
                            this.element.changedProperty('maxactiveenemies');
                        }.bind(this)},
                    {type: 'slider', properties: this.element.properties, prop_name: 'enemynumber', min: 1, max: 100, step: 1, activator: true, func: function (value) {
                            this.element.changedProperty('enemynumber');
                        }.bind(this)},
                    {type: 'button', properties: {
                            Start_or_Pause: function () {
                                this.element.start_pause();
                            }.bind(this),
                        }, prop_name: 'Start_or_Pause'},
                    {type: 'button', properties: {
                            Reset: function () {
                                this.element.reset(true);
                            }.bind(this),
                        }, prop_name: 'Reset'},
                ]
            }, {
                folderName: 'Invader Options',
                parts: [
                    {type: 'color', properties: Globals.instance.enemyColors, prop_name: 'normal', func: function (value) {
                            this.element.updateStormColors();
                        }.bind(this)},
                    {type: 'color', properties: Globals.instance.enemyColors, prop_name: 'damaged', func: function (value) {
                            this.element.updateStormColors();
                        }.bind(this)},
                    {type: 'color', properties: Globals.instance.enemyColors, prop_name: 'almostDead', func: function (value) {
                            this.element.updateStormColors();
                        }.bind(this)},
                ]
            }];
        folders.push(super.makeGUI()[0]);
        return folders;
    }
}