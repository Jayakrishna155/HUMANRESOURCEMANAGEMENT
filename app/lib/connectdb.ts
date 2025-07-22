import mongoose from 'mongoose'
type connectionObj = 
{
    isConnection?:number
}
let connection:connectionObj ={}
async function connectdb():Promise<void> {
    if(connection.isConnection)
    {
        console.log("is already connected");
        return;
    }
    try{
       const db =  await mongoose.connect(process.env.MONGODB_URI||'',{});
       connection.isConnection = db.connections[0].readyState;
       console.log("DB connected succesfully");
    }
    catch(err)
    {
        console.log("there might be error while connecting");
    }
    
} 
export default connectdb;