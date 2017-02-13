import * as THREE from 'three';
import VrEnvironment from './VrEnvironment';
import window from 'src/window';

/* Uncomment once shape.ts exists:
import { Shape } from 'src/shape.ts';*/

export class World {

  // Each World will have a scene, camera, and renderer
  // (set up at construction time):
  // NOTE: These are private members.
  private scene : THREE.Scene;
  private camera : THREE.PerspectiveCamera;
  private renderer : THREE.WebGLRenderer;
  private vrEnvironment: VrEnvironment;

  // Each World will also keep track of what shapes are currently in it:
  // NOTE: This is a private member.
  /* Uncomment once shape.ts exists:
  private shapes : Array<Shape>;*/

  constructor() {
    // Basic set up of scene, camera, and renderer:
    this.scene = new THREE.Scene();

    // NOTE: arguments to perspective camera are:
    // Field of view, aspect ratio, near and far clipping plane
    this.camera = new THREE.PerspectiveCamera( 200,
      window.innerWidth / window.innerHeight, 0.1, 1000 );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.vrEnvironment = new VrEnvironment(this.renderer, this.camera, this.scene);
    this.vrEnvironment.init();
    this.vrEnvironment.setSize(window.innerWidth, window.innerHeight);
  }

  // Public methods:

  // Add shape to world:
  /* Uncomment once shape.ts exists:
  addShape (shape : Shape) {
    // First add to scene:
    this.scene.add(Shape);
    // Then add to shapes array:
    this.shapes.push(Shape);
  }*/

  /**
   * Update the objects in the world
   */
  update(delta: number) {
    // Do something
  }

  /**
   * Start rendering and updating the world
   */
  start() {
    window.document.body.appendChild(this.renderer.domElement);

    this.vrEnvironment
      .createAnimator(delta => this.update(delta))
      .start();
  }
}
