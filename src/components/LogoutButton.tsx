'use client'
import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut()} 
      className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
    >
      Sair
    </button>
  )
}