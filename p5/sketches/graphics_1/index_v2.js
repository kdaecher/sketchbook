"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p5_1 = __importDefault(require("p5"));
let img;
let cam;
const sketch = (p) => {
    let angle = 0;
    p.setup = () => __awaiter(void 0, void 0, void 0, function* () {
        img = yield p.loadImage('IMG_8403.jpg');
        p.createCanvas(400, 400, p.WEBGL);
        cam = p.createCapture(p.VIDEO);
        cam.size(400, 400);
        cam.hide();
    });
    p.draw = () => {
        let dx = p.mouseX - p.width / 2;
        console.log('dx', dx);
        let dy = p.mouseY - p.width / 2;
        console.log('dy', dy);
        let v = p.createVector(-dx, -dy, -1);
        v.normalize();
        console.log(v);
        p.background(175);
        p.noStroke();
        p.orbitControl();
        // p.ambientLight(255);
        // p.directionalLight(255,0,0,v);
        p.pointLight(255, 0, 0, dx, dy, 0);
        p.push();
        p.rotateX(angle * 0.05);
        p.rotateY(angle * 0.3);
        p.rotateZ(angle * 0.02);
        p.texture(cam);
        p.box(100);
        p.pop();
        p.push();
        p.translate(-200, 0);
        p.sphere(50);
        p.ambientMaterial(255, 0, 0);
        p.pop();
        angle += 0.07;
    };
};
new p5_1.default(sketch);
