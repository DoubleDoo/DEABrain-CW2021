// const bci = require('bcijs');
const path = require('path')
const papa = require('papaparse')
const fs = require('fs');
var brain = require("brain.js");
var Fili = require('fili');
const { Console } = require('console');
const { DH_CHECK_P_NOT_SAFE_PRIME } = require('constants');

// const net = new brain.recurrent.LSTMTimeStep({
//     inputSize: 1,
//     hiddenLayers: [50],
//     outputSize: 1,
// });
const net = new brain.NeuralNetworkGPU();
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

    // console.log(X[0])
    // console.log(X[70])
    // console.log(Y[0])
    // console.log(Y[70])
    // console.log(samples[0])
    // console.log("LOW")
    // console.log(LowPass(samples[0]))
    // console.log("HIGH")
    // console.log(HighPass(samples[0]))
    // console.log("BOTH")
    // console.log(Norm(samples[0]))
    // console.log("sample--end")

    // console.log(Norm(X[0]))
    // console.log(Norm(X[70]))
    // console.log(Y[0])
    // console.log(Y[70])

    // for (let i = 0; i < X.length; i++) { 
    //     // X[i]=Norm(X[i])
    //     //X[i]=LowPass(X[i])
    // }

    //samples=Medium(samples);

    // samples=Decimation(samples,4);


    testX = X.splice(0, 200);
    testY = Y.splice(0, 200);
    trainX = X.splice(200, 1000);
    trainY = Y.splice(200, 1000);
    console.log("_______________");
    console.log(testY.length);
    console.log(testX.length);
    console.log(trainX.length);
    console.log(trainY.length);
    console.log("_______________");
    console.log(trainX[0].length);
    console.log(testX[0].length);
    console.log(trainY[0].length);
    console.log(testY[0].length);
    console.log("_______________");
    console.log("Gen Train");
    let trainData = []
    for (let i = 0; i < trainX.length; i++) {
        trainData.push({ input: trainX[i], output: [trainY[i]] })
    }
    console.log("Start Train");
    net.train(trainData, {
        log: detail => console.log(detail),
        // errorThresh: 0.005, // порог ошибок, которого нужно достичь
        iterations: 100, // максимальное число итераций обучения
        // logPeriod: 10, // число итераций между логированиями
        // learningRate: 0.3 // степень обучения
    });
    fs.writeFileSync("net.json", JSON.stringify(net.toJSON()));


    console.log("Check");
    for (let i = 0; i < testX.length; i++) {
        console.log(/*Math.round(*/net.run(testX[i])*10/*)*/ + ":" + testY[i])
    }
}



function Epoches(data,resIndex,len) {
    buf = []
    for (let i = 0; i < data.length; i++) { 
        buf.push(data[i]);
    }
    let samples = []
    let ansers = []
    for (let i = 0; i < resIndex.length; i++) { 
        samples.push(buf.slice(resIndex[i] - len/2, resIndex[i] + len/2));
        ansers.push(1);
    }
    for (let i = 1; i < resIndex.length - 1; i++) { 
        for (let j = resIndex[i - 1]; j < resIndex[i]; j += len) { 
            samples.push(buf.slice(j - len, j));
            ansers.push(0);
        }
    }
    return [samples,ansers]
}

function Decimation(data,val) {
    newSamples=[]
    for (let i = 0; i < data.length; i++) {
        buf=[]
        for (let j = 0; j < data[i].length; j++) {
            if (j%val==0) {buf.push(data[i][j])}
        }
        newSamples.push(buf)
    }
    return newSamples
}


function Medium(data) {
    let sum=0;
    for (let i = 0; i < data.length; i++) { 
        sum = 0;
        for (let j = 0; j < data[i].length; j++) { 
            sum += data[i][j]
        }
        sum /= data[i].length
        for (let j = 0; j < data[i].length; j++) { 
            data[i][j] -= sum
        }
    }
    return data;
}

function Norm(data) {
    let max=data[0];
    let min=data[0];
    for (let i = 0; i < data.length; i++) { 
        if(data[i]>max) max=data[i];
        if(data[i]<min) min=data[i];
    }
    buf=[]
    if(max>0 && min>0)
    {
        //console.log("+");
        for (let i = 0; i < data.length; i++) { 
            buf.push(Math.abs((data[i]-Math.abs(min))/Math.abs((Math.abs(max)-Math.abs(min)))))
        }
    }
    else if (max<0 && min<0)
    {
        //console.log("-");
        for (let i = 0; i < data.length; i++) { 
            buf.push(Math.abs((data[i]+Math.abs(max))/Math.abs((Math.abs(min)-Math.abs(max)))))
        }
    }

    else{
        //console.log("+-");
        for (let i = 0; i < data.length; i++) { 
            buf.push(Math.abs((data[i]+Math.abs(min))/Math.abs((Math.abs(min)+Math.abs(max)))))
        }
    }
    return buf;
   
}

function LowPass(data) {
    var iirCalculator = new Fili.CalcCascades();
    var availableFilters = iirCalculator.available();
    var iirFilterCoeffs = iirCalculator.lowpass({
        order: 4, // cascade 3 biquad filters (max: 12)
        characteristic: 'butterworth',
        Fs: 200, // sampling frequency
        Fc: 10, // cutoff frequency / center frequency for bandpass, bandstop, peak
        BW: 20, // bandwidth only for bandstop and bandpass filters - optional
    });
    var iirFilter = new Fili.IirFilter(iirFilterCoeffs);
    dataf = iirFilter.multiStep(data);
    return dataf;
}

