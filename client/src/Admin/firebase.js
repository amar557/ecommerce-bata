import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyC_dwcVaeYeaEM-xow7DWvGOUNQLv7eOIQ",
  authDomain: "e-commerce-a365f.firebaseapp.com",
  projectId: "e-commerce-a365f",
  storageBucket: "e-commerce-a365f.appspot.com",
  messagingSenderId: "808881580202",
  appId: "1:808881580202:web:2c8fce94fd815459b048d3",
  measurementId: "G-7LKNBH1F37",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
