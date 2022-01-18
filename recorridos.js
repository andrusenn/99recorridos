/*
99 recorridos
Andrés Senn - 2022 - https://www.fxhash.xyz/
Projet code: https://github.com/andrusenn/99recorridos
*/
let particles;
let iterations = 99 * 3;
let num_p = 99;
let p = [];
let seed;
let fc = 1;
let sz = 1000 / 2;
function setup() {
	// fxhash features
	window.$fxhashFeatures = {
		noiseGEN: fxrand(),
	};
	seed = int(window.$fxhashFeatures.noiseGEN * 1000000000000);
	const cv = createCanvas(2160, 2160);
	cv.parent("cv");
	cv.id("_99recorridos");
	cv.class("_99recorridos");
	pixelDensity(1);
	init();
	//
	console.log(
		`99 recorridos\nAndrés Senn\nfxhash 01/2022\nProjet code: https://github.com/andrusenn/99recorridos`,
	);
}
function init() {
	noiseSeed(seed);
	randomSeed(seed);
	noStroke();
	let bg = 0;
	if (random(1) > 0.5) {
		bg = 255;
	}
	background(bg);
	document.getElementsByTagName("body")[0].style.background =
		"rgb(" + bg + "," + bg + "," + bg + ")";
	p = [];
	for (let i = 0; i < num_p; i++) {
		p.push(createVector(random(-sz, sz), random(-sz, sz)));
	}
	particles = [];
	for (let i = 0; i < num_p; i++) {
		particles.push(new Particle(0, random(-sz, sz) * 0.5, p));
	}
}
function draw() {
	render();
	if (fc > iterations) {
		noLoop();
		if (!isFxpreview) {
			fxpreview();
		}
	}
}
function render() {
	push();
	translate(width / 2, height / 2);
	scale(2.3);
	for (let i = 0; i < particles.length; i++) {
		let d = dist(particles[i].pos.x, particles[i].pos.y, 0, 0);
		if (d < sz) {
			particles[i].update();
			noStroke();
			fill(0, map(particles[i].diam, 0, particles[i].maxdiam / 2, 50, 5));
			let shadow = particles[i].diam / 4;
			circle(
				particles[i].pos.x + shadow,
				particles[i].pos.y + shadow,
				particles[i].diam * 1.5,
			);
			circle(
				particles[i].pos.x + shadow * 3,
				particles[i].pos.y + shadow * 3,
				particles[i].diam * 2.5,
			);
			let c = 255;
			if (fc % 200 < 20) {
				let n = noise(
					particles[i].pos.x * 0.01,
					particles[i].pos.y * 0.01,
				);
				c = 255 * n;
			}
			fill(c);
			circle(particles[i].pos.x, particles[i].pos.y, particles[i].diam);
			push();
			if (fc % 3 == 0) {
				stroke(random(255), 100);
				if (fc % 105 == 0) {
					line(
						particles[i].pos.x,
						particles[i].pos.y - 125,
						particles[i].pos.x,
						particles[i].pos.y + 125,
					);
				}
				noStroke();
				fill(random(255), 80);
				let rr = map(this.n, 0, 1, 4, 8);
				rect(particles[i].pos.x, particles[i].pos.y, rr, rr);
				for (let j = 0; j < particles.length; j++) {
					stroke(random(255), 60);
					strokeWeight(0.5);
					if (particles[i] != particles[j]) {
						let pd = dist(
							particles[i].pos.x,
							particles[i].pos.y,
							particles[j].pos.x,
							particles[j].pos.y,
						);
						if (pd > 75 && pd < 80) {
							line(
								particles[i].pos.x,
								particles[i].pos.y,
								particles[j].pos.x,
								particles[j].pos.y,
							);
						}
					}
				}
			}
			pop();
		}
	}
	pop();
	fc++;
}
function keyReleased() {
	if (key == "s" || key == "S") {
		if (fc > iterations) {
			let date =
				year() +
				"" +
				month() +
				"" +
				day() +
				"" +
				hour() +
				"" +
				minute() +
				"" +
				second() +
				"" +
				".png";
			saveCanvas("99recorridos" + date);
		}
	}
}
class Particle {
	constructor(x, y, p) {
		this.pos = createVector(x, y);
		this.vel = createVector(0, 0);
		this.diam = 20;
		this.maxdiam = 45;
		this.a = 0;
		this.c = random(255);
		this.dir = createVector(0, 0);
		this.off = random(0.5);
		this.mult = 0.7;
		this.points = p;
		this.n = 0;
		this.ns = 0.001;
	}
	update() {
		this.n = noise(this.pos.x * this.ns, this.pos.y * this.ns, this.off);
		this.ns = map(this.n, 0, 1, 0.0005, 0.005);
		let dil = map(sin(this.n * TAU), 0, 1, 8, 24);
		this.dir.x = cos(this.n * TAU * dil);
		this.dir.y = sin(this.n * TAU * dil);
		this.vel.add(this.dir);
		this.vel.mult(this.mult);
		this.pos.add(this.vel);
		this.off += 0.001;
		let distances = [];
		for (let i = 0; i < this.points.length; i++) {
			let dis = dist(
				this.pos.x,
				this.pos.y,
				this.points[i].x,
				this.points[i].y,
			);
			distances.push(map(dis, 0, 700 / 2, 0.0, this.maxdiam));
		}
		this.diam = constrain(
			Math.min.apply(null, distances),
			0.0,
			this.maxdiam,
		);
	}
}
