import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosWithHeaders from "../Helper/axiosWithHeaders";
import { apis } from "../api";
import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axiosWithHeaders.post(`${apis.SIGN_UP}`, formData)
      if (response.status == 400) {
        toast.success("already email is exist")
      }
      toast.success("successful sign up")
      console.log(response)
      navigate('/')
    } catch (e) {
      console.log("eee",e.response.status)
      if (e.response.status== 400) {
        toast.error("already email is exist")
      }

    }

  };

  return (
    <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring"
          />
        </div>
        <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Sign Up
        </button>
      </form>
    </div>
  );
}
