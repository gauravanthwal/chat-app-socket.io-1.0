var moment = require("moment"); // require

const generateMessage = (username, text)=>{
    return {
        username,
        text,
        createdAt: moment().format('h:mm a')
    }
}


module.exports = { generateMessage};