import { signInWithPopup } from 'firebase/auth';
import React from 'react'
import { auth, googleProvider } from '../utils/firebase';


 function App() {
  const googleSignIn =async () => {
      const data=await signInWithPopup(auth,googleProvider)
       console.log(data)
  }
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">  
      
      <button className="w-50 h-24 bg-white" onClick={googleSignIn}>
        Continue with Google
      </button>
    </div>
  )
}

export default App;
