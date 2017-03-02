import { Entity } from './entity';
import { World } from 'src/world';
import { Subscription } from 'rxjs';
import * as controls from 'src/controls';
import * as utils from './utils';
import THREE = require('three');
import { LiveLoopCatagory } from 'src/generation/directory';
import LiveLoop from 'src/generation/LiveLoop';

export interface LiveLoopEntityDefinition {
  type: LiveLoopCatagory;
  mesh: THREE.Mesh;
}

/**
 * A LiveLoopEntity is made when a LiveLoopTemplate is selected in the world.
 * The LiveLoopEntity actually plays the live loop.
 */
export default class LiveLoopEntity implements Entity {
  type: LiveLoopCatagory;
  mesh: THREE.Mesh;
  liveloop: LiveLoop;
  subscription: Subscription;
  selected: boolean = false;
  amplitude: number = 0.5;
  fisted: boolean = false;
  world: World;

  constructor(definition: LiveLoopEntityDefinition) {
    this.type = definition.type;
    this.mesh = definition.mesh;
  }

  onAdd(world: World) {
    world.scene.add(this.mesh);
    this.liveloop = new LiveLoop(this.type);
    this.subscription = new Subscription();
    this.subscription.add(
      world.selectListener
        .observeSelections(this.mesh)
        .subscribe(event => this.selected = event.selected),
    );
    this.world = world;
    this.subscription.add(
      controls.controlEvents
        .filter(controls.eventIs.fist)
        .subscribe(controls.listenPose({
          start: () => {
            if (this.selected) {
              this.fisted = true;
            }
          },
          finish: () => {
            this.fisted = false;
          },
        })),
    );

    this.subscription.add(
      controls.controlEvents
        .filter(controls.eventIs.waveIn)
        .subscribe(event => {
          if (this.selected) {
            // Subtract effect
          }
        }),
    );

    this.subscription.add(
      controls.controlEvents
        .filter(controls.eventIs.waveOut)
        .subscribe(event => {
          if (this.selected) {
            // Add effect
          }
        }),
    );
    /**
     * Subscribe to live loop to get oscilloscope data to make LiveLoopEntity
     * pulse with amplitude.
     */
    this.liveloop.oscilloscopeData().subscribe(
      amplitude => {
        const flooredAmplitude = Math.max(amplitude, 0.01);
        const oldAmp = this.amplitude;
        const factor = flooredAmplitude / oldAmp;
        this.mesh.geometry.scale(factor, factor, factor);
        this.amplitude = flooredAmplitude;
      },
    );
  }

  onUpdate(delta: number) {
    if (this.fisted) {
      utils.projectMeshDistanceFromCamera(this.world.camera, this.mesh, 3);
    }
  }

  onRemove(world: World) {
    world.scene.remove(this.mesh);
    this.liveloop.delete();
    this.subscription.unsubscribe();
  }
}
