import mongoose, {models, model, Schema} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    email : string;
    password : string;
    _id? : mongoose.Types.ObjectId;
    createAt? : Date;
    updatedAt? : Date;
}

const userSchema = new Schema<IUser>(
    {
        email: {type: String, required: true, unique:true},
        password: {type:String, required:true}
    },
    {
        timestamps:true
    }
);

// pre hook 

userSchema.pre('save', async function(next){
    // password hashing using bcrpyt 
    if(this.isModified("Password")){
       this.password = await bcrypt.hash(this.password, 10) // till 10 hashing value this password will be hashed
    }
    next();
});

const User = models?.User || model<IUser>("User", userSchema)

export default User;