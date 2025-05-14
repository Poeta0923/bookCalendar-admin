const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

//lib 폴더의 statistics.js파일 연결
var book = require('../lib/statistics/book');
var comment = require('../lib/statistics/comment');
var member = require('../lib/statistics/member');
var post = require('../lib/statistics/post');
var review = require('../lib/statistics/review');

router.get('/book', (req, res)=>{
    logger.info(`GET /admin/statistics/book`);
    book.book(req, res);
})

router.get('/review', (req, res)=>{
    logger.info(`GET /admin/statistics/review`);
    review.review(req, res);
})

router.get('/post', (req, res)=>{
    logger.info(`GET /admin/statistics/post`);
    post.post(req, res);
})

router.get('/comment', (req, res)=>{
    logger.info(`GET /admin/statistics/comment`);
    comment.comment(req, res);
})

router.get('/member', (req, res)=>{
    logger.info(`GET /admin/statistics/member`);
    member.member(req, res);
})

module.exports = router;