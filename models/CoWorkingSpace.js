const mongoose = require('mongoose');

const CoWorkingSpaceSchema = new mongoose.Schema({
    name:{
        type: String,
        require:[true,'Please add a name'],
        unique: true,
        trim : true,
        maxlength:[50,'Name can not be more than 50 characters']
    },
    address:{
        type: String,
        require:[true,'Please add an address']
    },
    tel:{
        type: String,
    },
    open_time:{
        type: String,
        require:[true,'Please add an opening time'],
        match: [
            /^(?:[01]\d|2[0-3]):[0-5]\d$/,
            'Please add a vaild time'
        ]
    },
    close_time: {
        type: String,
        require:[true, 'Please add a closing time'],
        match: [
            /^(?:[01]\d|2[0-3]):[0-5]\d$/,
            'Please add a vaild time'
        ]
    }
},{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

//Reversepopulate with virtuals
CoWorkingSpaceSchema.virtual('reservations',{
    ref:'Reservation',
    localField:'_id',
    foreignField:'coWorkingSpace',
    justOne: false
})
module.exports = mongoose.model('CoWorkingSpace',CoWorkingSpaceSchema);