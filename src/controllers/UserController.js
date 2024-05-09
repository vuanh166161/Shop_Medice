const UserService = require('../services/UserSevice')
const JwtService = require('../services/JwtService')

const createUser = async (req, res) => {
    try {
        const {name, email, password, confirmPassword, phone} = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if(!email || !password || !confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        else if(!isCheckEmail){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })
        }else if(password !== confirmPassword){
            return res.status(200).json({
                status: 'ERR',
                message: 'The password is equal confirmPassword'
            })
        }
        const response = await UserService.createUser(req.body)
        // if (req.body.isSeller) {
        //     response.data.isSeller = true;
        // }
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
const signinUser = async (req, res) => {
    try {
        const {email, password} = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if(!email || !password ) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        else if(!isCheckEmail){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })
        }
        const response = await UserService.signinUser(req.body)
        const { refresh_token, ...newReponse } = response        
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            samesite: 'strict',
            path: '/'
        })
        return res.status(200).json({...newReponse, refresh_token})
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
const updateUser = async (req, res) => {
    try {
        const userID = req.params.id
        const data = req.body
        if(!userID){
            return res.status(200).json({
                status: 'ERR',
                message: 'The userID is required'
            })
        }
        const response = await UserService.updateUser(userID, data)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
const deleteUser = async (req, res) => {
    try {
        const userID = req.params.id
        if(!userID){
            return res.status(200).json({
                status: 'OK',
                message: 'The userID is required'
            })
        }
        const response = await UserService.deleteUser(userID)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
const deleteMany = async (req, res) => {
    try {
        const IDs = req.body.IDs
        if(!IDs){
            return res.status(200).json({
                status: 'OK',
                message: 'The userID is required'
            })
        }
        const response = await UserService.deleteManyUser(IDs)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
const getDetailsUser = async (req, res) => {
    try {
        const userID = req.params.id
        if(!userID){
            return res.status(200).json({
                status: 'ERR',
                message: 'The userID is required'
            })
        }
        const response = await UserService.getDetailsUser(userID)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
const refreshToken = async (req, res) => {
    try {
        let token = req.headers.token.split('')[1]
        if(!token){
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
 
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        res.clearCookie(process.env.ACCESS_TOKEN)
        return res.status(200).json({
            status: 'ok',
            message: 'Logout successfully'
        })
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
module.exports ={
    createUser, signinUser, updateUser, deleteUser, getAllUser, getDetailsUser, refreshToken, logoutUser, deleteMany
}