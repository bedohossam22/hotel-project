import User from "../models/User.js";
import { Webhook } from "svix";


const clerkWebhooks = async (req , res) => {
    try {
        // create  a svix instance with clerk websocket secret 
        const whook= new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        //getting Headers 
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        // verifying headers
        await whook.verify(JSON.stringify(req.body) , headers)

        // Getting Data From request body
        const {data , type } = req.body

        const userData = {
            _id: data._id ,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.image_url,
        }

        // switch cases for different 
        switch(type){
            case "user.created" : {
                await User.create(userData);
                break;
            }
               case "user.updated" : {
                await User.findByIdAndUpdate(data.id , userData);
                break;
            } 

                case "user.deleted": {
                    await User.findByIdAndDelete(data.id);
                    break;
                }
                

                default:
                break;
        }
        res.json({success:true , message: "Webhook Received"})


    } catch (error){    
        console.log(error.message);
        res.json({success: false, message: error.message });
    }
}   

export default clerkWebhooks;