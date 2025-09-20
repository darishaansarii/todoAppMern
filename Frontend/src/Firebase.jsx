import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDG9bmSVrYroiJSO-mzaVMGlM31yGvbMk0",
    authDomain: "todoappwithreact-96b51.firebaseapp.com",
    projectId: "todoappwithreact-96b51",
    storageBucket: "todoappwithreact-96b51.firebasestorage.app",
    messagingSenderId: "745801914912",
    appId: "1:745801914912:web:4141c960da70cb1c26fa45"
  };


  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  export {db};