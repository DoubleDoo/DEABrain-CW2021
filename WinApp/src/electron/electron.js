// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcRenderer,ipcMain } = require('electron')
const path = require('path')
const papa = require('papaparse')
const fs = require('fs');

app
  .commandLine
  .appendSwitch('enable-web-bluetooth', true);

app
  .commandLine
  .appendSwitch('enable-experimental-web-platform-features', true);

function createWindow () {
  // Create the browser window.
  let selectCallback=()=>{};
  let nextDevice=null;

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

  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:8080');
  console.log("Loaded");
  
  mainWindow.webContents.openDevTools()

  mainWindow.webContents.on('select-bluetooth-device', (event, deviceList,callback) => {
    event.preventDefault();
    selectCallback=callback;
    if(nextDevice!=null)
    {
      console.log(nextDevice);
      console.log(deviceList);
      callback(nextDevice.deviceId);
    }
    else
    mainWindow.webContents.send("bluetooth-list-update",{data:deviceList});
    //console.log("found");
    //callback("");
  })

  ipcMain.on('bluetooth-device-select', (event, value) => {
    console.log(value);
    mainWindow.webContents.send("bluetooth-list-update-stop",{res:true});
    console.log(value.id+" selected");
    selectCallback(value.id);
    })

    ipcMain.on('next-device-select', (event, value) => {
      //console.log(value);
      nextDevice=value.data;
      })


      ipcMain.on('get-data', (event, value) => {


        // let file = new File(["Data1"], "../../data_samples/Data1.csv", {
        // type: "text/plain",
        // });
        // const fs = require('fs');
        let res=[];
        fs.readFile("data_samples/Data1.csv", 'utf-8', (err, data) => {
            if(err){
              console.log("An error ocurred reading the file :" + err.message);
                return;
            }
    
            // Change how to handle the file content

            papa.parse(data,{
              header:true,
              complete: function(results) {
                  //console.log(results.data);
                  

                  let dataMas=[];
                  let index=0;
                  results.data.map(element => {
                    let x=0;
                    if(element["sample num"]==index&&element["sensor position"]=="FP1")
                  dataMas.push(
                    {
                      sampleNum:element["sample num"],
                      electrodesPositions:[element["sensor position"]],
                      electrodesValues:[element["sensor value"]],
                      subjectId:"Dubinich",
                      time:"19:00 14.04.2021"
                  })
                  index=index+1;
                  });

                  index=0;
                  results.data.map(element => {
                    if(element["sample num"]==index&&element["sensor position"]=="FP2")
                    {
                      let buf=dataMas[index];
                      buf.electrodesPositions.push(element["sensor position"]);
                      buf.electrodesValues.push(element["sensor value"]);
                      //console.log(buf);
                      index=index+1;
                    }
                  });

                i=0;  
                let timerId = setInterval(() => {
                    //console.log(dataMas[i])
                    mainWindow.webContents.send("eeg-new-data",dataMas[i]);
                    i++;
                
                }, 100);

            
                  setTimeout(() => { clearInterval(timerId); console.log("stop"); }, 25000);
                  }})            
            });  

      
      })
      

  //bluetooth-device-select
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
   createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.

    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })


})



  

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
