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
const config = {
    // inputSize: 200,
    // inputRange: 200,
    hiddenLayers: [300, 50]
    // outputSize: 1,
    // // learningRate: 0.01,
    // // decayRate: 0.999,
  };
  
  // create a simple feed forward neural network with backpropagation
  const net = new brain.NeuralNetwork(config);
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


    X=Medium(X);
    for (let i = 0; i < X.length; i++) { 
        // X[i]=Norm(X[i])
        X[i]=LowPass(X[i])
    }
    // X=Decimation(X,4)

    let buf=[];
    for (let i = 0; i < Y.length; i++) {
        if(Y[i]==1)
        buf.push([1,0])
        else
        buf.push([0,1])
     }
    console.log(buf);
    Y=buf;

    
    testX = X.splice(0, 1000);
    testY = Y.splice(0, 1000);
    trainX = X.splice(1000, 5000);
    trainY = Y.splice(1000, 5000);
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
        trainData.push({ input: trainX[i], output: trainY[i] })
    }
    console.log("Start Train");
    net.train(trainData, {
        log: detail => console.log(detail),
        // errorThresh: 0.005, // порог ошибок, которого нужно достичь
        iterations: 100, // максимальное число итераций обучения
        // logPeriod: 10, // число итераций между логированиями
        // learningRate: 0.3 // степень обучения
    });
    fs.writeFileSync("netnew.json", JSON.stringify(net.toJSON()));

resuly=[];
    console.log("Check");
    for (let i = 0; i < testX.length; i++) {
        resuly.push(net.run(testX[i]))
    }
    for (let i = 0; i < resuly.length; i++) {
        console.log(/*Math.round(*/resuly[i]/*)*/ + ":" + testY[i])
    }
    let filter=0.1
    let corect=0;
    let contt=0;
    for (let i = 0; i < testY.length; i++) {
     
            if(testY[i][0]==1)
            {
                contt++;
                
                if(resuly[i][0]>filter){
                    corect=corect+1;
                }

            }
            // if(testY[i][0]==0)
            // {
            //     contt++;
                
            //     if(predProb[i*2+1]>0.5){
            //         corect=corect+1;
            //     }

            // }
        
    }
    console.log(corect+":"+contt);

    corect=0;
    contt=0;
    for (let i = 0; i < testY.length; i++) {
            if(testY[i][1]==1)
            {
                contt++;
                
                if(resuly[i][1]>1-filter){
                    corect=corect+1;
                }

            }
        
    }
    console.log(corect+":"+contt);
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
    // console.log(dataf);
    buf=[];
    // console.log(dataf.length);
    for (let j = 0; j < dataf.length; j++) { 
        // console.log(j);
        buf.push(dataf[dataf.length-j-1])
    }
    dataf = iirFilter.multiStep(buf);
    // console.log(dataf);
    buf=[];
    for (let j = 0; j < dataf.length; j++) { 
        // console.log(j);
        buf.push(dataf[dataf.length-j-1])
    }
    return buf;
}

// function Epoches(data,resIndex,len) {
//     buf = []
//     for (let i = 0; i < data.length; i++) { 
//         buf.push(data[i]);
//     }
//     let samples = []
//     let ansers = []
//     for (let i = 0; i < resIndex.length; i++) { 
//         samples.push(buf.slice(resIndex[i] - len/2, resIndex[i] + len/2));
//         ansers.push(1);
//     }
//     for (let i = 1; i < resIndex.length - 1; i++) { 
//         for (let j = resIndex[i - 1]; j < resIndex[i]; j += len) { 
//             samples.push(buf.slice(j - len, j));
//             ansers.push(0);
//         }
//     }
//     return [samples,ansers]
// }

// function Decimation(data,val) {
//     newSamples=[]
//     for (let i = 0; i < data.length; i++) {
//         buf=[]
//         for (let j = 0; j < data[i].length; j++) {
//             if (j%val==0) {buf.push(data[i][j])}
//         }
//         newSamples.push(buf)
//     }
//     return newSamples
// }


// function Medium(data) {
//     let sum=0;
//     for (let i = 0; i < data.length; i++) { 
//         sum = 0;
//         for (let j = 0; j < data[i].length; j++) { 
//             sum += data[i][j]
//         }
//         sum /= data[i].length
//         for (let j = 0; j < data[i].length; j++) { 
//             data[i][j] -= sum
//         }
//     }
//     return data;
// }

// function Norm(data) {
//     let max=data[0];
//     let min=data[0];
//     for (let i = 0; i < data.length; i++) { 
//         if(data[i]>max) max=data[i];
//         if(data[i]<min) min=data[i];
//     }
//     buf=[]
//     if(max>0 && min>0)
//     {
//         //console.log("+");
//         for (let i = 0; i < data.length; i++) { 
//             buf.push(Math.abs((data[i]-Math.abs(min))/Math.abs((Math.abs(max)-Math.abs(min)))))
//         }
//     }
//     else if (max<0 && min<0)
//     {
//         //console.log("-");
//         for (let i = 0; i < data.length; i++) { 
//             buf.push(Math.abs((data[i]+Math.abs(max))/Math.abs((Math.abs(min)-Math.abs(max)))))
//         }
//     }

//     else{
//         //console.log("+-");
//         for (let i = 0; i < data.length; i++) { 
//             buf.push(Math.abs((data[i]+Math.abs(min))/Math.abs((Math.abs(min)+Math.abs(max)))))
//         }
//     }
//     return buf;
   
// }

// function LowPass(data) {
//     var iirCalculator = new Fili.CalcCascades();
//     var availableFilters = iirCalculator.available();
//     var iirFilterCoeffs = iirCalculator.lowpass({
//         order: 4, // cascade 3 biquad filters (max: 12)
//         characteristic: 'butterworth',
//         Fs: 200, // sampling frequency
//         Fc: 10, // cutoff frequency / center frequency for bandpass, bandstop, peak
//         BW: 20, // bandwidth only for bandstop and bandpass filters - optional
//     });
//     var iirFilter = new Fili.IirFilter(iirFilterCoeffs);
//     dataf = iirFilter.multiStep(data);
//     return dataf;
// }