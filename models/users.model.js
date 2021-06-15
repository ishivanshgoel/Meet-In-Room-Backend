const { db } = require("../setup/firebase/firebase.setup")

class User {
    constructor() {

        // name of the collection in firestore
        this.collection='users'
    }

    // add new user
    async add(uid, email) {
        await db.collection(this.collection).doc(uid).set({
            email: email
        });
    }

    // fetches all the users
    async getAll(){
        db.collection('users').get().then((data)=>{
            constactList = data.docs.map(doc => {
                return {
                    ui: doc.id,
                    email: doc.data().email
                }   
            })

            res.json(constactList)
        }).catch((err)=>{
            next(err)
        })
    }
}

module.exports = User