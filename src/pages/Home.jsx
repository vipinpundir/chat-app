import React, { useContext, useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Spinner from 'react-bootstrap/Spinner';
import { SocketContext } from '../context/SocketContext';


const Home = () => {
  const { authUser, setAuthUser } = useContext(AuthContext)
  const { onlineUsers, socket } = useContext(SocketContext)
  const [users, setUsers] = useState([])
  const [userChats, setUserChats] = useState([])
  const [selectedUser, setSelectedUser] = useState()
  const [sendMessageData, setSendMessageData] = useState('')
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    // get all users after login
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

        setUsers(resData.filterUsers)


      } catch (error) {
        toast.error(error.message)
        console.log(error)
      } finally {
        setLoading(false)

      }
    };

    getUsers()

  }, [authUser._id])


  // handle socket.io live messaging
  useEffect(() => {

    socket?.on("newMessage", (newMessage) => {
      setUserChats([...userChats, newMessage])

    })
    return () => socket?.off("newMessage")
  }, [userChats, setUserChats, socket])


  // Handle Logout 
  const handleLogout = async () => {

    try {
      setLoading(true)
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
    } finally {
      setLoading(false)

    }

  }



  // Handle chat click && Selected user To chat
  const handleChatClick = (user) => {
    setSelectedUser(user)
    const getUserMessages = async () => {
      try {
        setLoading(true)
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
      } finally {
        setLoading(false)

      }
    };

    getUserMessages()

  }

  // handleSendMessageToUser
  const handleSendMessageToUser = () => {

    if (sendMessageData.length !== 0) {
      const sendMessage = async () => {

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

          setUserChats([...userChats, resData])

        } catch (error) {
          toast.error(error.message)
          console.log(error)
        }
      }

      sendMessage()
      setSendMessageData('')
    } else {
      toast.error("enter message")
    }

  }

  const timeFormatted = (time) => {
    if (time) {
      let timestamp = time;
      const date = new Date(timestamp);
      // Get the time in "hh:mm" format
      const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      return formattedTime
    } else {
      return ''
    }
  }

  return (

    <div className='Home container'>

      <Row className='Row'>
        <Col className='Col'>
          {users?.map((user, index) => {
            return <div key={user._id} onClick={() => { handleChatClick(user) }} > <Sidebar index={index} onlineUser={onlineUsers} user={user} /></div>
          })}
        </Col>

        <Col className='ChatBox' >

          {selectedUser
            ? <> <h6>To: {selectedUser.username}</h6>
              <div className="Chats my-5">
                {userChats.length !== 0
                  ? userChats.map((chat) => {
                    return <li key={chat._id} className={chat.senderId === authUser._id ? 'Sender' : 'Receiver'}  > <p>{chat.message} </p> <p className='chatTime' >{timeFormatted(chat.updatedAt)}</p> </li>
                  })
                  : <><p className='text-center' >Send a message to start conversation...</p></>}
              </div>
              <div className="Chat-input">
                <input onChange={(e) => setSendMessageData(e.target.value)} value={sendMessageData} placeholder='Type Message' type="text" />
                <Button onClick={handleSendMessageToUser} >send</Button>
              </div>
            </>
            : <><p className='text-center h-100 d-flex justify-content-center align-items-center' >Hi {authUser.username} 👋 <br /> select a chat to start messaging 💬</p></>}

        </Col>

      </Row>
      {loading ? <div className="loading">
        <Spinner animation="border" /> <p className='m-1' > Loading...</p>
      </div> : ''}
      <Button className='LogoutBtn' onClick={handleLogout} variant="primary">Logout</Button>

    </div>
  )
}

export default Home