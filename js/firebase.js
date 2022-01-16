// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARwPEaojd8tlXTY8d94rIvXZNKX_i7cFA",
  authDomain: "nurse-log.firebaseapp.com",
  databaseURL: "https://nurse-log-default-rtdb.firebaseio.com",
  projectId: "nurse-log",
  storageBucket: "nurse-log.appspot.com",
  messagingSenderId: "129280117500",
  appId: "1:129280117500:web:ae55336ff9e016f7a4e579"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// Fetch all data in firebase
const dbRef = firebase.database().ref();
