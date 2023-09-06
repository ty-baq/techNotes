const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

//create a logevent function to create a new directory (if it does not exist) and save the log
const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try{
        //if path does not exist create the directory
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname,'..','logs', logFileName), logItem)
    }catch(err){
        console.log(err)
    }
}

// use the log events function created in the logger middleware created below
const logger = (req,res,next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqlog.log')
    console.log(`${req.method} ${req.path}`)
    next()
}

module.exports = { logEvents, logger}