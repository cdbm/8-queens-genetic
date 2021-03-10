//function to initialyze the population with random configurations
function initialyze(iniNum = 100){
    var init = []
    for(var i = 0; i < iniNum; i++){
        let temp = {gen: [], fitness: 0}
        for(var j = 0; j < 8; j++){
            var num = generateRandom(3);
            if(!temp.gen.includes(num)){
                temp.gen.push(num);
            }else{
                j--;
            }
        }
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
    for(var i = 0; i < population.length; i++){
        if(population[i].fitness == 0){
            return population[i];
        }
    }
    return "";
}

//function to select parents for a generation given a population
function chooseParents(population){
    var candidates = [];
    for(var i = 0; i < 5; i++){
        var index = getRandomArbitrary(0, population.length);
        if(!candidates.includes(index)){
            candidates.push(population[index]);
        }else{
            i--;
        }
    }
    candidates.sort((a, b) => (a.fitness - b.fitness));
    var parents = [candidates[0], candidates[1]];
    return parents;

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
function excludReps(formation){
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
function doRun(gen = 100){
    var population = initialyze(gen);
    population = evaluate(population);
    var optimal = ""
    var i = 0;
    for(i; i < 10000 && optimal == ""; i++){
        optimal = checkFinish(population);
        var parents = chooseParents(population);
        var children = makeCrossOver(parents);
        children = mutate(children);
        
        population.push(children[0]);
        population.push(children[1]);
        
        population.sort((a, b) => (a.fitness - b.fitness));
        population.pop();
        population.pop();
    }
    if(optimal == ""){
        population.sort((a, b) => (a.fitness - b.fitness));
        population[0]["interation"] = -1;
        return population[0];
    }else{
        //console.log("Optimal solution was found in : " + i)
        optimal["interation"] = i;
        return optimal;
    }
}
function invertBetween(fon){
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
function tradeHouses(fon){
    var i = 0, j= 0;
    while(i == j){
        i = getRandomArbitrary(0, 7);
        j = getRandomArbitrary(0, 7);
    }
    var aux = fon.gen[i];
    fon.gen[i] = fon.gen[j];
    fon.gen[j] = aux;
    return fon;
}
function main(tryes = 1,gen = 100){
    var time1 = new Date().getTime();
    var toCalc = [];
    var bullseye = 0;
    var bullMean = 0;
    for(var i = 0; i< tryes; i++){
        toCalc.push(doRun(gen));
        if(toCalc[i].fitness == 0){
            bullseye++;
            bullMean += toCalc[i].interation;
        }
    }
    var time2 = new Date().getTime();
    console.log(toCalc);
    console.log("Accuracy of : " + ((bullseye/tryes)*100) + "%");
    console.log("Mean of optimal shots : " + (bullMean/tryes)); 
    console.log("It took " + (time2-time1)/1000 + " seconds to run this.");
}
//main(100,100)
console.log(invertBetween({gen: [
    '001', '000',
    '100', '101',
    '111', '010',
    '110', '011'
  ]}))