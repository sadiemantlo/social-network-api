const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username:{
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
        },
        friends: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        thought: [{
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }]
    },
    {
    toJSON: {
        virtuals: true,
    },
    id: false
    }
); 

// use virtuals to get total number of friends 
userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const Users = model('User', userSchema);

module.exports = Users; 