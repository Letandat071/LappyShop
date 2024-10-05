require('dotenv').config();

module.exports = {
    port: process.env.PORT,
    mongoDb: process.env.MONGO_DB,
    jwtSecret: process.env.JWT_SECRET
};