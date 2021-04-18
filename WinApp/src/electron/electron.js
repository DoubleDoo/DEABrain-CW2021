// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcRenderer, ipcMain } = require('electron')
const path = require('path')
const papa = require('papaparse')
const fs = require('fs');
const { dialog } = require('electron')

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

  //   // let file = new File(["Data1"], "../../data_samples/Data1.csv", {
  //   // type: "text/plain",
  //   // });
  //   // const fs = require('fs');
  //   let res=[];
  //   fs.readFile("data_samples/Data1.csv", 'utf-8', (err, data) => {
  //       if(err){
  //         console.log("An error ocurred reading the file :" + err.message);
  //           return;
  //       }

  //       // Change how to handle the file content

  //       papa.parse(data,{
  //         header:true,
  //         complete: function(results) {
  //             //console.log(results.data);


  //             let dataMas=[];
  //             let index=0;
  //             results.data.map(element => {
  //               let x=0;
  //               if(element["sample num"]==index&&element["sensor position"]=="FP1")
  //             dataMas.push(
  //               {
  //                 sampleNum:element["sample num"],
  //                 electrodesPositions:[element["sensor position"]],
  //                 electrodesValues:[element["sensor value"]],
  //                 subjectId:"Dubinich",
  //                 time:"19:00 14.04.2021"
  //             })
  //             index=index+1;
  //             });

  //             index=0;
  //             results.data.map(element => {
  //               if(element["sample num"]==index&&element["sensor position"]=="FP2")
  //               {
  //                 let buf=dataMas[index];
  //                 buf.electrodesPositions.push(element["sensor position"]);
  //                 buf.electrodesValues.push(element["sensor value"]);
  //                 //console.log(buf);
  //                 index=index+1;
  //               }
  //             });

  //           i=0;  
  //           let timerId = setInterval(() => {
  //               //console.log(dataMas[i])
  //               mainWindow.webContents.send("eeg-new-data",dataMas[i]);
  //               i++;

  //           }, 100);


  //             setTimeout(() => { clearInterval(timerId); console.log("stop"); }, 25000);
  //             }})            
  //       });  
  ipcMain.on('get-data', (event, value) => {


    // let file = new File(["Data1"], "../../data_samples/Data1.csv", {
    // type: "text/plain",
    // });
    // const fs = require('fs');
    let res = [];
    fs.readFile("data_samples/data.csv", 'utf-8', (err, data) => {
      if (err) {
        console.log("An error ocurred reading the file :" + err.message);
        return;
      }

      // Change how to handle the file content

      papa.parse(data, {
        header: true,
        complete: function (results) {
          //console.log(results.data);


          let dataMas = [];
          let index = 0;
          results.data.map(element => {
            let x = 0;
            dataMas.push(
              {
                sampleNum: index,
                electrodesPositions: ["C1"],
                electrodesValues: [element["C1"]],
                subjectId: "Dubinich",
                time: element["Time"]
              })
            index = index + 1;
          });


          i = 0;
          let timerId = setInterval(() => {
            //console.log(dataMas[i])
            mainWindow.webContents.send("eeg-new-data", dataMas[i]);
            i++;

          }, 5);


          setTimeout(() => { clearInterval(timerId); console.log("stop"); }, 25000);
        }
      })
    });


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

