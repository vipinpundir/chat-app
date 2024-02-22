import React from 'react'



const Sidebar = (props) => {
    const onlineUser = props.onlineUser
    const isOnline = onlineUser?.includes(props.user._id)
    return (
        <div className='Sidebar'>
           {props.index!==0? <hr />:''}
            <div className='sidebar my-2'>
                <span className={isOnline?'Online':''} ><img src={props.user.profilePic} alt="profilePic" /></span><span>{props.user.fullName}</span>
            </div>
        </div>
    )
}

export default Sidebar