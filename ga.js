function nextGeneration() {
    console.log('next generation');
    calculateFitness(end);
    for (let i = 0; i < TOTAL; i++) {
        population[i] = pickOne();
    }
    for (let i = 0; i < TOTAL; i++) {
        savedPopulation[i].dispose();
    }
    savedPopulation = [];
}

function pickOne() {
    let index = 0;
    let r = random(1);
    while (r > 0) {
        r = r - savedPopulation[index].fitness;
        index++;
    }
    index--;
    let particle = savedPopulation[index];
    let child = new Particle(particle.brain);
    child.mutate();
    return child;
}

function calculateFitness() {
    let sum = 0;
    for (particle of savedPopulation) {
        particle.calculateFitness();

    }
    for (particle of savedPopulation) {
        sum += particle.fitness;
    }
    for (let particle of savedPopulation) {
        particle.fitness = particle.fitness / sum;
    }
}