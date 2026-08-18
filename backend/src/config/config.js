import "dotenv/config";

if(!process.env.PORT) console.log("PORT is not defined in Envirnoment Varibles");
// if(!process.env.frontend_url) console.log("frontend_url is not defined in Envirnoment Varibles");
// if(!process.env.MONGO_URI) console.log("MONGO_URI is not defined in Envirnoment Varibles");
// if(!process.env.JWT_SECRET) console.log("JWT_SECRET is not defined in Environment Variables");

const config = {
    port : process.env.PORT,
    frontend_url : process.env.frontend_url,
    MONGO_URI : process.env.MONGO_URI,
    jwt_secret: process.env.JWT_SECRET,
    node_env: process.env.NODE_ENV || "development"
}

export default config;
