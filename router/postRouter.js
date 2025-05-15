const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

//lib 폴더의 post.js파일 연결
var view = require('../lib/post/view');
var detail = require('../lib/post/detail');
var search = require('../lib/post/search');
var deletePost = require('../lib/post/delete');

//게시물 관리 화면 요청 라우팅
router.get('/:currentPage', (req, res)=>{
    logger.info(`GET /admin/post/${req.params.currentPage}`);
    view.view(req, res);
})

router.get('/:currentPage/:postId', (req, res)=>{
    logger.info(`GET /admin/post/${req.params.currentPage}/${req.params.postId}`);
    detail.detail(req, res);
})

//게시물 검색란에 정보 기입 후 검색버튼 클릭 시 요청 라우팅
router.post('/search/:currentPage', (req, res)=>{
    logger.info(`POST /admin/post/search/${req.params.currentPage}`);
    search.search(req, res);
})

router.post('/search/:currentPage/:postId', (req, res)=>{
    logger.info(`POST /admin/post/search/${req.params.currentPage}/${req.params.postId}`);
    search.searchDetail(req, res);
})

router.get('/:currentPage/:postId/deletePost', (req, res)=>{
    logger.info(`GET /admin/post/${req.params.currentPage}/${req.params.postId}/deletePost`);
    deletePost.deletePost(req, res);
})

router.post('/search/:currentPage/:postId/deletePost', (req, res)=>{
    logger.info(`GET /admin/post/search/${req.params.currentPage}/${req.params.postId}/deletePost`);
    deletePost.deleteSearchPost(req, res);
})

router.get('/:currentPage/:postId/:commentId/deleteComment', (req, res)=>{
    logger.info(`GET /admin/post/${req.params.currentPage}/${req.params.postId}/${req.params.commentId}/deleteComment`);
    deletePost.deleteComment(req, res);
})

router.post('/search/:currentPage/:postId/:commentId/deleteComment', (req, res)=>{
    logger.info(`GET /admin/post/search/${req.params.currentPage}/${req.params.postId}/${req.params.commentId}/deleteComment`);
    deletePost.deleteSearchComment(req, res);
})

module.exports = router;