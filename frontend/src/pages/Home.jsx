import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../utils/firebase';
import React from 'react'
import api from '../../utils/axios';
import {FcGoogle} from "react-icons/fc"

function Home() {

    const handleSignIn = async (token) => {
        try {
          const {data}=await api.post("/api/auth/login",{token})
          console.log(data)
        }
        catch(error){
          console.log( error);
        }
      }
      const googleSignIn =async () => {
          const data=await signInWithPopup(auth,googleProvider)
          const token= await data.user.getIdToken()
          console.log(token)
          await handleSignIn(token) 
          console.log(data)
      }

    return (   
        <div className='h-screen flex bg-black text-white overflow-hidden'>
            
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
               <div className='w-[340px] p-7 bg-[#13152c] border border-white/[0.1] rounded-2xl flex flex-col gap-4'>
                 <div className='flex flex-col gap-1'>
                    <h2 className='text-[17px] font-semibold text-slate-100 tracking-tight'>Welcome to MultiplexAI</h2>
                    <p className='text-[13px] text-slate-400'>Please login to continue using app</p>
                                

                    </div>
                    <button  className='w-full flex item-center justify-center gap-3 py-[11px]
                     rounded-xl text-sm font-medium text-white bg-linear-to-br from-indigo-500 
                     to-violet-700 hover:from-indigo-400 hover:to-violet-600 active:from-indigo-600 
                     active:to-violet-800 border border-indigo-500/40 shadow-lg shadow-indigo-500/20
                      hover:shadow-indigo-500/40 transition-all duration-150 cursor-pointer' onClick={googleSignIn}>
                        <FcGoogle size={20} className='text-white'/>
                        Continue with Google
                    </button>

            
                </div>

            </div>
            
        </div>
    )
}
export default Home;

