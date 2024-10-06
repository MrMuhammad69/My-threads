import jwt from 'jsonwebtoken'

 const generateTokenAndSetCookie = (userId, res) => {
    // Ensure that SECRET_KEY is defined
    if (!process.env.SECRET_KEY) {
        throw new Error('SECRET_KEY is not defined in environment variables');
    }

    // Generate the JWT token
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '15d' });

    // Set the cookie with the token
    res.cookie('jwt-threads', token, { 
        httpOnly: true, 
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        sameSite: "strict",
        secure: process.env.NODE_ENV === 'production' // Ensures cookies are sent over HTTPS in production
    });

    return token;
}
export default generateTokenAndSetCookie
 