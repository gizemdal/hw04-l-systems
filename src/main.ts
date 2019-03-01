import {vec3, vec4, mat4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import LSystem from './LSystem';
import Mesh from './geometry/Mesh';
import {setGL} from './globals';
import {readTextFile} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  iterations: 1,
  angle: 30,
  decoration: 1
};

let square: Square;
let screenQuad: ScreenQuad;
let branch: Mesh;
let flower: Mesh;
let leaf: Mesh;
let cylinder: Mesh;
let time: number = 0.0;
let prevIteration: number = 1;
let prevAngle: number = 30;
let prevDecor: number = 1;
let obj0: string = readTextFile('../obj_files/br.obj');
let obj1: string = readTextFile('../obj_files/magnolia.obj');
let obj2: string = readTextFile('../obj_files/cylinder.obj');
let obj3: string = readTextFile('../obj_files/leaf.obj');
let lsystem: LSystem; // l-system

function loadScene() {
  screenQuad = new ScreenQuad();
  let center = vec3.fromValues(0.0, 0.0, 0.0);
  branch = new Mesh(obj0, center); // the branch
  flower = new Mesh(obj1, center); // the flower
  leaf = new Mesh(obj3, center); // the leaf
  cylinder = new Mesh(obj2, center);
  screenQuad.create();
  branch.create();
  flower.create();
  leaf.create();
  cylinder.create();

  // Set up instanced rendering data arrays here.
  // This example creates a set of positional
  // offsets and gradiated colors for a 100x100 grid
  // of squares, even though the VBO data for just
  // one square is actually passed to the GPU
  let c0 : Float32Array = new Float32Array([6.0, 0.0, 0.0, 0.0]);
  let c1 : Float32Array = new Float32Array([0.0, 0.1, 0.0, 0.0]);
  let c2 : Float32Array = new Float32Array([0.0, 0.0, 6.0, 0.0]);
  let c3 : Float32Array = new Float32Array([0.0, -3.0, 0.0, 1.0]);
  let cCol : Float32Array = new Float32Array([0.5, 0.5, 0.5, 1.0]);
  cylinder.setInstanceVBOs(c0, c1, c2, c3, cCol);
  cylinder.setNumInstances(1);
}

function instanceRendering(decor: Mesh) {
  lsystem = new LSystem(controls.iterations, "B", controls.angle);
  lsystem.reset();
  lsystem.setupRules();
  lsystem.generateSystem();
  lsystem.drawSystem();
  let matrices = lsystem.getTransformations();
  let indices = lsystem.getIndices();
  let t0Array = []; // col0 array for branch
  let t1Array = []; // col1 array for branch
  let t2Array = []; // col2 array for branch
  let t3Array = []; // col3 array for branch
  let t0FlowArray = []; // col0 array for flower
  let t1FlowArray = []; // col1 array for flower
  let t2FlowArray = []; // col2 array for flower
  let t3FlowArray = []; // col3 array for flower
  let colorsArray = []; // colors array for branch
  let colorsFlowArray = []; // colors array for flower
  let nB: number = lsystem.getNumInstances(); // number of instances to be drawn for branch
  let nF: number = lsystem.getNumFlower(); // number of instances to be drawn for flower

  for(let i = 0; i < matrices.length; i++) {
    var mat = matrices[i];
    var idx = indices[i];
    if (idx == 0) {
      t0Array.push(mat[0]);
      t0Array.push(mat[1]);
      t0Array.push(mat[2]);
      t0Array.push(mat[3]);
      t1Array.push(mat[4]);
      t1Array.push(mat[5]);
      t1Array.push(mat[6]);
      t1Array.push(mat[7]);
      t2Array.push(mat[8]);
      t2Array.push(mat[9]);
      t2Array.push(mat[10]);
      t2Array.push(mat[11]);
      t3Array.push(mat[12]);
      t3Array.push(mat[13]);
      t3Array.push(mat[14]);
      t3Array.push(mat[15]);
      colorsArray.push(153.0 / 255.0);
      colorsArray.push(102.0 / 255.0);
      colorsArray.push(51.0 / 255.0);
      colorsArray.push(1.0); // Alpha channel
    } else if (idx == 1) {
      t0FlowArray.push(mat[0]);
      t0FlowArray.push(mat[1]);
      t0FlowArray.push(mat[2]);
      t0FlowArray.push(mat[3]);
      t1FlowArray.push(mat[4]);
      t1FlowArray.push(mat[5]);
      t1FlowArray.push(mat[6]);
      t1FlowArray.push(mat[7]);
      t2FlowArray.push(mat[8]);
      t2FlowArray.push(mat[9]);
      t2FlowArray.push(mat[10]);
      t2FlowArray.push(mat[11]);
      t3FlowArray.push(mat[12]);
      t3FlowArray.push(mat[13]);
      t3FlowArray.push(mat[14]);
      t3FlowArray.push(mat[15]);
      colorsFlowArray.push(1.0);
      colorsFlowArray.push(102.0 / 255.0);
      colorsFlowArray.push(204.0 / 255.0);
      colorsFlowArray.push(1.0); // Alpha channel
    }
  }

  let t0B: Float32Array = new Float32Array(t0Array);
  let t1B: Float32Array = new Float32Array(t1Array);
  let t2B: Float32Array = new Float32Array(t2Array);
  let t3B: Float32Array = new Float32Array(t3Array);
  let t0F: Float32Array = new Float32Array(t0FlowArray);
  let t1F: Float32Array = new Float32Array(t1FlowArray);
  let t2F: Float32Array = new Float32Array(t2FlowArray);
  let t3F: Float32Array = new Float32Array(t3FlowArray);
  let colorsB: Float32Array = new Float32Array(colorsArray);
  let colorsF: Float32Array = new Float32Array(colorsFlowArray);
  //square.setInstanceVBOs(offsets, colors);
  //square.setNumInstances(n * n); // grid of "particles"
  branch.setInstanceVBOs(t0B, t1B, t2B, t3B, colorsB);
  decor.setInstanceVBOs(t0F, t1F, t2F, t3F, colorsF);
  branch.setNumInstances(nB);
  decor.setNumInstances(nF);
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'iterations', 0, 5).step(1);
  gui.add(controls, 'angle', 0, 45).step(0.5);
  gui.add(controls, 'decoration', { Flower: 0, Leaf: 1});

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();
  const decorList = [flower, leaf];
  instanceRendering(decorList[controls.decoration]);

  //const camera = new Camera(vec3.fromValues(50, 50, 10), vec3.fromValues(50, 50, 0));
  const camera = new Camera(vec3.fromValues(10, 10, 10), vec3.fromValues(0, 0, 0));
  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  //gl.enable(gl.BLEND);
  //gl.blendFunc(gl.ONE, gl.ONE); // Additive blending
  gl.enable(gl.DEPTH_TEST);

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    if (prevIteration != controls.iterations) {
      prevIteration = controls.iterations;
      instanceRendering(decorList[controls.decoration]);
    }
    if (prevAngle != controls.angle) {
      prevAngle = controls.angle;
      instanceRendering(decorList[controls.decoration]);
    }
    if (prevDecor != controls.decoration) {
      prevDecor = controls.decoration;
      instanceRendering(decorList[controls.decoration]);
    }
    renderer.render(camera, flat, [screenQuad]);
    renderer.render(camera, instancedShader, [
      branch,
      decorList[controls.decoration],
      cylinder
    ]);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
