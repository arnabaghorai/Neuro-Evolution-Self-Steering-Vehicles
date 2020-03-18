let walls = [];
let ray;
let pt;
let population = [];
let start, end, force;
let savedPopulation = [];
let inside = [];
let outside = [];
let checkpoints = [];
const TOTAL = 100;			//Total no of particles
const MUTATION_RATE = 0.05;		//Mutation Rate
let speedSlider;
const total = 100;	//Total no of points for random track generation using Perlin Noise
const showRay = false	//Whether to show rays from particle

function trackgen() {

	inside = [];
	outside = [];
	checkpoints = [];
	walls = [];
	let startX = random(1000);
	let startY = random(1000);

	let noiseMax = 2;
	beginShape();
	for (let i = 0; i < total; i++) {
		let a = map(i, 0, total, 0, TWO_PI);
		let xoff = map(cos(a), -1, 1, 0, noiseMax) + startX;
		let yoff = map(sin(a), -1, 1, 0, noiseMax) + startY;
		let r = map(noise(xoff, yoff), 0, 1, 100, height / 2);

		let x1 = width / 2 + (r - 20) * cos(a);
		let y1 = height / 2 + (r - 20) * sin(a);
		let x2 = width / 2 + (r + 20) * cos(a);
		let y2 = height / 2 + (r + 20) * sin(a);
		checkpoints.push(new Boundary(x1, y1, x2, y2));
		inside.push(createVector(x1, y1));
		outside.push(createVector(x2, y2));



	}
	endShape();

	let r = inside[inside.length - 1];
	let s = outside[outside.length - 1];

	// endShape(CLOSE);
	//phase += 0.003;
	//zoff += 0.01;
	for (let i = 0; i < checkpoints.length; i++) {
		let a1 = inside[i];
		let b1 = inside[(i + 1) % checkpoints.length];
		walls.push(new Boundary(a1.x, a1.y, b1.x, b1.y));
		let a2 = outside[i];
		let b2 = outside[(i + 1) % checkpoints.length];
		walls.push(new Boundary(a2.x, a2.y, b2.x, b2.y));
	}


	walls.push(new Boundary(r.x, r.y, s.x, s.y));
	// walls.push(new Boundary(390, 50, 390, 100));

	// walls.push(new Boundary(50, 400, 50, 200));
	// walls.push(new Boundary(50, 200, 150, 50));
	// walls.push(new Boundary(150, 50, 400, 50));

	// walls.push(new Boundary(100, 400, 100, 200));
	// walls.push(new Boundary(100, 200, 175, 100));
	// walls.push(new Boundary(175, 100, 400, 100));

	start = checkpoints[0].midpoint();
	//checkpoints.pop();
	end = checkpoints[total - 2].midpoint();
	// force = createVector(0, -1);

}

function setup() {
	createCanvas(500, 500);
	tf.setBackend('cpu');

	stroke(255);
	strokeWeight(2);
	noFill();


	trackgen();
	for (let i = 0; i < TOTAL; i += 1) {
		population[i] = new Particle();
	}



	speedSlider = createSlider(1, 50, 1);

}

function draw() {
	background(0);



	for (wall of walls) {
		wall.show();
	}
	const cycles = speedSlider.value();
	//ray.show();
	//ray.lookAt(mouseX, mouseY);s
	for (let n = 0; n < cycles; n += 1) {


		for (let i = 0; i < population.length; i += 1) {
			population[i].look(walls);
			population[i].check(checkpoints);
			population[i].bounds();
			population[i].update();


		}

		for (let i = population.length - 1; i >= 0; i -= 1) {

			const particle = population[i];
			if (particle.finished || particle.dead) {


				savedPopulation.push(population.splice(i, 1)[0]);
			}

		}
		if (population.length == 0) {
			trackgen();
			nextGeneration();

		}
	}

	for (particle of population) {
		particle.show();
	}



	ellipse(start.x, start.y, 8);
	ellipse(end.x, end.y, 8);
	for (let p of checkpoints) {
		//strokeWeight(2);
		//p.show();
		//point(p.x, p.y);

	}

	// // pt = ray.check(wall);
	// // if (pt) {
	// // 	fill(255);
	// // 	ellipse(pt.x, pt.y, 8, 8)

	// // }
}