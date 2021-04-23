const bci = require('bcijs');
const path = require('path')
const papa = require('papaparse')
const fs = require('fs');
var brain = require("brain.js");
var Fili = require('fili');


const net = new brain.NeuralNetwork();
console.log("Start")

readCSV();
// demo();



function readCSV() {
    fs.readFile("X.csv", 'utf-8', (err, data) => {
        if (err) {
            console.log("An error ocurred reading the file :" + err.message);
            return;
        }
        papa.parse(data, {
            header: true,
            complete: function (results) {
                let dataMas = [];
                let indexMas = [];
                let index = 0;
                results.data.map(element => {
                    let x = 0;
                    dataMas.push(parseFloat(element["Fz"]))
                    if (parseFloat(element["FeedBackEvent"])==1)
                    {
                        indexMas.push(index)
                    }
                    index = index + 1;
                });
                //diviceSimulation = dataMas


                fs.readFile("Y.csv", 'utf-8', (err, data) => {
                    if (err) {
                        console.log("An error ocurred reading the file :" + err.message);
                        return;
                    }
                    papa.parse(data, {
                        header: true,
                        complete: function (results) {
                            let dataMas2 = [];
                            let index = 0;
                            results.data.map(element => {
                                let x = 0;
                                if(element["IdFeedBack"].indexOf("S02_Sess01")!=-1){
                                dataMas2.push(parseFloat(element["Prediction"]))
                                index = index + 1;
                                }
                            });
                            //diviceSimulation = dataMas
                            processData(dataMas,dataMas2,indexMas);
                        }
                    })
                });


            }
        })
    });
}

function processData(data,res,index) {
    console.log(data)
    // console.log(res)
    // console.log(index)
    var iirCalculator = new Fili.CalcCascades();
    var availableFilters = iirCalculator.available();
    var iirFilterCoeffs = iirCalculator.lowpass({
        order: 3, // cascade 3 biquad filters (max: 12)
        characteristic: 'butterworth',
        Fs: 200, // sampling frequency
        Fc: 8, // cutoff frequency / center frequency for bandpass, bandstop, peak
        BW: 1, // bandwidth only for bandstop and bandpass filters - optional
        gain: 0, // gain for peak, lowshelf and highshelf
        preGain: false // adds one constant multiplication for highpass and lowpass
        // k = (1 + cos(omega)) * 0.5 / k = 1 with preGain == false
      });
    var iirFilter = new Fili.IirFilter(iirFilterCoeffs);
    dataf=iirFilter.multiStep(data);
    console.log(dataf)
    let leng=data.length
    data=[]
    for (let i = 0; i < leng; i++) { // выведет 0, затем 1, затем 2
        data.push(dataf[i]);
    }
    console.log(data)
    let samples=[]
    let ansers=[]
    for (let i = 0; i < index.length; i++) { // выведет 0, затем 1, затем 2
        samples.push(data.slice(index[i]-100,index[i]+100));
        ansers.push(1);
    }
    for (let i = 1; i < index.length-1; i++) { // выведет 0, затем 1, затем 2
        for (let j = index[i-1]; j < index[i]; j+=200) { // выведет 0, затем 1, затем 2
            samples.push(data.slice(j-200,j));
            ansers.push(0);
        }
    }

    // newSamples=[]
    // for (let i = 0; i < samples.length; i++) {
    //     buf=[]
    //     for (let j = 0; j < samples[i].length; j++) {
    //         if (j%4==0) {buf.push(samples[i][j])}
    //     }
    //     newSamples.push(buf)
    // }

    // samples=newSamples

    for (let i = 0; i < samples.length; i++) { // выведет 0, затем 1, затем 2
        sum=0;
        for (let j = 0; j < samples[i].length; j++) { // выведет 0, затем 1, затем 2
            sum+= samples[i][j]
        }
        sum/=samples[i].length
        for (let j = 0; j < samples[i].length; j++) { // выведет 0, затем 1, затем 2
            samples[i][j]-=sum
        }
    }

    console.log(samples[0])
//  Instance of a filter coefficient calculator


// var iirCalculator = new Fili.CalcCascades();

// // get available filters
// var availableFilters = iirCalculator.available();

// // calculate filter coefficients
// var iirFilterCoeffs = iirCalculator.lowpass({
//     order: 3, // cascade 3 biquad filters (max: 12)
//     characteristic: 'butterworth',
//     Fs: 200, // sampling frequency
//     Fc: 8, // cutoff frequency / center frequency for bandpass, bandstop, peak
//     BW: 1, // bandwidth only for bandstop and bandpass filters - optional
//     gain: 0, // gain for peak, lowshelf and highshelf
//     preGain: false // adds one constant multiplication for highpass and lowpass
//     // k = (1 + cos(omega)) * 0.5 / k = 1 with preGain == false
//   });

// // create a filter instance from the calculated coeffs
// var iirFilter = new Fili.IirFilter(iirFilterCoeffs);
// console.log(iirFilter.multiStep(samples[0]));

    // // for (let i = 0; i < newSamples.length; i++) { // выведет 0, затем 1, затем 2
    // //     console.log(newSamples[i].length)
    // // }


    testX=samples.splice(50,200);
    testY=ansers.splice(50,200);
    trainX=samples.splice(0,200);
    trainY=ansers.splice(0,200);
    console.log(testY.length);
    console.log(testX.length);
    console.log(trainX[0].length);
    console.log(testX[0].length);
    console.log(trainX.length);
    console.log(trainY.length);
    
    let trainData=[]
    for (let i = 0; i < trainX.length; i++) {
        trainData.push({ input: trainX[i], output: [trainY[i]] })
     }

      net.train(trainData, {
      log: detail => console.log(detail)
    });
    

    for (let i = 0; i < testX.length; i++) {
       console.log(Math.round(net.run(testX[i]))+":"+testY[i])
    }

    
}

function demo() {
    const trainingData = [
        'Jane saw Doug.',
        'Doug saw Jane.',
        'Spot saw Doug and Jane looking at each other.',
        'It was love at first sight, and Spot had a frontrow seat. It was a very special moment for all.'
      ];
      
      const lstm = new brain.recurrent.LSTM();
      const result = lstm.train(trainingData, {
        iterations: 1500,
        log: details => console.log(details),
        errorThresh: 0.011
      });
      
      const run1 = lstm.run('Jane');
      const run2 = lstm.run('Doug');
      const run3 = lstm.run('Spot');
      const run4 = lstm.run('It');
      
      console.log('run 1: Jane' + run1);
      console.log('run 2: Doug' + run2);
      console.log('run 3: Spot' + run3);
      console.log('run 4: It' + run4);
}