const mongoose = require('mongoose');
const Joi = require('joi');

// define schema for the database
const wordSchema = new mongoose.Schema({
    words: {
        type: String,
        required: true,
        minlength: 1
    },

    word_type: {
        type: String,
        enum: [
            'kata benda',
            'kata kerja',
            'kata sifat',
            'kata keterangan',
            'kata sandang',
            'kata seru',
            'sufiks',
            'kata bilangan',
            'kata depan'
        ],
        required: true,
    },

    // sometimes there more than one translation, store it in an array
    translations: {
        type: Array,
    },

    definitions: {
        type: Array,
    },

    synonyms: {
         type: Array
    },

    examples: {
        type: Array
    }
});

// define index for the existing schema
wordSchema.index({words: 'text'});

// create model with the 'Words' collection
// and the wordSchema was defined before
const Word = mongoose.model('Word', wordSchema);

// validate function to validate the data with Joi
function validateWord(word){
    const schema = {
        words: Joi.string().min(1).max(50).required(),
        word_type: Joi.string().min(9).max(15).required(),
        translations: Joi.array().required(),
        synonyms: Joi.array(),
        definitions: Joi.array(),
        examples: Joi.array()
    };

    return Joi.validate(word, schema);
}

// export this model this be used in other file
module.exports.Word = Word;
module.exports.validate = validateWord;