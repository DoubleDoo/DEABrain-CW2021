// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcRenderer, ipcMain } = require('electron')
const path = require('path')
const papa = require('papaparse')
const fs = require('fs');
const { dialog } = require('electron');
const { Console } = require('console');
const bci = require('bcijs');
var Fili = require('fili');
// i=0;
// let res = [];
// fs.readFile("data_samples/data.csv", 'utf-8', (err, data) => {
//   if (err) {
//     console.log("An error ocurred reading the file :" + err.message);
//     return;
//   }
//   papa.parse(data, {
//     header: true,
//     complete: function (results) {
//       let dataMas = [];
//       let index = 0;
//       results.data.map(element => {
//         let x = 0;
//         dataMas.push(
//           {
//             sampleNum: index,
//             electrodesPositions: ["Fz"],
//             electrodesValues: [element["Fz"]],
//             subjectId: "Dubinich",
//             time: index*0.005,
//           })
//         index = index + 1;
//       });
//       diviceSimulation=dataMas
//     }
//   })
//   console.log(diviceSimulation);
// });

// let samplerate = 512;
// let signal = bci.generateSignal([8, 4], [8, 17], samplerate, 1);

// // Compute relative power in each frequency band
// let bandpowers = bci.bandpower(signal, samplerate, ['alpha', 'beta'], {relative: true});

// console.log(bandpowers); // [ 0.6661457715567836, 0.199999684787573 ]

// (async () => {
//   // Load training data
//   let data = await bci.loadCSV('../neuroNet/data_samples/data.csv');
//   let res = await bci.loadCSV('../neuroNet/data_samples/TrainLabels.csv');
//   // print(data);
//   // Project it with CSP
//   let cspParams = bci.cspLearn(data);

//   // Compute training data features
//   let featuresFeetTraining = computeFeatures(cspParams, data);


//   // Learn an LDA classifier
//   let ldaParams = bci.ldaLearn(featuresFeetTraining);

// })();

// function computeFeatures(cspParams, eeg) {
//   let epochSize = 64; // About a fourth of a second per feature
//   let trialLength = 750; // Each set of 750 samples is from a different trial


//   let features = bci.windowApply(eeg, trial => {
//     // Apply CSP over each 64 sample window with a 50% overlap between windows
//     return bci.windowApply(trial, epoch => {
//       // Project the data with CSP and select the 16 most relevant signals
//       let cspSignals = bci.cspProject(cspParams, epoch, 16);
//       // Use the log of the variance of each signal as a feature vector
//       return bci.features.logvar(cspSignals, 'columns');
//     }, epochSize, epochSize / 2);
//   }, trialLength, trialLength);

//   // Concat the features from each trial
//   return [].concat(...features);
// }

app
  .commandLine
  .appendSwitch('enable-web-bluetooth', true);

app
  .commandLine
  .appendSwitch('enable-experimental-web-platform-features', true);



//Получение сохраненных данных
function getSavedData(data) {
  let defaultPath = 'data/'
  if (!fs.existsSync(defaultPath + "save.txt")) {
    console.log("No save file")
    let mas = {
      savesPath: "data_samples/appPath",
      appPath: "data_samples/save.txt",
      netPath: "data_samples/netPath",
      theme: "light",
    }
    fs.writeFileSync(defaultPath + "save.txt", JSON.stringify(mas), (err) => {
      if (err) {
        throw err;
      }
    });
    console.log("Created new one...")
    console.log(mas);
    return mas;
  }
  else {
    console.log("Save file found");
    let mas = fs.readFileSync(defaultPath + "save.txt", 'utf8', function (err, dat) {
      if (err) {
        return console.log(err);
      }
      return dat;
    })
    mas = JSON.parse(mas)
    console.log("Reading...");
    console.log(mas);
    return mas;
  }

}

//Создние окна
function createWindow() {
  let selectCallback = () => { };
  let nextDevice = null;
  let savedData = null;
  let dataGetProcess = false;
  let isBlinking = false;
  let dataGetProcessPause = true;
  let readedSesionData = [];
  let diviceSimulation = [];
  let i = 0
  let pausei = 0
  let indexx=0

  function readData() {
    saveData();
    return readedSesionData[i - 1]
  }

  function saveData() {
    readedSesionData.push(
      diviceSimulation[i]
    )
    i += 1;
  }

  function timerInit() {
    i = 0;
    let res = [];
    fs.readFile("../neuroNet/data_samples/data.csv", 'utf-8', (err, data) => {
      if (err) {
        console.log("An error ocurred reading the file :" + err.message);
        return;
      }
      papa.parse(data, {
        header: true,
        complete: function (results) {
          let dataMas = [];
          let index = 0;
          results.data.map(element => {
            let x = 0;
            dataMas.push(
              {
                sampleNum: index,
                electrodesPositions: ["Fz"],
                electrodesValues: [element["Fz"]],
                subjectId: "Dubinich",
                time: index * 0.005,
              })
            index = index + 1;
          });
          diviceSimulation = dataMas
        }
      })
      console.log(diviceSimulation);
    });
  }

  function sendData(data) {
    if (dataGetProcessPause == false)
      mainWindow.webContents.send("eeg-new-data", data);
  }

  function timerSetUp() {
    timerInit();
    setTimeout(function run() {
      sendData(readData())
      if (dataGetProcess == true)
        setTimeout(run, 100);
    }, 100);

  }

  console.log("Started");
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen :false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }


  })

  savedData = getSavedData();

  mainWindow.loadURL('http://localhost:8080');
  //mainWindow.loadFile('build/index.html')

  mainWindow.webContents.openDevTools()

  //окно выбора девайса
  mainWindow.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault();
    selectCallback = callback;
    if (nextDevice != null) {
      console.log(nextDevice);
      console.log(deviceList);
      callback(nextDevice.deviceId);
    }
    else
      mainWindow.webContents.send("bluetooth-list-update", { data: deviceList });
    //console.log("found");
    //callback("");
  })

  //Выбор девайса
  ipcMain.on('bluetooth-device-select', (event, value) => {
    console.log(value);
    mainWindow.webContents.send("bluetooth-list-update-stop", { res: true });
    console.log(value.id + " selected");
    selectCallback(value.id);
  })

  ipcMain.on('next-device-select', (event, value) => {
    //console.log(value);
    nextDevice = value.data;
  })



  //Пикер нейросети
  ipcMain.on("net-file-picker", (event, arg) => {
    var path = dialog.showOpenDialog({
      properties: ['openFile']
    }).then(
      (data) => {
        savedData.netPath = data.filePaths[0];
        fs.writeFileSync('data/save.txt', JSON.stringify(savedData), (err) => {
          if (err) {
            throw err;
          }
        });
        mainWindow.webContents.send("net-file-picker", { data: data.filePaths[0] });
      }
    )
  })

  //Пикер папки данных
  ipcMain.on("data-path-picker", (event, arg) => {
    var path = dialog.showOpenDialog({
      properties: ['openDirectory']
    }).then(
      (data) => {
        savedData.appPath = data.filePaths[0];
        fs.writeFileSync('data/save.txt', JSON.stringify(savedData), (err) => {
          if (err) {
            throw err;
          }
        });
        mainWindow.webContents.send("data-path-picker", { data: data.filePaths[0] });
      }
    )
  })

  //Пикер папки сохранений
  ipcMain.on("saves-path-picker", (event, arg) => {
    var path = dialog.showOpenDialog({
      properties: ['openDirectory']
    }).then(
      (data) => {
        savedData.savesPath = data.filePaths[0];
        fs.writeFileSync('data/save.txt', JSON.stringify(savedData), (err) => {
          if (err) {
            throw err;
          }
        });
        mainWindow.webContents.send("saves-path-picker", { data: data.filePaths[0] });
      }
    )
  })

  //Пикер темы
  ipcMain.on("theme-picker", (event, arg) => {
    savedData.theme = arg.theme
    fs.writeFileSync('data/save.txt', JSON.stringify(savedData), (err) => {
      if (err) {
        throw err;
      }
    });
    mainWindow.webContents.send("theme-picker", { data: arg.theme });
  })


  //Передача сохраненных параметров
  ipcMain.on("saved-values", (event, arg) => {
    mainWindow.webContents.send("saved-values", { data: savedData });
  })


  //Сохранение сессии
  ipcMain.on("save-session", (event, arg) => {
    let date = new Date();
    console.log(date.toString())
    fs.writeFileSync(savedData.savesPath + "\\" + date.getDate().toString() + "-" + date.getTime().toString() + "session.txt", JSON.stringify(readedSesionData), (err) => {
      if (err) {
        throw err;
      }
    });
    console.log("Created save")
    mainWindow.webContents.send("save-session", {});
  })

  //Открыть сохранение
  ipcMain.on("open-session", (event, arg) => {
    var path = dialog.showOpenDialog({
      properties: ['openFile']
    }).then(
      (data) => {
        console.log("Save file found");
        let mas = fs.readFileSync(data.filePaths[0], 'utf8', function (err, dat) {
          if (err) {
            return console.log(err);
          }
          return dat;
        })
        readedSesionData = [];
        diviceSimulation = [];
        mas = JSON.parse(mas)
        pausei = 0;
        i = mas.length;
        console.log("Reading...");
        console.log(mas);
        readedSesionData = mas;
        do {
          mainWindow.webContents.send("eeg-new-data", readedSesionData[pausei]);
          // console.log(readedSesionData[pausei])
          pausei++;
        } while (pausei < i);
      }
    )
    mainWindow.webContents.send("open-session", {});
  })

  //Остановить считывание
  ipcMain.on("stop-session", (event, arg) => {
    if (dataGetProcessPause) {
      console.log("________________________")
      do {
        mainWindow.webContents.send("eeg-new-data", readedSesionData[pausei]);
        // console.log(readedSesionData[pausei])
        pausei++;
      } while (pausei < i);
      console.log("________________________")
      dataGetProcessPause = false;
    }
    else {
      dataGetProcessPause = true;
      pausei = i;
    }
    mainWindow.webContents.send("stop-session", {});
  })

  //Начать считывание
  ipcMain.on("start-session", (event, arg) => {
    if (!dataGetProcess) {
      dataGetProcess = true;
      dataGetProcessPause = false;
      // timerSetUp();
    }
    else {
      dataGetProcess = false;
      dataGetProcessPause = true;
      readedSesionData = [];
      diviceSimulation = [];
      i = 0
      pausei = 0
    }
    mainWindow.webContents.send("start-session", {});
  })

  ipcMain.on("read-data", (event, arg) => {
    if (dataGetProcess) {
      if (dataGetProcessPause == false)
      mainWindow.webContents.send("eeg-new-data",  {
            sampleNum: indexx,
            electrodesPositions: ["P0"],
            electrodesValues: [arg],
            subjectId: "Dubinich",
            time: indexx * 0.005,
          });
    }
    indexx++;
  })

  // return dataMas.push(
  //   {
  //     sampleNum: index,
  //     electrodesPositions: ["Fz"],
  //     electrodesValues: [element["Fz"]],
  //     subjectId: "Dubinich",
  //     time: index * 0.005,
  //   })

  ipcMain.on("enter-row", (event, arg) => {

  })

  ipcMain.on("enter-col", (event, arg) => {

  })

  ipcMain.on("enter-cell", (event, arg) => {

  })

  ipcMain.on("enter-start", (event, arg) => {
    if (!isBlinking) {
      isBlinking = true;
      oneCycle(0);
      // setTimeout(()=>mainWindow.webContents.send("enter-col", {id:1,timeout:500}),500)
      // setTimeout(()=>mainWindow.webContents.send("enter-col", {id:2,timeout:500}),500)
      // setTimeout(function Blink() {
      //   sendData(readData())
      //   if (dataGetProcess==true)
      //   setTimeout(run, 100);
      // }, 100);
    }
    else {
      isBlinking = false;

    }
    // mainWindow.webContents.send("enter-cell", {row:1,col:2});
    // mainWindow.webContents.send("enter-col", {id:1,timeout:350});
  })


  function setTimeoutKeyboard() {

    oneCycle();
    secondCycle();

  }

  function oneCycle(i) {
    if (isBlinking) {
      if (i < 6) {
        setTimeout(() => {
          mainWindow.webContents.send("enter-col", { id: i, timeout: 1000 })
          oneCycle(++i);
        }, 1000)
      }
      else {
        secondCycle(0)
      }
    }
  }

  function secondCycle(i) {
    if (isBlinking) {
      if (i < 6) {
        setTimeout(() => {
          mainWindow.webContents.send("enter-row", { id: i, timeout: 1000 })
          secondCycle(++i);
        }, 1000)
      }
      else {
        oneCycle(0)
      }
    }
  }

}


// После инициализации
app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})


// Выход
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

