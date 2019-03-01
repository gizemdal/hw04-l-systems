
import {vec3, mat4, vec4} from 'gl-matrix';
import {dot, length, angle, normalize} from 'gl-vec3';
import {transformMat4} from 'gl-vec4';
import {setAxisAngle} from 'gl-quat';
import {fromQuat, fromTranslation, fromXRotation, fromYRotation, fromZRotation} from 'gl-mat4';

let count: number = 0;
export default class Turtle {
	position: vec3;
	orientation: vec3;
	depth: number;
  rotAxis: vec3;

  constructor(p: vec3, orient: vec3, rec: number) {
    this.position = p;
    this.orientation = orient;
    this.depth = rec;
    this.rotAxis = vec3.fromValues(0, 1, 0);
  }

  moveForward(a: number) {
    this.position = vec3.fromValues(this.position[0] + this.orientation[0] * 1.5 / this.depth, this.position[1] + this.orientation[1] * 1.5 / this.depth, this.position[2] + this.orientation[2] * 1.5 / this.depth);
    return 1;
  }

  rotateCWX(a: number) {
    var rotated = vec4.fromValues(this.orientation[0], this.orientation[1], this.orientation[2], 1.0);
    var rot = mat4.create();
    rot = fromXRotation(rot, a);
    rotated = transformMat4(rotated, rotated, rot);
    this.orientation = vec3.fromValues(rotated[0], rotated[1], rotated[2]);
    this.orientation = normalize(this.orientation, this.orientation);
    this.rotAxis[0] = 1;
    this.rotAxis[1] = 0;
    this.rotAxis[2] = 0;
    //this.position[0] -= 0.2;
    return 0;
  }

  rotateCCWX(a: number) {
    var rotated = vec4.fromValues(this.orientation[0], this.orientation[1], this.orientation[2], 1.0);
    var rot = mat4.create();
    rot = fromXRotation(rot, -a);
    rotated = transformMat4(rotated, rotated, rot);
    this.orientation = vec3.fromValues(rotated[0], rotated[1], rotated[2]);
    this.orientation = normalize(this.orientation, this.orientation);
    this.rotAxis[0] = -1;
    this.rotAxis[1] = 0;
    this.rotAxis[2] = 0;
    //this.position[0] += 0.2;
    return 0;
  }

  rotateCWY(a: number) {
    var rotated = vec4.fromValues(this.orientation[0], this.orientation[1], this.orientation[2], 1.0);
    var rot = mat4.create();
    rot = fromYRotation(rot, a);
    rotated = transformMat4(rotated, rotated, rot);
    this.orientation = vec3.fromValues(rotated[0], rotated[1], rotated[2]);
    this.orientation = normalize(this.orientation, this.orientation);
    this.rotAxis[0] = 0;
    this.rotAxis[1] = 1;
    this.rotAxis[2] = 0;
    //this.position[1] -= 0.1;
    return 0;
  }

  rotateCCWY(a: number) {
    var rotated = vec4.fromValues(this.orientation[0], this.orientation[1], this.orientation[2], 1.0);
    var rot = mat4.create();
    rot = fromYRotation(rot, -a);
    rotated = transformMat4(rotated, rotated, rot);
    this.orientation = vec3.fromValues(rotated[0], rotated[1], rotated[2]);
    this.orientation = normalize(this.orientation, this.orientation);
    this.rotAxis[0] = 0;
    this.rotAxis[1] = -1;
    this.rotAxis[2] = 0;
    //this.position[1] += 0.1;
    return 0;
  }

  rotateCWZ(a: number) {
    var rotated = vec4.fromValues(this.orientation[0], this.orientation[1], this.orientation[2], 1.0);
    var rot = mat4.create();
    rot = fromZRotation(rot, a);
    rotated = transformMat4(rotated, rotated, rot);
    this.orientation = vec3.fromValues(rotated[0], rotated[1], rotated[2]);
    this.orientation = normalize(this.orientation, this.orientation);
    this.rotAxis[0] = 0;
    this.rotAxis[1] = 0;
    this.rotAxis[2] = 1;
    //this.position[2] -= 0.2;
    return 0;
  }

  rotateCCWZ(a: number) {
    var rotated = vec4.fromValues(this.orientation[0], this.orientation[1], this.orientation[2], 1.0);
    var rot = mat4.create();
    rot = fromZRotation(rot, -a);
    rotated = transformMat4(rotated, rotated, rot);
    this.orientation = vec3.fromValues(rotated[0], rotated[1], rotated[2]);
    this.orientation = normalize(this.orientation, this.orientation);
    this.rotAxis[0] = 0;
    this.rotAxis[1] = 0;
    this.rotAxis[2] = -1;
    //this.position[2] += 0.2;
    return 0;
  }

  copyTurtle(other: Turtle) {
    vec3.copy(this.position, other.position);
    vec3.copy(this.orientation, other.orientation);
    this.depth = other.depth;
  }
};