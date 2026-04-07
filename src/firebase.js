import { initializeApp } from "firebase/app"
import { collection, getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCxUnYnSXTHK1ingo9tJKBGQqf5FmV-3Ko",
  authDomain: "dtp-icpc1hn-work.firebaseapp.com",
  projectId: "dtp-icpc1hn-work",
  storageBucket: "dtp-icpc1hn-work.firebasestorage.app",
  messagingSenderId: "465165644337",
  appId: "1:465165644337:web:e25ff35fae2bf52ca15b10",
  measurementId: "G-JF6CCNX18K",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig, "dtp icpc1hn work")

const db = getFirestore(app)

const reloadPage = collection(db, "ReloadPage")
const notiAll = collection(db, "NotiAll")
const sendNoti = collection(db, "SendNoti")
export { notiAll, reloadPage, sendNoti }
