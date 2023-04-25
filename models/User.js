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
            match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/]
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
        getters: true
    },
    id: false
    }
); 

// use virtuals to get total number of friends 
userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const Users = model('Users', userSchema);

module.exports = Users; 