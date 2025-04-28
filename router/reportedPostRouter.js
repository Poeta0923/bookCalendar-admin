const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

//lib 폴더의 reportedPost.js파일 연결
var reportedPost = require('../lib/reportedPost');

//신고 게시물 관리 화면 요청 라우팅
router.get('/:currentPage', (req, res)=>{
    logger.info(`GET /reportedPost/${req.params.currentPage}`);
    reportedPost.view(req, res);
})

router.get('/:currentPage/:postId', (req, res)=>{
    logger.info(`GET /reportedPost/${req.params.currentPage}/${req.params.postId}`);
    reportedPost.detail(req, res);
})

//신고 게시물 검색란에 정보 기입 후 검색버튼 클릭 시 요청 라우팅
router.post('/search/:currentPage', (req, res)=>{
    logger.info(`POST /reportedPost/search/${req.params.currentPage}`);
    reportedPost.search(req, res);
})

router.post('/search/:currentPage/:postId', (req, res)=>{
    logger.info(`POST /reportedPost/search/${req.params.currentPage}/${req.params.postId}`);
    reportedPost.searchDetail(req, res);
})

router.get('/:currentPage/:postId/deletePost', (req, res)=>{
    logger.info(`GET /reportedPost/${req.params.currentPage}/${req.params.postId}/deletePost`);
    reportedPost.deletePost(req, res);
})

router.post('/search/:currentPage/:postId/deletePost', (req, res)=>{
    logger.info(`GET /reportedPost/search/${req.params.currentPage}/${req.params.postId}/deletePost`);
    reportedPost.deleteSearchPost(req, res);
})

router.get('/:currentPage/:postId/:commentId/deleteComment', (req, res)=>{
    logger.info(`GET /reportedPost/${req.params.currentPage}/${req.params.postId}/${req.params.commentId}/deleteComment`);
    reportedPost.deleteComment(req, res);
})

router.post('/search/:currentPage/:postId/:commentId/deleteComment', (req, res)=>{
    logger.info(`GET /reportedPost/search/${req.params.currentPage}/${req.params.postId}/${req.params.commentId}/deleteComment`);
    reportedPost.deleteSearchComment(req, res);
})

module.exports=router;