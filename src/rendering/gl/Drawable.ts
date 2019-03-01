import {gl} from '../../globals';

abstract class Drawable {
  count: number = 0;

  bufIdx: WebGLBuffer;
  bufPos: WebGLBuffer;
  bufNor: WebGLBuffer;
  bufTranslate: WebGLBuffer;
  bufT0: WebGLBuffer;
  bufT1: WebGLBuffer;
  bufT2: WebGLBuffer;
  bufT3: WebGLBuffer;
  bufCol: WebGLBuffer;
  bufUV: WebGLBuffer;

  idxGenerated: boolean = false;
  posGenerated: boolean = false;
  norGenerated: boolean = false;
  colGenerated: boolean = false;
  translateGenerated: boolean = false;
  t0Generated: boolean = false;
  t1Generated: boolean = false;
  t2Generated: boolean = false;
  t3Generated: boolean = false;
  uvGenerated: boolean = false;

  numInstances: number = 0; // How many instances of this Drawable the shader program should draw

  abstract create() : void;

  destory() {
    gl.deleteBuffer(this.bufIdx);
    gl.deleteBuffer(this.bufPos);
    gl.deleteBuffer(this.bufNor);
    gl.deleteBuffer(this.bufCol);
    gl.deleteBuffer(this.bufTranslate);
    gl.deleteBuffer(this.bufT0);
    gl.deleteBuffer(this.bufT1);
    gl.deleteBuffer(this.bufT2);
    gl.deleteBuffer(this.bufT3);
    gl.deleteBuffer(this.bufUV);
  }

  generateIdx() {
    this.idxGenerated = true;
    this.bufIdx = gl.createBuffer();
  }

  generatePos() {
    this.posGenerated = true;
    this.bufPos = gl.createBuffer();
  }

  generateNor() {
    this.norGenerated = true;
    this.bufNor = gl.createBuffer();
  }

  generateCol() {
    this.colGenerated = true;
    this.bufCol = gl.createBuffer();
  }

  generateTranslate() {
    this.translateGenerated = true;
    this.bufTranslate = gl.createBuffer();
  }

  generateT0() {
    this.t0Generated = true;
    this.bufT0 = gl.createBuffer();
  }

  generateT1() {
    this.t1Generated = true;
    this.bufT1 = gl.createBuffer();
  }

  generateT2() {
    this.t2Generated = true;
    this.bufT2 = gl.createBuffer();
  }

  generateT3() {
    this.t3Generated = true;
    this.bufT3 = gl.createBuffer();
  }

  generateUV() {
    this.uvGenerated = true;
    this.bufUV = gl.createBuffer();
  }

  bindIdx(): boolean {
    if (this.idxGenerated) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    }
    return this.idxGenerated;
  }

  bindPos(): boolean {
    if (this.posGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    }
    return this.posGenerated;
  }

  bindNor(): boolean {
    if (this.norGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    }
    return this.norGenerated;
  }

  bindCol(): boolean {
    if (this.colGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    }
    return this.colGenerated;
  }

  bindTranslate(): boolean {
    if (this.translateGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTranslate);
    }
    return this.translateGenerated;
  }

  bindT0(): boolean {
    if (this.t0Generated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufT0);
    }
    return this.t0Generated;
  }

  bindT1(): boolean {
    if (this.t1Generated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufT1);
    }
    return this.t1Generated;
  }

  bindT2(): boolean {
    if (this.t2Generated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufT2);
    }
    return this.t2Generated;
  }

  bindT3(): boolean {
    if (this.t3Generated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufT3);
    }
    return this.t3Generated;
  }

  bindUV(): boolean {
    if (this.uvGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufUV);
    }
    return this.uvGenerated;
  }

  elemCount(): number {
    return this.count;
  }

  drawMode(): GLenum {
    return gl.TRIANGLES;
  }

  setNumInstances(num: number) {
    this.numInstances = num;
  }
};

export default Drawable;
