function pldistance(p1, p2, p) {
    let num = abs((p2.y - p1.y) * p.x - (p2.x - p1.x) * p.y + p2.x * p1.y - p2.y * p1.x);
    let den = p5.Vector.dist(p1, p2);
    return (num / den);
}

class Particle {

    constructor(brain) {
        this.fitness = 0;
        this.pos = createVector(start.x, start.y);
        this.rays = [];
        this.dead = false;
        this.vel = createVector();
        this.acc = createVector();
        this.sight = 100;
        this.maxspeed = 3;
        this.maxforce = 0.8;
        this.finished = false;
        this.index = 0;
        this.counter = 0;
        this.lifespan = 50;

        for (let i = -45; i <= 45; i += 15) {
            this.rays.push(new Ray(this.pos, radians(i)));
        }

        if (brain) {
            this.brain = brain.copy();

        } else {
            this.brain = new NeuralNetwork(this.rays.length, this.rays.length, 1);
        }

    }

    dispose() {
        this.brain.dispose();
    }

    mutate() {
        this.brain.mutate(MUTATION_RATE);
    }

    calculateFitness() {

        this.fitness = pow(2, this.index);
        // if (this.finished) {
        //     this.fitness = 1;
        // } else {
        //     const d = p5.Vector.dist(this.pos, target);
        //     this.fitness = constrain(1 / d, 0, 1);
        // }
    }

    check(checkpoints) {

        if (!this.finished) {

            this.goal = checkpoints[this.index];
            const d = pldistance(this.goal.a, this.goal.b, this.pos);
            if (d < 10) {
                this.index++;
                this.counter = 0;

            }

            for (let i of checkpoints) {

            }

        }


        if (this.index > checkpoints.length - 1) {
            this.finished = true;
        }
        // const d = p5.Vector.dist(this.pos, target);
        // if (d < 2) {
        //     this.finished = true;
        // }
    }

    look(walls) {

        const inputs = [];

        for (let i = 0; i < this.rays.length; i += 1) {
            let closest_pt = null;
            let record = this.sight;
            for (let wall of walls) {
                const pt = this.rays[i].check(wall);

                if (pt && this.pos) {
                    let d = p5.Vector.dist(this.pos, pt);
                    if (d < record && d < this.sight) {
                        record = d;
                        closest_pt = pt;
                    }
                }




            }
            inputs[i] = map(record, 0, this.sight, 1, 0);
            if (record < 3) {
                this.dead = true;

            }
            if (closest_pt) {

                if(showRay){
                    stroke(255, 0, 255, 100)
                line(this.pos.x, this.pos.y, closest_pt.x, closest_pt.y);

                }
                
            }


        }

        // let vel = this.vel.copy();
        // vel.normalize();
        // inputs.push(vel.x);
        // inputs.push(vel.y);

        const output = this.brain.predict(inputs);
        let angle = map(output[0], 0, 1, -PI, PI);
        angle += this.vel.heading();

        let steering = p5.Vector.fromAngle(angle);
        steering.setMag(this.maxspeed);
        steering.sub(this.vel);
        steering.limit(this.maxforce);
        this.applyForce(steering);



    }
    applyForce(force) {
        this.acc.add(force);
    }

    bounds() {
        if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) {
            this.dead = true;
        }
    }



    update() {
        if (!this.dead && !this.finished) {
            this.pos.add(this.vel);

            this.vel.add(this.acc);
            this.vel.limit(this.maxspeed);
            this.acc.set(0, 0);
            this.counter++;
            if (this.counter > this.lifespan) {
                this.dead = true;
            }

            for (let i = 0; i < this.rays.length; i++) {
                this.rays[i].rotate(this.vel.heading());
            }
        }



    }

    show() {

        push();
        translate(this.pos.x, this.pos.y);
        const heading = this.vel.heading();
        rotate(heading);
        fill(255, 0, 255, 200);
        rectMode(CENTER);
        rect(0, 0, 10, 5);
        pop();
        for (let ray of this.rays) {

            // ray.show()

        }
        if (this.goal) {
            this.goal.show();
        }

    }
}