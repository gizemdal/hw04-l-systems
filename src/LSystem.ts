import {vec3, mat4, vec4} from 'gl-matrix';
import {dot, length, angle, normalize} from 'gl-vec3';
import {transformMat4} from 'gl-vec4';
import {setAxisAngle} from 'gl-quat';
import {fromQuat, fromRotationTranslation, fromTranslation, scale, invert} from 'gl-mat4';
import ExpansionRule from './ExpansionRule';
import DrawingRule from './DrawingRule';
import Turtle from './Turtle';

let expansionRules : Map<string, [ExpansionRule]> = new Map(); // store expansion rules
let drawRules : Map<string, [DrawingRule]> = new Map(); // store drawing rules
let turtleHistory: Array<Turtle> = []; // store turtle history
let up: vec3 = vec3.fromValues(0.0, 1.0, 0.0); // global up vector
let matrices: Array<mat4> = [];
let indices: Array<number> = []; // keep indices of which instances are flowers
let rotAngle: number = 45; // rotation angle
function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

export default class LSystem {
	iter: number;
	axiom: string;
	expansion: ExpansionRule;
	draw: DrawingRule;
	turtle: Turtle;
	insBranch: number;
	insFlower: number;
	rotAngle: number;

  constructor(iter: number, axiom: string, rotAngle: number) {
  	this.iter = iter; // number of iterations
  	this.axiom = axiom; // axiom string
  	this.turtle = new Turtle(vec3.fromValues(0, -3, 0), vec3.fromValues(0, 1, 0), 1);
  	this.insBranch = 0;
  	this.insFlower = 0;
  	this.rotAngle = rotAngle;
  	//turtleHistory.push(this.turtle);
  }

  	addRule(c: string, rule: ExpansionRule) {
		var rules = expansionRules.get(c);
		if (rules) {
			rules.push(rule);
			expansionRules.set(c, rules);
		} else {
			expansionRules.set(c, [rule]);
		}
	}

	setupRules() {
		this.addRule('B', new ExpansionRule('B', 'F[+F][-F]'));
  		this.addRule('F', new ExpansionRule('F', 'F[+FDW]-FD'));
  		this.addRule('F', new ExpansionRule('F', 'F[+FDW][-FDS]'));
  		this.addRule('F', new ExpansionRule('F', 'FD'));
		this.addDraw('F', new DrawingRule('F', this.turtle.moveForward.bind(this.turtle)));
		this.addDraw('+', new DrawingRule('+', this.turtle.rotateCWX.bind(this.turtle)));
		this.addDraw('-', new DrawingRule('-', this.turtle.rotateCCWX.bind(this.turtle)));
		this.addDraw('W', new DrawingRule('W', this.turtle.rotateCWY.bind(this.turtle)));
		this.addDraw('S', new DrawingRule('S', this.turtle.rotateCCWY.bind(this.turtle)));
		this.addDraw('+', new DrawingRule('+', this.turtle.rotateCWZ.bind(this.turtle)));
		this.addDraw('-', new DrawingRule('-', this.turtle.rotateCCWZ.bind(this.turtle)));
		this.addDraw('[', new DrawingRule('[', this.saveHistory.bind(this)));
		this.addDraw(']', new DrawingRule(']', this.getHistory.bind(this)));
		this.addDraw('D', new DrawingRule('D', this.drawFlower.bind(this)));
	}

	addDraw(c: string, rule: DrawingRule) {
		var rules = drawRules.get(c);
		if (rules) {
			rules.push(rule);
			drawRules.set(c, rules);
		} else {
			drawRules.set(c, [rule]);
		}
	}

	expandRule(str: string) {
		var newStr = '';
		for (var i = 0; i < str.length; i++) {
			var rules = expansionRules.get(str.charAt(i));
			if (rules) {
				var p = rules.length;
				newStr += rules[getRandomInt(p)].getRule();
			} else {
				newStr += str.charAt(i);
			}
		}
		return newStr;
	}

	generateSystem() {
		var str = this.axiom;
		for (var i = 0; i < this.iter; i++) {
			var res = this.expandRule(str);
			str = res;
		}
		this.axiom = str;
	}

	drawSystem() {
		var str = this.axiom;
		for (var i = 0; i < str.length; i++) {
			var key = str.charAt(i);
			var func = drawRules.get(key);
			if (func) {
				var toCall = func[getRandomInt(func.length)].getFunc();
				var angle = this.rotAngle;
				if (angle != 0) {
					angle = 3.14 / (180.0 / angle);
				}
				var isDraw = toCall(angle);
				if (isDraw == 1) {
					if (key === 'D') {
						this.insFlower += 1;
						indices.push(1); // 1 index represents flowers
					} else {
						this.drawTurtle();
						this.insBranch += 1;
						indices.push(0); // 0 index represents branches
					}
				}
			}
		}
	}

	saveHistory() {
		var old = new Turtle(this.turtle.position, this.turtle.orientation, this.turtle.depth);
		turtleHistory.push(old);
		this.turtle.depth += 1.0;
		return 0;
	}

	getHistory() {
		var old = turtleHistory.pop();
		this.turtle.copyTurtle(old);
		return 0;
	}

	drawTurtle() {
		var ang = angle(this.turtle.orientation, up);
			var s: number = Math.sin(ang / 2.0); // sine
			var c: number = Math.cos(ang / 2.0); // cosine
			var quat = vec4.fromValues(0, 0, 0, 0);
			quat = setAxisAngle(quat, this.turtle.rotAxis, ang);
			var d = this.turtle.depth * 0.75;
			var vec4Pos = vec4.fromValues(this.turtle.position[0], this.turtle.position[1], this.turtle.position[2], 1.0);
			var transform = mat4.create();
			transform = fromRotationTranslation(transform, quat, vec4Pos);
			var d = this.turtle.depth;
			transform = scale(transform, transform, vec3.fromValues(0.5 / d, 0.5 / d, 0.5 / d));
			matrices.push(transform);
		return 1;
	}

	drawFlower(a: number) {
		var ang = angle(this.turtle.orientation, up);
		var s: number = Math.sin(ang / 2.0); // sine
		var c: number = Math.cos(ang / 2.0); // cosine
		var quat = vec4.fromValues(0, 0, 0, 0);
		quat = setAxisAngle(quat, this.turtle.rotAxis, ang);
		var d = this.turtle.depth;
		var vec4Pos = vec4.fromValues(this.turtle.position[0] + this.turtle.orientation[0] * 2.0 /d, this.turtle.position[1] + this.turtle.orientation[1] * 2.0 / d, this.turtle.position[2] + this.turtle.orientation[2] * 2.0 / d, 1.0);
		var transform = mat4.create();
		transform = fromRotationTranslation(transform, quat, vec4Pos);
		transform = scale(transform, transform, vec3.fromValues(0.005 / d, 0.005 / d, 0.005 / d));
		matrices.push(transform);
		return 1;
	}

	getTransformations() {
		return matrices;
	}

	reset() {
		matrices = [];
		indices = [];
		turtleHistory = [];
		expansionRules = new Map();
		drawRules = new Map();
	}

	getIndices() {
		return indices;
	}

	getNumInstances() {
		return this.insBranch;
	}

	getNumFlower() {
		return this.insFlower;
	}
};