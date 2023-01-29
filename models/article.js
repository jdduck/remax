const mongoose = require('mongoose')
require('mongoose-type-url')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const { type } = require('express/lib/response')
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
    
    imgURL: {
        type: String,
        required: true
    },
    headline: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
})

articleSchema.pre('validate', function(next){
    if (this.headline) {
        this.slug = slugify(this.headline, { lower: true, strict: true })
    }
    next()
})

module.exports = mongoose.model('Article', articleSchema)