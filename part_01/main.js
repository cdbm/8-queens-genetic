//function to initialyze the population with random configurations
function initialyze(){
    var init = []
    for(var i = 0; i < 100; i++){
        let temp = {gen: [], fitness: 0}
        for(var j = 0; j < 8; j++){
            temp.gen.push(generateRandom(3))
        }
        init.push(temp)
    }
    return init
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

// helper function to generate a random bit
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
        candidates.push(population[index]);
    }
    candidates.sort((a, b) => (a.fitness - b.fitness));
    var parents = [candidates[0], candidates[1]];
    return parents;

}

function main(){
    var population = initialyze();
    population = evaluate(population);
    var optimal = checkFinish(population);
    for(var i = 0; i < 10000 && optimal == ""; i++){
        var parents = chooseParents(population);
    }

}

main()