import React from 'react'
import { FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const navigate=useNavigate()
    const handelLogOut = () => {
        navigate("/")
    }
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow">
      <div className="text-xl font-bold">Chat App</div>
      <div className="flex items-center gap-4">
        {/* User Avatar */}
        <img
          src="https://ui-avatars.com/api/?name=User"
          alt="User Avatar"
          className="w-10 h-10 rounded-full border"
        />
        {/* Logout Icon */}
        <button className="text-gray-600 hover:text-red-500 transition-colors" title="Logout" onClick={handelLogOut}>
          <FiLogOut size={24} />
        </button>
      </div>
    </header>
  )
}

export default Header