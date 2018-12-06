import GroundMediator from './mediator/GroundMediator.js';
import TurretMediator from './mediator/TurretMediator.js';
import EnemyMediator from './mediator/EnemyMediator.js';
import StormMediator from './mediator/StormMediator.js';
import StormController from '../controller/StormController.js';
import TwoPointStormMediator from './mediator/TwoPointStormMediator.js';
import TpsController from '../controller/TpsController.js';
import EnvironmentMediator from './mediator/EnvironmentMediator.js';
import BulletMediator from './mediator/BulletMediator.js';
import StarMediator from './mediator/StarMediator.js';
import StarController from '../controller/StarController.js';

export default class ViewMediatorFactory {
        getMediator(element){
            switch (element.className) {
                case 'Environment':
                    return new EnvironmentMediator(element, this);
                case 'Ground':
                    return new GroundMediator(element, this);
                case 'Turret':
                    return new TurretMediator(element, this);
                case 'Enemy':
                    return new EnemyMediator(element, this);
                case 'Storm':
                    return new StormMediator(element, this, new StormController(element));     
                case 'TwoPointStorm':
                    return new TwoPointStormMediator(element, this, new TpsController(element));   
                case 'Bullet':
                    return new BulletMediator(element, this);
                case 'Star':
                    return new StarMediator(element, this, new StarController(element));
            }
        }
}

