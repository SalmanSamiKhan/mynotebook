import jwt from 'jsonwebtoken'

const getuser = (req, res, next) => {
    // Get the user from jwt token and add id to req object

    // 'req.body will send token as 'auth-token'
    const token = req.header('auth-token')
    if (!token) {
        res.status(401).send('Please authenticate using a valid token')
    }
    try {
        // verify token
        const data = jwt.verify(token, process.env.JWT_SECRET)
        // sending the user from this particular token to req body
        req.user = data.user
        next()
    } catch (error) {
        res.status(401).send('Please authenticate using a valid token')
    }
}

export default getuser