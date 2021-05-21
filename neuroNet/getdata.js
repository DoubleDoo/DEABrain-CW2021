const bci = require('bcijs');
const path = require('path')
const papa = require('papaparse')
const fs = require('fs');
var brain = require("brain.js");
var Fili = require('fili');
const { Console } = require('console');
const { DH_CHECK_P_NOT_SAFE_PRIME } = require('constants');


let allEpoches=[]
let allAnsers=[]
let counter=0;
let fin=0;
console.log("Start")
readAllCSV();


function readAllCSV() {
    var fs = require('fs');
    var files = fs.readdirSync('./data_samples/train/');
    let i = 0;
    let fileName = "";
    fin= files.length;
    for (i = 0; i < files.length; i++) {
        fileName = files[i].substr(5, 10);
        console.log(fileName);

        fs.readFile("./data_samples/train/" + files[i], 'utf-8', (err, data) => {
            papa.parse(data, {
                header: true,
                complete: function (results) {
                    let dataMas = [];
                    let inNaxnol = [];
                    let indexMas = [];
                    let index = 0;
                    results.data.map(element => {
                        dataMas.push(parseFloat(element["Fz"]))
                        if (parseFloat(element["FeedBackEvent"]) == 1) {
                            indexMas.push(index)
                        }
                        index = index + 1;
                    });

                    fs.readFile("./data_samples/TrainLabels.csv", 'utf-8', (err, data) => {
                        papa.parse(data, {
                            header: true,
                            complete: function (results) {
                                let dataMas2 = [];
                                let index = 0;
                                results.data.map(element => {
                                    if (element["IdFeedBack"].indexOf(fileName) != -1) {
                                        dataMas2.push(parseFloat(element["Prediction"]))
                                        index = index + 1;
                                    }
                                });
                                process(dataMas,dataMas2,indexMas);
                                counter++;
                                if (counter==fin) finished();
                            }
                        })
                    });
                }
            })
        });
    }
}





function Epoches(data,resIndex,len,res) {
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
    return dataf;
}





function process(data, res, index) {

   // console.log(data.length + ":" + res.length + ":" + index.length)
   
    // console.log()
    // data=LowPass(data); 

    // data=HighPass(data); 

    var values = Epoches(data,index,200,res);
    var samples = values[0];
    var ansers = values[1];

    // console.log("sample--start")
    // console.log(samples[0])
    // console.log("LOW")
    // console.log(LowPass(samples[0]))
    // console.log("HIGH")
    // console.log(HighPass(samples[0]))
    // console.log("BOTH")
    // console.log(Norm(samples[0]))
    // console.log("sample--end")


    // for (let i = 0; i < samples.length; i++) { 
    //     samples[i]=Norm(samples[i])
    //     samples[i]=LowPass(samples[i])
    // }

    //samples=Medium(samples);

    // samples=Decimation(samples,4);

    allEpoches=allEpoches.concat(samples)
    allAnsers=allAnsers.concat(ansers)
    
    console.log(allEpoches.length+":"+allAnsers.length);

}


function finished() {
    console.log(allEpoches.length+":"+allAnsers.length+"DONE");
    console.log(allEpoches[0]);
    fs.writeFileSync("trainData.json", JSON.stringify([allEpoches,allAnsers]));
}






