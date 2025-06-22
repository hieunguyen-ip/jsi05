
 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 const firebaseConfig = {
   apiKey: "AIzaSyCmqL5PC6vil-1pU2xWkbMuS3w4QVFQ9kA",
   authDomain: "jsi05-35a7b.firebaseapp.com",
   databaseURL: "https://jsi05-35a7b-default-rtdb.firebaseio.com",
   projectId: "jsi05-35a7b",
   storageBucket: "jsi05-35a7b.firebasestorage.app",
   messagingSenderId: "881389229214",
   appId: "1:881389229214:web:a4eec1039aaf45c633578f",
   measurementId: "G-9QD9TD3KG0"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const analytics = getAnalytics(app);
 console.log(app)