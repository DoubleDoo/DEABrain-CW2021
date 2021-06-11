const tf = require('@tensorflow/tfjs');
const path = require('path')
const papa = require('papaparse')
var Fili = require('fili');
const fs = require('fs');
const { batchNorm } = require('@tensorflow/tfjs');


const model = tf.sequential({
    layers: [
      tf.layers.dense({inputShape: 50, units: 100, activation: 'relu'}),
    //   tf.layers.dense({inputShape: 500, units: 1000, activation: 'relu'}),
    //   tf.layers.dense({inputShape: 1000, units: 100, activation: 'relu'}),
      tf.layers.dense({inputShape: 100, units: 20, activation: 'relu'}),
      tf.layers.dense({inputShape: 20, units: 2, activation: 'softmax'}),
    ]
   });

   model.compile({
    optimizer: 'rmsprop',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });

// Generate some random fake data for demo purpose.
// const xs = tf.randomUniform([10000, 200]);
// const ys = tf.randomUniform([10000, 1]);
// const valXs = tf.randomUniform([1000, 200]);
// const valYs = tf.randomUniform([1000, 1]);

// console.log(xs)
// console.log(ys)
// // Start model training process.
// async function train() {
//   await model.fit(xs, ys, {
//     epochs: 1,
//     validationData: [valXs, valYs]
//   });
// }
// train();

// // const bci = require('bcijs');
// const path = require('path')
// const papa = require('papaparse')
// const fs = require('fs');
// var brain = require("brain.js");
// var Fili = require('fili');
// const { Console } = require('console');
// const { DH_CHECK_P_NOT_SAFE_PRIME } = require('constants');

// const net = new brain.NeuralNetwork({
//     inputSize: 1,
//     hiddenLayers: [50],
//     outputSize: 1,
// });

// let allEpoches=[]
// let allAnsers=[]
// let counter=0;
// let fin=0;
// console.log("Start")


readDataFromJson()
// readAllCSV();




function readDataFromJson() {
    let data=JSON.parse(fs.readFileSync("trainData.json"))
    console.log(data[0].length)
    console.log(data[1].length)
    X=data[0];


    X=Medium(X);
    for (let i = 0; i < X.length; i++) { 
        // X[i]=Norm(X[i])
        X[i]=LowPass(X[i])
    }
    X=Decimation(X,4)

    // console.log(X[0]);
    // X[0]=LowPass(X[0])

    Y=data[1];
let bvbv=0
    let buf=[];
    for (let i = 0; i < Y.length; i++) {
        if(Y[i]==1){
        buf.push([1,0])
        bvbv++;
        }
        else
        buf.push([0,1])
     }
    console.log(buf);
    console.log(bvbv+"/"+Y.length);
    Y=buf;


    testX = X.splice(0, 5000);
    testY = Y.splice(0, 5000);
    trainX = X//.splice(500, 2000);
    trainY = Y//.splice(500, 2000);
    console.log("_______________");
    console.log(testY.length);
    console.log(testX.length);
    console.log(trainX.length);
    console.log(trainY.length);
    console.log("_______________");
    console.log(trainX[0].length);
    console.log(testX[0].length);
    console.log("_______________");
    console.log("Gen Train");
   
    // const dat = tf.tensor2d([[1,2,3,4,5,6,7,8,9,10],[2,3,4,5,6,7,8,9,10,11]])
    // const labels = tf.tensor([[0], [1]])

    const traintX = tf.tensor(trainX);
    const traintY = tf.tensor(trainY);
    const testtX = tf.tensor(testX);
    const testtY = tf.tensor(testY);
    traintX.print();
    traintY.print();
    testtX.print();
    testtY.print();
    console.log(traintX);
    console.log(traintY);
    console.log(testtX);
    console.log(testtY);




    function onBatchEnd(epoch, logs) {
        console.log("Epoch " + epoch);
        console.log("Loss: " + logs.loss + " accuracy: " + logs.acc);
    }
    // const a = tf.tensor([[1,2,3],[3,2,1],[4,5,6],[6,5,4],[7,8,9]]);
    // const b = tf.tensor([[1,0],[0,1],[1,0],[0,1],[1,0]]);
    // const c = tf.tensor([[9,8,7],[3,4,5],[5,6,7],[6,5,4]]);
    // const d = tf.tensor([[0,1],[1,0],[1,0],[0,1]]);


    model.fit( traintX,  traintY, {
        shuffle: true,
        epochs: 1,
        batchSize:128,
        callbacks: {onBatchEnd},
      }).then(info => {
        console.log('Final accuracy', info.history.acc);
        const predProb = model.predict(testtX).dataSync();
        console.log("predstart");
        // console.log(predProb)
        // console.log(predProb[1]+":"+testY[455])
        for (let i = 0; i < testY.length; i++) {
            //  console.log(predProb[i*2]+":"+predProb[i*2+1]+"|"+testY[i])
            console.log(predProb[i*2]+":"+predProb[i*2+1]+"|"+testY[i])
        }

        let corect=0;
        let contt=0;
        for (let i = 0; i < testY.length; i++) {
         
                if(testY[i][0]==1)
                {
                    contt++;
                    
                    if(predProb[i*2]>0.15){
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
        console.log("predfinish");
        // model.save('file://./12345.json');
        // const saveResults =  model.save('file://./12345.json');
        // tf.saved_model.save(module, './12345.json')
      });


    //   x=None, y=None, batch_size=None, epochs=1, verbose='auto',
    //   callbacks=None, validation_split=0.0, validation_data=None, shuffle=True,
    //   class_weight=None, sample_weight=None, initial_epoch=0, steps_per_epoch=None,
    //   validation_steps=None, validation_batch_size=None, validation_freq=1,
    //   max_queue_size=10, workers=1, use_multiprocessing=False
   
    

    // let trainData = []
    // for (let i = 0; i < /*trainX.length*/2; i++) {
    //     trainData.push({ input: trainX[i], output: [trainY[i]] })
    // }
    // console.log("Start Train");
    // net.train(trainData, {
    //     log: detail => console.log(detail),
    //     // errorThresh: 0.005, // порог ошибок, которого нужно достичь
    //     iterations: 100, // максимальное число итераций обучения
    //     // logPeriod: 10, // число итераций между логированиями
    //     // learningRate: 0.3 // степень обучения
    // });
    // fs.writeFileSync("net.json", JSON.stringify(net.toJSON()));


    // console.log("Check");
    // for (let i = 0; i < testX.length; i++) {
    //     console.log(/*Math.round(*/net.run(testX[i])/*)*/ + ":" + testY[i])
    // }
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

