import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZml-bdj8YpnBkv3wT96OMrvjVUhONrXA",
  authDomain: "firebastodo.firebaseapp.com",
  projectId: "firebastodo",
  storageBucket: "firebastodo.appspot.com",
  messagingSenderId: "506050196487",
  appId: "1:506050196487:web:16a36389102a6e4d0866a2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const dbb = getFirestore(app);

export const db = dbb;
export const auth = getAuth();
