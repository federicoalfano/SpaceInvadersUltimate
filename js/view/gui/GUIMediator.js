import Observable from '../../Observable.js';
import Globals from '../../globals/Globals.js';

export default class GUIMediator extends Observable {

    constructor(element) {
        super();
        this.element = element;
        this.gui = new dat.gui.GUI();
        this.folders = this.makeGUI();

    }

    makeGUI() {
        let folder = [{
                folderName: 'Sun controls',
                parts: [
                    {type: 'slider', properties: Globals.instance.environment.star.properties, prop_name: 'speed', min: -5, max: 5, step: 0.01, activator: false},
                    {type: 'color', properties: Globals.instance.environment.star.properties, prop_name: 'lightcolor', func: function (value) {
                            Globals.instance.environment.star.changeColor(Globals.instance.environment.star.properties.lightcolor);
                        }.bind(this)},
                    {type: 'button', properties: {
                            Pause: function () {
                                Globals.instance.environment.star.stop();
                            }.bind(this),
                        }, prop_name: 'Pause'},
                ]
            }];
        return folder;
    }

    populate() {
        for (let i = 0; i < this.folders.length; i++) {
            let folder = this.gui.addFolder(this.folders[i].folderName);
            for (let j = 0; j < this.folders[i].parts.length; j++) {
                switch (this.folders[i].parts[j].type) {
                    case 'slider':
                        if (this.folders[i].parts[j].activator) {
                            folder.add(this.folders[i].parts[j].properties, this.folders[i].parts[j].prop_name, this.folders[i].parts[j].min, this.folders[i].parts[j].max).step(this.folders[i].parts[j].step).onChange(this.folders[i].parts[j].func);
                        } else {
                            folder.add(this.folders[i].parts[j].properties, this.folders[i].parts[j].prop_name, this.folders[i].parts[j].min, this.folders[i].parts[j].max).step(this.folders[i].parts[j].step);
                        }
                        break;
                    case 'button':
                        folder.add(this.folders[i].parts[j].properties, this.folders[i].parts[j].prop_name);
                        break;
                    case 'color':
                        folder.addColor(this.folders[i].parts[j].properties, this.folders[i].parts[j].prop_name).onChange(this.folders[i].parts[j].func);
                        break;
                }
            }
        }
    }
    destroy() {
        this.gui.destroy();
        this.gui = undefined;
    }

}