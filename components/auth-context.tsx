'use client'
import { createContext,useContext,useEffect,useState } from 'react'
import { api } from '@/lib/api'
const C=createContext<any>(null)
export function AuthProvider({children}:{children:React.ReactNode}){const [ready,setReady]=useState(false);const [authed,setAuthed]=useState(false);useEffect(()=>{const id=window.setTimeout(()=>{setAuthed(!!sessionStorage.getItem('unipath_token'));setReady(true)},0);return()=>window.clearTimeout(id)},[]);const login=async(e:string,p:string)=>{const r=await api.login(e,p);sessionStorage.setItem('unipath_token',r.access_token);setAuthed(true)};const logout=()=>{sessionStorage.removeItem('unipath_token');setAuthed(false)};return <C.Provider value={{ready,authed,login,logout}}>{children}</C.Provider>}
export const useAuth=()=>useContext(C)
