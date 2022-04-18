const { UploadStream } = require('cloudinary');
const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema; 




const ImageSchema = new Schema(
    {
        url: String,
        filename: String,
    }
)

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true } };// stringfy, colocar as propriedades virtuais dentro de CampgroundsSchema

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <a href="/campgrounds/${this._id}"> ${this.title} </a>
    <p> ${this.description.substring(0, 20)} ... </p>`
});

//middleware para quando o campground for deletado, os reviews serem deletados juntos do database
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({//remover todos os reviews cujos ID estao dentro de doc.reviews
            _id:{
                $in: doc.reviews
            }
        })
    }
})

module.exports= mongoose.model('Campground', CampgroundSchema);