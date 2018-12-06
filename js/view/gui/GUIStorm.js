import GUIMediator from'./GUIMediator.js';
import Globals from '../../globals/Globals.js';
export default class GUIStorm extends GUIMediator {

    constructor(element) {
        super(element);
        this.populate();
    }
    makeGUI() {
        let folders = [{
                folderName: 'Space Invaders Classic Mode',
                parts: [
                    {type: 'slider', properties: this.element.properties, prop_name: 'speed', min: 10, max: 20, step: 1, activator: false},
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