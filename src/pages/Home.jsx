import React, { useContext, useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/authContext';
import Sidebar from '../components/Sidebar';
import Spinner from 'react-bootstrap/Spinner';


const Home = () => {

  const { authUser, setAuthUser } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [userChats, setUserChats] = useState([])
  const [selectedUser, setSelectedUser] = useState()
  const [sendMessageData, setSendMessageData] = useState('')
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    // get all users after login
    setLoading(true)
    const getUsers = async () => {

      try {
        const res = await fetch(`/api/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "user": authUser._id })
        })

        const resData = await res.json();

        if (resData.error) {
          throw new Error(resData.error)
        }

        console.log(resData, "data")
        setUsers(resData.filterUsers)


      } catch (error) {
        toast.error(error.message)
        console.log(error)
      }finally{
        setLoading(false)

      }
    };

    getUsers()

  }, [authUser])

  // Handle Logout 
  const handleLogout = async () => {

    setLoading(true)
    try {
      const res = await fetch(`/api/auth/logout`)
      const resData = await res.json();

      if (resData.error) {
        throw new Error(resData.error)
      }

      toast.success(resData.message)
      localStorage.removeItem("chat-app")
      setAuthUser(null)

    } catch (error) {
      toast.error(error.message)
    }finally{
      setLoading(false)

    }

  }



  // Handle chat click && Selected user To chat
  const handleChatClick = (user) => {
    setSelectedUser(user)
    const getUserMessages = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/messages/${user._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "userId": authUser._id })
        })

        const resData = await res.json();

        if (resData.error) {
          throw new Error(resData.error)
        }

        setUserChats(resData)


      } catch (error) {
        toast.error(error.message)
        console.log(error)
      }finally{
        setLoading(false)

      }
    };

    getUserMessages()

  }



  // handleSendMessageToUser
  const handleSendMessageToUser = () => {

    const sendMessage = async () => {
      setLoading(true)

      try {
        const res = await fetch(`/api/messages/send/${selectedUser._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ "message": sendMessageData, "senderId": authUser._id })
        })

        const resData = await res.json();

        if (resData.error) {
          throw new Error(resData.error)
        }

        console.log(resData, "sendSucessfully")


      } catch (error) {
        toast.error(error.message)
        console.log(error)
      }finally{
        setLoading(false)

      }
    }

    sendMessage()
    setSendMessageData('')

  }


  return (

    <div className='Home container'>

      <Row className='Row'>
        <Col className='Col'>
          {users?.map((user) => {
            return <div onClick={() => { handleChatClick(user) }} > <Sidebar key={user._id} user={user} /></div>
          })}
        </Col>

        <Col className='ChatBox' >

          {selectedUser
            ? <> <h6>To: {selectedUser.username}</h6>
              <div className="Chats my-5">
                {userChats.length !== 0
                  ? userChats.map((chat) => {
                    return <><li className={chat.senderId === authUser._id ? 'Sender' : 'Receiver'} key={chat._id} >{chat.message}</li></>
                  })
                  : <><p className='text-center' >Chats not available start conversation...</p></>}
              </div>
              <div className="Chat-input">
                <input onChange={(e) => setSendMessageData(e.target.value)} value={sendMessageData} placeholder='Type Message' type="text" />
                <Button onClick={handleSendMessageToUser} >send</Button>
              </div>
            </>
            : <><p className='text-center' >Hi {authUser.username} 👋 <br /> select a chat to start messaging 💬</p></>}

        </Col>

      </Row>
       {loading? <div className="loading">
        <Spinner animation="border" /> <p className='m-1' > Loading...</p>
        </div>:''}
      <Button className='LogoutBtn' onClick={handleLogout} variant="primary">Logout</Button>

    </div>
  )
}

export default Home