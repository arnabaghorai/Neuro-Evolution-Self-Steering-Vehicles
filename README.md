## Self Steering Vehicles (Neuro Evolution)
### [Demo](https://arnabaghorai.github.io/Neuro-Evolution-Self-Steering-Vehicles/)


Implemented by applying NeuroEvolutionary Algorithm (Neural Network + Genetic Algorithm) 

Here the Entities are as follows :
1. ### Particle / Vehicle (The agents in the algorithm) 
  - Each particle is associated with a velocity and has rays emitting from it which is fed as input
  - Each particle is associated with a brain (Neural Network) that steers the particle / vehicle.
  - The next generation emerges by mutating the weights of the fittest parents in the previous generation.
  - The fitness function is defined as the inverse square of the distance from the final point.
2. ### Boundary (Track)
  - The Track is generated randomly using Perlin Noise
  - After each generation of particles a new track is generated inorder to avoid memorization of track by agents.
#### Play with the variables in 
> #### public/sketch.js
```javascript
var TOTAL = 100 // No of agents generated during each generation
var MUTATION_RATE = 0.05 //Mutation Rate (Probability of undergoing mutation)
var showRay = false //(true/false) Set to true in order to see the rays
var total = 30 // No of points used for random path generation using Perlin Noise .Greater the value of total the more complex the track is generated.


```

### Libraries :
- Tensorflow.js
- p5.js

#### TODO:
- Improve the UI.Add User Input to adjust the variables.
