// call controller

// mananage call
module.exports = (recieverId) =>{
    return new Promise((resolve, reject) => {

        // query the database to check the user availablity status
        let busy=false

        if(!busy) resolve(true)
        reject('User Busy')
    })
}