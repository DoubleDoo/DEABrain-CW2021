// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcRenderer, ipcMain } = require('electron')
const path = require('path')
const papa = require('papaparse')
const fs = require('fs');
const { dialog } = require('electron');
const { Console } = require('console');

app
  .commandLine
  .appendSwitch('enable-web-bluetooth', true);

app
  .commandLine
  .appendSwitch('enable-experimental-web-platform-features', true);

  

//Получение сохраненных данных
function getSavedData(data) {
  let defaultPath = 'data_samples/'
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
    let mas= fs.readFileSync(defaultPath + "save.txt", 'utf8', function (err, dat) {
      if (err) {
        return console.log(err);
      }
      return dat;
    })
    mas=JSON.parse(mas)
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
  let dataGetProcess=false;
  let dataGetProcessPause=true;
  let readedSesionData=[];
  let diviceSimulation=[];
  let i=0
  let pausei=0

  function readData(){
    saveData();
    return readedSesionData[i-1]
  }

  function saveData(){
    readedSesionData.push(
      diviceSimulation[i]
    )
    i+=1;
  }

  function timerInit(){
    i=0;
    let res = [];
    fs.readFile("data_samples/data.csv", 'utf-8', (err, data) => {
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
                time: index*0.005,
              })
            index = index + 1;
          });
          diviceSimulation=dataMas
        }
      })
      console.log(diviceSimulation);
    });
  }

  function sendData(data){
    if (dataGetProcessPause==false)
    mainWindow.webContents.send("eeg-new-data", data);
  }

  function timerSetUp () {
    timerInit();
    setTimeout(function run() {
      sendData(readData())
      if (dataGetProcess==true)
      setTimeout(run, 100);
    }, 100);

  }

  console.log("Started");
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }


  })

  savedData=getSavedData();

  mainWindow.loadURL('http://localhost:8080');
  console.log("Loaded");

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
        savedData.netPath =data.filePaths[0];
          fs.writeFileSync('data_samples/save.txt', JSON.stringify(savedData), (err) => {
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
        savedData.appPath =data.filePaths[0];
          fs.writeFileSync('data_samples/save.txt', JSON.stringify(savedData), (err) => {
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
        savedData.savesPath =data.filePaths[0];
          fs.writeFileSync('data_samples/save.txt', JSON.stringify(savedData), (err) => {
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
          savedData.theme =arg.theme
            fs.writeFileSync('data_samples/save.txt', JSON.stringify(savedData), (err) => {
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
  fs.writeFileSync(savedData.savesPath +"\\"+ date.getDate().toString()+"-"+date.getTime().toString()+"session.txt", JSON.stringify(readedSesionData), (err) => {
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
     let mas= fs.readFileSync(data.filePaths[0], 'utf8', function (err, dat) {
       if (err) {
         return console.log(err);
       }
       return dat;
     })
     mas=JSON.parse(mas)
     pausei=0;
     i=mas.length;
     console.log("Reading...");
     console.log(mas);
     readedSesionData=mas;
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
  if(dataGetProcessPause){
    console.log("________________________")
  do {
    mainWindow.webContents.send("eeg-new-data", readedSesionData[pausei]);
    // console.log(readedSesionData[pausei])
    pausei++;
  } while (pausei < i);
  console.log("________________________")
  dataGetProcessPause=false;
  }
  else{
  dataGetProcessPause=true;
  pausei=i;
  }
  mainWindow.webContents.send("stop-session", {});   
})

//Начать считывание
ipcMain.on("start-session", (event, arg) => {
  if(!dataGetProcess){
  dataGetProcess=true; 
  dataGetProcessPause=false;
  timerSetUp();
  }
  else{
    dataGetProcess=false; 
  dataGetProcessPause=true;
  i=0;
  pausei=0;
  }
  mainWindow.webContents.send("start-session", {});   
})

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

