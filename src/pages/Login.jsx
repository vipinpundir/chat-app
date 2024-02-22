import React, { useContext, useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';


const Login = () => {

  const {setAuthUser} = useContext(AuthContext)

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })

  const handleInputChange = (e) => {
    setFormData((preData) => ({
      ...preData,
      [e.target.name]: e.target.value,
    }));
  };

  const loginUser = async () => {

    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const resData = await res.json();
      
      if (resData.error) {
        throw new Error(resData.error)
      } 
      toast.success("Login successfully.")
      localStorage.setItem("chat-app", JSON.stringify(resData))
      setAuthUser(resData)

    } catch (error) {
      toast.error(error.message)
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    loginUser()
  }


  return (
    <div className='Login container'>
      <Form onSubmit={handleSubmit} className='shadow'>

        <h3 className='mb-5' >Welcome on <strong>Chatify</strong> </h3>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control onChange={handleInputChange} name='username' type="text" placeholder="Enter username" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control onChange={handleInputChange} name='password' type="current-password" placeholder="Password" />
        </Form.Group>

        <Button type='submit' variant="primary w-100 mt-3">Login</Button> <br /> <br />
        <p>Create an account <Link to="/signup">Signup</Link> </p>

      </Form>

    </div>
  )
}

export default Login