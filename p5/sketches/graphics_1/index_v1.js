"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p5_1 = __importDefault(require("p5"));
const sketch = (p) => {
    let angle = 0;
    p.setup = () => {
        p.createCanvas(400, 400, p.WEBGL);
    };
    p.draw = () => {
        let dx = p.mouseX;
        let dy = p.mouseY;
        let v = p.createVector(-dx, -dy, 0);
        v.normalize;
        p.background(175);
        p.noStroke();
        // p.ambientLight(0,0,255);
        // p.pointLight(0,0,255,400,0,200); 
        // p.pointLight(255,0,0, -400, 0,0);
        // p.pointLight(0,255,0,0,0,400);
        p.directionalLight(255, 0, 0, v);
        p.ambientLight(0, 0, 255);
        // p.fill(255, 0, 150);
        // p.normalMaterial();
        // p.rectMode(p.CENTER);
        // p.translate(0, 0, p.mouseX);
        p.rotateX(angle * 0.05);
        p.rotateY(angle * 0.3);
        p.rotateZ(angle * 0.02);
        // p.rect(0, 0, 100, 100);
        // p.box(200);
        p.torus(70, 30);
        // p.sphere(100);
        p.ambientMaterial(255, 255, 255);
        // p.specularMaterial(255);
        angle += 0.07;
    };
};
new p5_1.default(sketch);
