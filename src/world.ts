import * as THREE from 'three';
import 'src/vendor/three-vreffect';
import 'src/vendor/three-vrcontrols';
import 'webvr-polyfill';

/* Uncomment once shape.ts exists:
import { Shape } from 'src/shape.ts';*/

export class World {

  // Each World will have a scene, camera, and renderer
  // (set up at construction time):
  // NOTE: These are private members.
  private scene : THREE.Scene;
  private camera : THREE.PerspectiveCamera;
  private renderer : THREE.WebGLRenderer;
  private effect: THREE.VREffect;
  private controls: THREE.VRControls;

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
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    console.log(THREE);
    this.effect = new THREE.VREffect(this.renderer);
    this.effect.setSize(window.innerWidth, window.innerHeight);
    this.controls = new THREE.VRControls(this.camera);

    const makeCube = (x: number, y: number, z: number) => {
      const geometry = new THREE.BoxGeometry( 1, 1, 1 );
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh( geometry, material );
      cube.position.z = z;
      cube.position.y = y;
      cube.position.x = x;

      this.scene.add(cube);
    }
    // Add to HTML:
    document.body.appendChild( this.renderer.domElement );



    makeCube(5, 0, 0);
    makeCube(0, 5, 0);
    makeCube(0, 0, 5);
    makeCube(-5, 0, 0);
    makeCube(0, -5, 0);
    makeCube(0, 0, -5);


    this.render();

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

  // Render world:
  render = () => {
    requestAnimationFrame( this.render );
    this.controls.update();
    this.effect.render(this.scene, this.camera);
  }
}
