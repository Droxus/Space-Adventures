import './style.css'
import { Factory } from './core/Factory';

const game = Factory.createGame();
game.start();