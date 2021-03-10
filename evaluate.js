var evaluator = {
    evaluate(tryResults){
        var iterationStd = this.calculateIterationStd(tryResults);
        var fitnessStd = this.calculateFitnessStd(tryResults);
        var fitnessMean = this.calculateFitnessMean(tryResults);
        var convergedIndividuesMean = this.calculateIndividuesMean(tryResults);
    
        console.log("Standard deviation of converged Iterations: " + iterationStd);
        console.log("Mean of fitness: " + fitnessMean); 
        console.log("Standard deviation of fitness: " + fitnessStd);
        console.log("Mean of converged individues: " + convergedIndividuesMean);    
    },

    calculateStd(list){
        let mean = list.reduce((total, value) => total+value/list.length, 0);
        let variance = list.reduce((total, value) => total + Math.pow(mean - value, 2)/list.length, 0);
        return Math.sqrt(variance);
    },
    
    calculateIterationStd(tryResults){
        var convergedIterations = [];
        tryResults.forEach(result => {
            if(result.iteration != -1){
                convergedIterations.push(result.iteration);
            }
        })
        return this.calculateStd(convergedIterations)
    },
    
    calculateFitnessStd(tryResults){
        var convergedIterations = [];
        tryResults.forEach(result => {
                convergedIterations.push(result.fitness);      
        })
        return this.calculateStd(convergedIterations)
    },
    
    calculateFitnessMean(tryResults) {
        var fitness = 0;
        var iterations = tryResults.length;
        tryResults.forEach(result => {
            fitness += result.fitness;
        });
    
        return fitness / iterations;
    },
    
    calculateIndividuesMean(tryResults){
        var individues = 0;
        var iterations = tryResults.length;
        tryResults.forEach(result => {
            individues += result.convergedIndividues;
        });
    
        return individues / iterations;
    }
}

module.exports = evaluator