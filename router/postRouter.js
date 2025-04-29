const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

//lib 폴더의 post.js파일 연결
var post = require('../lib/post');

//게시물 관리 화면 요청 라우팅
router.get('/:currentPage', (req, res)=>{
    logger.info(`GET /admin/post/${req.params.currentPage}`);
    post.view(req, res);
})

router.get('/:currentPage/:postId', (req, res)=>{
    logger.info(`GET /admin/post/${req.params.currentPage}/${req.params.postId}`);
    post.detail(req, res);
})

//게시물 검색란에 정보 기입 후 검색버튼 클릭 시 요청 라우팅
router.post('/search/:currentPage', (req, res)=>{
    logger.info(`POST /admin/post/search/${req.params.currentPage}`);
    post.search(req, res);
})

router.post('/search/:currentPage/:postId', (req, res)=>{
    logger.info(`POST /admin/post/search/${req.params.currentPage}/${req.params.postId}`);
    post.searchDetail(req, res);
})

router.get('/:currentPage/:postId/deletePost', (req, res)=>{
    logger.info(`GET /admin/post/${req.params.currentPage}/${req.params.postId}/deletePost`);
    post.deletePost(req, res);
})

router.post('/search/:currentPage/:postId/deletePost', (req, res)=>{
    logger.info(`GET /admin/post/search/${req.params.currentPage}/${req.params.postId}/deletePost`);
    post.deleteSearchPost(req, res);
})

router.get('/:currentPage/:postId/:commentId/deleteComment', (req, res)=>{
    logger.info(`GET /admin/post/${req.params.currentPage}/${req.params.postId}/${req.params.commentId}/deleteComment`);
    post.deleteComment(req, res);
})

router.post('/search/:currentPage/:postId/:commentId/deleteComment', (req, res)=>{
    logger.info(`GET /admin/post/search/${req.params.currentPage}/${req.params.postId}/${req.params.commentId}/deleteComment`);
    post.deleteSearchComment(req, res);
})

module.exports = router;