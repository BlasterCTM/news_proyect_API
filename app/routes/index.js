const express = require('express')
const router = express.Router()
const { getNews, getNewsById, createNews, updateNews, deleteNews } = require('../../app/controllers/newsController');
const { createUser, login } = require('../../app/controllers/userCont');

//NEWS ROUTES
router.get('/news', getNews)
router.get('/news/:id', getNewsById)
router.post('/news', createNews)
router.put('/news/:id', updateNews)
router.patch('/news/:id', deleteNews)

//USER ROUTES
router.post('/users/register', createUser )
router.post('/login', login)
module.exports = router
