jest.mock('three');

import * as sinon from 'sinon';
import * as THREE from 'three';
import { VREffect } from 'src/vendor/three-vreffect';
import { VRControls } from 'src/vendor/three-vrcontrols';
import VrEnvironment from '../VrEnvironment';

function createMockEnvironment() {
  const renderer = sinon.createStubInstance(THREE.WebGLRenderer);
  const camera = sinon.createStubInstance(THREE.Camera);
  const scene = sinon.createStubInstance(THREE.Scene);
  const effect = sinon.createStubInstance(VREffect);
  const controls = sinon.createStubInstance(VRControls);
  const window: any = { };

  return {
    renderer,
    camera,
    scene,
    effect,
    controls,
    window,
    environment: new VrEnvironment(
      renderer,
      camera,
      scene,
      effect,
      controls,
      window,
    ),
  };
}

it('should initialise when init is called', () => {
  const { environment } = createMockEnvironment();

  const mock = sinon.mock(environment);
  mock.expects('initScreens').once();

  environment.init();

  mock.verify();
});

it('should use screens when they exist', async () => {
  const { environment, window } = createMockEnvironment();

  const display = {
    capabilities: { canPresent: true },
  };
  window.navigator = {
    getVRDisplays: async () => [display],
  };

  const mock = sinon.mock(environment);
  mock.expects('setDisplay').once().withExactArgs(display);

  await (environment as any).initScreens();

  mock.verify();
});

it('should call the correct methods in the animator', () => {
  const { environment, effect, controls, scene, camera } = createMockEnvironment();

  const renderFn = sinon.spy();
  effect.requestAnimationFrame = sinon.spy();
  effect.render = sinon.spy();
  controls.update = sinon.spy();

  environment.createAnimator(renderFn).start();

  sinon.assert.calledOnce(renderFn);
  sinon.assert.calledOnce(effect.requestAnimationFrame);
  sinon.assert.calledOnce(effect.render);
  sinon.assert.calledOnce(controls.update);
});
