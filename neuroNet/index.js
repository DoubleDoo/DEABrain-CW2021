const bci = require('bcijs');
const path = require('path')
const papa = require('papaparse')
const fs = require('fs');
var brain = require("brain.js");
var Fili = require('fili');
const { Console } = require('console');
const { DH_CHECK_P_NOT_SAFE_PRIME } = require('constants');

const net = new brain.NeuralNetwork({
    hiddenLayers: [64,32],
    learningRate: 0.6
});
//const net = new brain.NeuralNetworkGPU();
let allEpoches=[]
let allAnsers=[]
let counter=0;
let fin=0;
console.log("Start")


readDataFromJson()
// readAllCSV();


function readDataFromJson() {
    data=JSON.parse(fs.readFileSync("trainData.json"))
    console.log(data[0].length)
    console.log(data[1].length)
    X=data[0];
    Y=data[1];
    testX = X.splice(5000, 5000);
    testY = Y.splice(5000, 5000);
    trainX = X;
    trainY = Y;
    console.log(testY.length);
    console.log(testX.length);
    console.log(trainX[0].length);
    console.log(testX[0].length);
    console.log(trainX.length);
    console.log(trainY.length);
    console.log("Gen Train");
    console.log(testX[0]);

    var obj = JSON.parse(fs.readFileSync('net.json', 'utf8'));
    net.fromJSON(obj);

    console.log("Check");
    for (let i = 0; i < testX.length; i++) {
        console.log(/*Math.round(*/net.run(testX[i])/*)*/ + ":" + testY[i])
    }

    
//     testX = samples.splice(50, 200);
//     testY = ansers.splice(50, 200);
//     trainX = samples.splice(0, 200);
//     trainY = ansers.splice(0, 200);
//     console.log(testY.length);
//     console.log(testX.length);
//     console.log(trainX[0].length);
//     console.log(testX[0].length);
//     console.log(trainX.length);
//     console.log(trainY.length);

//     let trainData = []
//     for (let i = 0; i < trainX.length; i++) {
//         trainData.push({ input: trainX[i], output: [trainY[i]] })
//     }

//     net.train(trainData, {
//         log: detail => console.log(detail)
//     });


//     for (let i = 0; i < testX.length; i++) {
//         console.log(Math.round(net.run(testX[i])) + ":" + testY[i])
//     }

}












