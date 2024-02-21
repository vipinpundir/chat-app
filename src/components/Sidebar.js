import React from 'react'



const Sidebar = (props) => {
    return (
        <div className='Sidebar'>
           {props.index!==0? <hr />:''}
            <div className='sidebar my-2'>
                <span><img src={props.user.profilePic} alt="profilePic" /></span><span>{props.user.fullName}</span>
            </div>
        </div>
    )
}

export default Sidebar