var firebase = require("firebase/app");

module.exports = () => {

    let firebaseConfig = {
        apiKey: "AIzaSyDiF6vNp_7nbzs4nNnMTNOM1jtcvetOUvQ",
        authDomain: "teams-fecd7.firebaseapp.com",
        projectId: "teams-fecd7",
        storageBucket: "teams-fecd7.appspot.com",
        messagingSenderId: "225820043463",
        appId: "1:225820043463:web:c8e7ebd2d38e3126f036e2",
        measurementId: "G-HLLYFL2YNV"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

}