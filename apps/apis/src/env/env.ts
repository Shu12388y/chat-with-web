import dotenv from "dotenv";
dotenv.config({
    path:'.env'
});

const _ENV = {
    DATABASE_URL:process.env.DATABASE_URL,
    REDIS_URI:process.env.REDIS_URI,
    API_KEY:process.env.API_KEY
}


export const ENV = Object.freeze(_ENV);