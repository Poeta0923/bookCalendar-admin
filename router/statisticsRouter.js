const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

//lib 폴더의 statistics.js파일 연결
var statistics = require('../lib/statistics');

router.get('/book', (req, res)=>{
    logger.info(`GET /admin/statistics/book`);
    statistics.book(req, res);
})

router.get('/review', (req, res)=>{
    logger.info(`GET /admin/statistics/review`);
    statistics.review(req, res);
})

router.get('/post', (req, res)=>{
    logger.info(`GET /admin/statistics/post`);
    statistics.post(req, res);
})

router.get('/comment', (req, res)=>{
    logger.info(`GET /admin/statistics/comment`);
    statistics.comment(req, res);
})

router.get('/member', (req, res)=>{
    logger.info(`GET /admin/statistics/member`);
    statistics.member(req, res);
})

module.exports = router;