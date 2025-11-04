import dotenv from "dotenv";
dotenv.config({
    path:'.env'
});

const _ENV = {
    DATABASE_URL:process.env.DATABASE_URL,
    REDIS_URI:process.env.REDIS_URI
}


export const ENV = Object.freeze(_ENV);