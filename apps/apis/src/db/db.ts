import {db} from "@repo/drizzle/db";
import { ENV } from "../env/env.js";


export const dbInstance = db({
    uri:ENV.DATABASE_URL!
});


