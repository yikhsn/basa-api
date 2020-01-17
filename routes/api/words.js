const asyncMiddleware = require('../../middleware/async');

const express = require('express');
const router = express.Router();

const { Word, validate } = require('../../models/word');

// middleware
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

// all routes
router.get('/', [auth, admin], asyncMiddleware( async(req, res) => {
    const word = await Word.find();
    res.send(word);
}));

// post method to add new data to the collection
router.post('/', auth, asyncMiddleware (async(req, res) => {
    // validate if the request body is valid as define on schema
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    // create new object by the request data
    let word = new Word({
        words: req.body.words,
        word_type: req.body.word_type,
        translations: req.body.translations,
        synonyms: req.body.synonyms,
        examples: req.body.examples
    });

    // save the data wrap it into the catch block
    word = await word.save();
    res.send(word);
}));

router.put('/:id', auth, asyncMiddleware( async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const word = await Word.findByIdAndUpdate(req.params.id, {
        words: req.body.words,
        word_type: req.body.word_type,
        translations: req.body.translations,
        synonyms: req.body.synonyms,
        examples: req.body.examples
    },{
        new: true
    });

    if (!word) return res.status(404).send('The given ID not found');
    
    res.send(word);
}));

router.delete('/:id', auth, asyncMiddleware (async(req, res) => {
    const word = await Word.findByIdAndRemove(req.params.id);

    if(!word) return res.status(404).send('The given ID not found');

    res.send(word);
}));

router.get('/:id', auth, asyncMiddleware( async(req, res) => {
    const word = await Word.findById(req.params.id);
    
    if(!word) return res.status(404).send('The given ID not Found');
    
    res.send(word);
}));


// full search route method
router.get('/search/:query', auth, asyncMiddleware( async(req, res) => {
    const word = await Word.find({ 
        words: req.params.query
        // $text: { $search : req.params.query } 
    });

    if(!word.length) return res.status(404).send('The given word not found');

    res.send(word);
}));

// spatial search word that start with certain letter route method
router.get('/search/startwith/:query', auth, asyncMiddleware( async(req, res) => {
    const q = req.params.query;
    
    const word = await Word.find( { 
        "words": {
            "$regex": new RegExp("^" + q)
        } 
    });

    if (!word.length) return res.status(404).send('The given query not found');

    res.send(word)
}));

// spatial search word that start with certain letter with [10] limit route method
router.get('/search/startwith10/:query', auth, asyncMiddleware( async(req, res) => {
    const q = req.params.query;
    
    const word = await Word.find( { 
        "words": {
            "$regex": new RegExp("^" + q)
        } 
    }).limit(10);

    if (!word.length) return res.status(404).send('The given query not found');

    res.send(word)
}));

// spatial search word that start with certain letter with [20] limit route method
router.get('/search/startwith20/:query', auth, asyncMiddleware( async(req, res) => {
    const q = req.params.query;
    
    const word = await Word.find( { 
        "words": {
            "$regex": new RegExp("^" + q)
        } 
    }).limit(20);

    if (!word.length) return res.status(404).send('The given query not found');

    res.send(word)
}));

// spatial search word that contain certai letter route method
router.get('/search/contain/:query', auth, asyncMiddleware( async(req, res) => {
    const q = req.params.query;
    
    const word = await Word.find( { 
        "words": {
            "$regex": new RegExp(q, 'i')
        } 
    });

    if (!word.length) return res.status(404).send('The given query not found');

    res.send(word)
}));

// spatial search word that contain certai letter with limit [20] route method
router.get('/search/contain20/:query', auth, asyncMiddleware( async(req, res) => {
    const q = req.params.query;
    
    const word = await Word.find( { 
        "words": {
            "$regex": new RegExp(q, 'i')
        } 
    }).limit(20);

    if (!word.length) return res.status(404).send('The given query not found');

    res.send(word)
}));

// spatial search word that contain certai letter with limit [20] route method
router.get('/search/contain10/:query', auth, asyncMiddleware( async(req, res) => {
    const q = req.params.query;
    
    const word = await Word.find( { 
        "words": {
            "$regex": new RegExp(q, 'i')
        } 
    }).limit(10);

    if (!word.length) return res.status(404).send('The given query not found');

    res.send(word)
}));

module.exports = router;