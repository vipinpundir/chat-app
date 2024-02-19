const User = require("../models/user.model")

const getUsersForSidebar = async(req, res) => {
    try {
        const loggedInUserId = req.user._id 
        const filterUsers = await User.find({ _id: {$ne: loggedInUserId}}).select("-password")
        res.status(200).json({filterUsers})

    } catch (error) {
        console.log("Error is getUserSidebar controller", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
module.exports = getUsersForSidebar