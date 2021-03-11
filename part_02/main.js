const evaluator = require("../evaluate");
//function to initialyze the population with random configurations
function initialyze(iniNum = 100){
    var init = []
    for(var i = 0; i < iniNum; i++){
        let temp = {gen: [], fitness: 0}
        var insertion = ["000","001","010","011","100","101","110","111"];
        temp.gen = shuffle(insertion);
        init.push(temp);
    }
    //console.log(init);
    return init;
}

//function to generate a random string bit
function generateRandom(range){
    var key = ""
    for(var i = 0; i < range; i++){
        var temp = "" + getRandomArbitrary(0, 2);
        key += temp;
    }
    return key
}

// helper function to generate a random number
function getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
  return array;
}

//function to calculate fitness of a given configuration
function checkQueensAttack(queens){
    var res = 0;
    for(var i = 0; i < queens.length; i++){
        for(var j = i + 1; j < queens.length; j++){
            if(queens[i] == queens[j] ||
                Math.abs(queens[j] - queens[i]) == Math.abs(i - j)) {
                    res++;
            }
        }
    }
    return res;
}

//function to calculate fitness of a population
function evaluate(population){
    population.forEach(ind => {
        let decQueens = []
        ind.gen.forEach(queen => {
            decQueens.push(parseInt(queen, 2))
        })
        ind.fitness = checkQueensAttack(decQueens)
    })

    return population
}
//function to check if theres a optimal solution
function checkFinish(population){
    var converged = 0;
    var optimal;
    for(var i = 0; i < population.length; i++){
        if(population[i].fitness == 0){
            optimal = population[i];
            converged++;
        }
    }
    if(converged == 0) {
        return "";
    }
    else{
        optimal.convergedIndividues = converged
        return optimal;
    }
}

function chooseParentsByRoulette(population){
    var candidates = chooseCandidates(population);
    var probabilities = [];
    var sumOfFitness = 0;
    var previousProbabilities = 0;
    var parents = [];

    candidates.forEach(candidate => {
        sumOfFitness += candidate.fitness;
    })

    candidates.sort((a, b) => a.fitness - b.fitness);

    candidates.forEach(candidate => {
        var prob = previousProbabilities + (candidate.fitness / sumOfFitness);
        previousProbabilities = prob;
        probabilities.push(1 - prob);
    });

    for(var i = 0; i < 2; i++){
        var number = getRandomArbitrary(1, 11) / 10;
        for(var j = 0; j < probabilities.length; j++){
            if(number > probabilities[j]){
                parents.push(candidates[j]);
                break;
            }
        }
    }

    return parents;
}

//function to select parents for a generation given a population
function chooseParents(population){
    var candidates = chooseCandidates(population);
    candidates.sort((a, b) => (a.fitness - b.fitness));
    var parents = [candidates[0], candidates[1]];
    return parents;

}

function chooseCandidates(population) {
    var candidates = [];
    for (var i = 0; i < 5; i++) {
        var index = getRandomArbitrary(0, population.length);
        if (!candidates.includes(index)) {
            candidates.push(population[index]);
        } else {
            i--;
        }
    }
    return candidates;
}

//function to Crossover parents if necessary
function makeCrossOver(parents) {
    if(getRandomArbitrary(0, 101) <= 90){
        var cutPoint  = getRandomArbitrary(1, parents[0].gen.length);
        var parent0_p1 = parents[0].gen.slice(0, cutPoint);
        var parent0_p2 = parents[0].gen.slice(cutPoint, parents[0].length);
       
        var parent1_p1 = parents[1].gen.slice(0, cutPoint);
        var parent1_p2 = parents[1].gen.slice(cutPoint, parents[1].length);

        var newParent0 = parent1_p1.concat(parent0_p2);
        var newParent1 = parent0_p1.concat(parent1_p2);
        newParent0 = excludReps(newParent0);
        newParent1 = excludReps(newParent1);
        parents[0].gen = newParent0;
        parents[1].gen = newParent1;
        parents = evaluate(parents);   
    }

    return parents;
}
function excludReps(formation){ // change repeated occurs in array
    var positions = {"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0};
    for(var i in formation){
        positions[parseInt(formation[i],2)]++;
    }
    //console.log(positions);
    for(var i in formation){
        if(positions[parseInt(formation[i],2)] >= 2){
            for(var k = 0; k< 8; k++){
                if(positions[k] == 0){
                    positions[k]++;
                    var aux = Number(k).toString(2);
                    while(aux.length < 3){
                        aux = "0" + aux;
                    }
                    formation[i] = aux;
                    break;
                }
            }
        }
    }
    return formation;
}
//function to mutate children
function mutate(children){
    if(getRandomArbitrary(0, 101) <= 40){
        var mutatePoint = getRandomArbitrary(1, children[0].gen.length);
        
        var temp = children[0].gen[mutatePoint];
        children[0].gen[mutatePoint] = children[1].gen[mutatePoint];
        children[1].gen[mutatePoint] = temp;
        
        children = evaluate(children);
    }
    return children;
}

function invertChildren(children){
    if(getRandomArbitrary(0, 101) <= 40){
        for(var i = 0; i < children.length; i++){
            
                children[i] = invertBetween(children[i]);
                children = evaluate(children);
        }
    }
    return children;
}

function invertBetween(fon){ // invert a random subarray from gen
    var i = 0, j= 0;
    while(i == j){
        i = getRandomArbitrary(0, 7);
        j = getRandomArbitrary(0, 7);
    }
    var aux = i;
    if(i > j){
        i = j;
        j = aux;
    }
    if((j-i)%2 == 0){
        while(i != j){
          aux = fon.gen[i];
          fon.gen[i] = fon.gen[j];
          fon.gen[j] = aux;
          i++;
          j--;
        }
    }else{
        while(j-i != 1){
            aux = fon.gen[i];
            fon.gen[i] = fon.gen[j];
            fon.gen[j] = aux;
            j--;
            i++;
        }
        aux = fon.gen[i];
        fon.gen[i] = fon.gen[j];
        fon.gen[j] = aux;
    }
    return fon;
}

function eliminateWorst(candidates){
    candidates.sort((a, b) => (a.fitness - b.fitness));
    var worst = candidates[candidates.length-1].fitness;
    //console.log("Worst is : " + worst);
    candidates.pop();
    candidates.pop();
    return candidates;
}
/////////////////////////////////////////////////////////
function doRun(gen = 100,interations = 10000){
    var population = initialyze(gen);
    population = evaluate(population);
    var optimal = ""
    var i = 0;
    optimal = checkFinish(population);
    for(i; i < interations && optimal == ""; i++){
        
        //var parents = chooseParents(population);
        var parents = chooseParentsByRoulette(population);
        var children = makeCrossOver(parents);
        //children = mutate(children);
        children = invertChildren(children);
        population.push(children[0]);
        population.push(children[1]);
        
        population = eliminateWorst(population);
        optimal = checkFinish(population);
    }
    if(optimal == ""){
        population.sort((a, b) => (a.fitness - b.fitness));
        population[0]["iteration"] = -1;
        population[0]["convergedIndividues"] = 0;
        return population[0];
    }else{
        //console.log("Optimal solution was found in : " + i)
        optimal["iteration"] = i;
        return optimal;
    }
}
function main(tryes = 1,gen = 100, iterations = 10000){
    var time1 = new Date().getTime();
    var toCalc = [];
    var bullseye = 0;
    var bullMean = 0;
    for(var i = 0; i< tryes; i++){
        toCalc.push(doRun(gen,iterations));
        if(toCalc[i].fitness == 0){
            bullseye++;
            bullMean += toCalc[i].iteration;
        }
    }
    var time2 = new Date().getTime();
    console.log(toCalc);
    console.log("Accuracy of : " + ((bullseye/tryes)*100) + "%");
    console.log("Mean of converged Iterations : " + (bullMean/tryes));
    evaluator.evaluate(toCalc);
    console.log("It took " + (time2-time1)/1000 + " seconds to run this.");
    
}
main(30,100)
//main(respostas = , população = 100, iterações= 10000)