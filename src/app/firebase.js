// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration (test)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyD0qB9L3Anfz_phSK6oOV94NOHN1YLIOUQ",
//     authDomain: "kreate-stripe-api-2.firebaseapp.com",
//     projectId: "kreate-stripe-api-2",
//     storageBucket: "kreate-stripe-api-2.appspot.com",
//     messagingSenderId: "970953021434",
//     appId: "1:970953021434:web:f2b6126f5a8c97073db643",
//     measurementId: "G-L977BKXGRM",
// };

const firebaseConfig = {
  apiKey: "AIzaSyACU3aPjBaQHgIk1M7O457YteYN5mYW27g",
  authDomain: "kreatewebsite-new-template.firebaseapp.com",
  projectId: "kreatewebsite-new-template",
  storageBucket: "kreatewebsite-new-template.appspot.com",
  messagingSenderId: "988959267955",
  appId: "1:988959267955:web:abaa1ec3024f81c78d9e06",
  measurementId: "G-ET064B0ZTC",
  databaseURL: "https://kreatewebsite-new-template-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
export const database = getDatabase(firebaseApp);
const auth = firebase.auth();

export const db = getFirestore(firebaseApp);

export { auth };
