import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!

if(!MONGODB_URL){
    throw new Error("please define mongo_url in env variable");
}

let cached = global.mongoose

if(!cached){
   cached = global.mongoose = {conn: null, promise:null}
}

export async function connectToDB(){
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
        const options = {
            bufferCommands:true,
            maxPoolSize : 10
        }
        
        mongoose
        .connect(MONGODB_URL, options)
        .then(() => mongoose.connection)
    }

    try{
        cached.conn = await cached.promise
    }catch(error){
        cached.promise = null
        throw error
    }

    return cached.conn;
}