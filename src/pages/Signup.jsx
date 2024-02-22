import React, { useContext, useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {

  const { setAuthUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: ""
  })


  const handleInputChange = (e) => {
    setFormData((preData) => ({
      ...preData,
      [e.target.name]: e.target.value,
    }));
  };

  const signUpUser = async () => {

    try {
      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const resData = await res.json();
      
      if (resData.error) {
        throw new Error(resData.error)
      } 
      toast.success("Account successfully created.")
      localStorage.setItem("chat-app", JSON.stringify(resData))
      setAuthUser(resData)

    } catch (error) {
      toast.error(error.message)
    }
  };



  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.fullName || !formData.username || !formData.password || !formData.confirmPassword || !formData.gender) {
      toast.error("All details are required")
    } else {

      signUpUser()
      console.log("ok")
    }
  }

  return (

    <div className='Signup container'>

      <Form onSubmit={handleSubmit} className='shadow my-5'>
        <h3 className='mb-5' >Register yourself on <strong>Chatify</strong> </h3>
        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control onChange={handleInputChange} name='fullName' type="text" placeholder="Enter full name" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control onChange={handleInputChange} name='username' type="text" placeholder="Enter username" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control onChange={handleInputChange} name='password' type="current-password" placeholder="Enter password" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control onChange={handleInputChange} name='confirmPassword' type="confirm-password" placeholder="Enter confirm password" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Gender</Form.Label>
          <Form.Check onChange={handleInputChange} value="male" type="radio" label="Male" name="gender" />
          <Form.Check onChange={handleInputChange} value="female" type="radio" label="Female" name="gender" />
        </Form.Group>

        <Button type='submit' variant="primary w-100 mt-3">Signup</Button> <br /> <br />
        <p>Already have an account <Link to="/login">Login</Link></p>
      </Form>

    </div>
  )
}

export default Signup