import { Factory } from './core/Factory';
import './style.css'

const controls = Factory.createControls();
const canvasQuery = '#canvas';
const canvas = document.querySelector(canvasQuery) as HTMLElement;
const view = Factory.createView(canvas, controls);
const world = Factory.createWorld();
view.render(world);
const geometry = { width: 1, height: 1, depth: 1 };
const material = { color: 0x00ff00 };
const cube = Factory.createBox({ geometry, material })
world.getMainGroup().add(cube);
controls.getCamera().position.z = 5;
view.render(world);
