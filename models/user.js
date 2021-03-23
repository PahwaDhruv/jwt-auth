const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: [true, 'Email cannot be blank'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email address']
    },
    password : {
       type: String,
        required: [true, 'Please enter a valid password'],
        minlength: [6, 'Password should have minimum 6 characters']
    }
});

//fire before doc is saved
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    console.log('User to be saved', this)
    next();
})

userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect Email');
}
//fire func after doc is saved
// userSchema.post('save', (doc, next)=>{
//     console.log('User created and saved', doc);
//     next();
// })
const User = mongoose.model('user', userSchema);

module.exports = User;