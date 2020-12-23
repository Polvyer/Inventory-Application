var express = require('express');
var router = express.Router();

// Require controller modules.
var card_controller = require('../controllers/cardController');
var card_instance_controller = require('../controllers/cardinstanceController');
var expansion_controller = require('../controllers/expansionController');
var series_controller = require('../controllers/seriesController');

/// CARD ROUTES ///

/* GET catalog home page. */
router.get('/', card_controller.index);

// GET request for creating a Card. NOTE This must come before routes that display Card (uses id).
router.get('/card/create', card_controller.card_create_get);

// POST request for creating a Card.
router.post('/card/create', card_controller.card_create_post);

// GET request to delete Card.
router.get('/card/:id/delete', card_controller.card_delete_get);

// POST request to delete Card.
router.post('/card/:id/delete', card_controller.card_delete_post);

/*
// GET request to update Card.
router.get('/card/:id/update', card_controller.card_update_get);

// POST request to update Card.
router.post('/card/:id/update', card_controller.card_update_post);
*/

// GET request for one Card.
router.get('/card/:id', card_controller.card_detail);

// GET request for list of all Card items.
router.get('/card', card_controller.card_list);

/*
/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/author/create', author_controller.author_create_get);

// POST request for creating Author.
router.post('/author/create', author_controller.author_create_post);

// GET request to delete Author.
router.get('/author/:id/delete', author_controller.author_delete_get);

// POST request to delete Author.
router.post('/author/:id/delete', author_controller.author_delete_post);

// GET request to update Author.
router.get('/author/:id/update', author_controller.author_update_get);

// POST request to update Author.
router.post('/author/:id/update', author_controller.author_update_post);

// GET request for one Author.
router.get('/author/:id', author_controller.author_detail);

// GET request for list of all Authors.
router.get('/authors', author_controller.author_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);

/// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get('/bookinstance/create', book_instance_controller.bookinstance_create_get);

// POST request for creating BookInstance.
router.post('/bookinstance/create', book_instance_controller.bookinstance_create_post);

// GET request to delete BookInstance.
router.get('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_get);

// POST request to delete BookInstance.
router.post('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_post);

// GET request to update BookInstance.
router.get('/bookinstance/:id/update', book_instance_controller.bookinstance_update_get);

// POST request to update BookInstance.
router.post('/bookinstance/:id/update', book_instance_controller.bookinstance_update_post);

// GET request for one BookInstance.
router.get('/bookinstance/:id', book_instance_controller.bookinstance_detail);

// GET request for list of all BookInstance.
router.get('/bookinstances', book_instance_controller.bookinstance_list);
*/

module.exports = router;