const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types

const bannerSchema = mongoose.Schema({
        image: { 
            type: String, 
            required: true
        },
        title: {
            type: String, 
            required: false
        },
        createdBy: {
            type: ObjectId,
            ref: 'users',
            required: true
        },
    }, { timestamps: true }
)

module.exports = mongoose.model('banners', bannerSchema)