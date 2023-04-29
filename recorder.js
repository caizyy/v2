const fs = require('fs')
const { stdin, stdout } = require("process")
const { colortext } = require("./recolor.js")
const { exec, spawn } = require("child_process")
const { error } = require('console')

const dev_config = {
    "noclearconsole" : false
}

const setupTerminal = (cb)=>{
    stdin.setRawMode(true)
    stdin.setEncoding('utf8')
    stdin.resume()
    try {

    } catch (error) {
        console.log(error)
    }
}
setupTerminal()
var [recording, fps, ui] = [false, 60, ""]
const getui = ()=>{
    return(`
    ${!recording ? `${colortext("  Record   [enter]", "gray")}     fps:${fps} [up/down]` : `${colortext(" Recording [enter]", "red")}     ${colortext(`fps:${fps} [up/down]`, "gray")} `} 
    `)
}
console.clear()
console.log(getui())

const call_event_listener = (table)=>{
    table.forEach(callback => {
        callback()
    });
}
var recorder = false
var record_event_listener = {
    "onstop": [
        ()=>{//actually start recording
            console.log("started")
            recorder = spawn('./ffmpeg.exe', ['-f',  'gdigrab', '-framerate', `${fps}`, '-i', 'desktop', `./output/output${Date.now()}.mp4`])
            recorder.on("error", (error)=>{
                console.log(error)
            })
        }
    ],
    "onstart": [
        ()=>{//stop recording
            let rcordercopy = recorder
            if (rcordercopy){
                rcordercopy.stdin.write("q")
            }
        }
    ]
}
var terminal_event_listener = {
    '\u0003': ()=>{//ctrl c
        console.clear()
        process.exit()
    },
    '\u000D': ()=>{//enter
        if(!recording){//stop recording
            call_event_listener(record_event_listener.onstop)

            recording = true
        } else{//start recording
            call_event_listener(record_event_listener.onstart)

            recording = false
        }
    },
    '\u001B\u005B\u0042': ()=>{// down arrow
        if (!recording && fps > 5){
            fps = fps - 5
        }
    },
    '\u001B\u005B\u0041': ()=>{// up arrow
        if (!recording && fps < 60){
            fps = fps + 5
        }
    },
}
stdin.on('data', (key)=>{
    if(terminal_event_listener[key]){
        terminal_event_listener[key]()
    }
    if (!dev_config.noclearconsole){
        console.clear()
    }
    console.log(getui())
})
process.title = ">w< recorder"