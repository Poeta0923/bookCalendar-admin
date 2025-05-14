const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

//lib 폴더의 reportedPost.js파일 연결
var view = require('../lib/reportedPost/view');
var detail = require('../lib/reportedPost/detail');
var search = require('../lib/reportedPost/search');
var deleteReportedPost = require('../lib/reportedPost/delete');

//신고 게시물 관리 화면 요청 라우팅
router.get('/:currentPage', (req, res)=>{
    logger.info(`GET /admin/reportedPost/${req.params.currentPage}`);
    view.view(req, res);
})

router.get('/:currentPage/:postId', (req, res)=>{
    logger.info(`GET /admin/reportedPost/${req.params.currentPage}/${req.params.postId}`);
    detail.detail(req, res);
})

//신고 게시물 검색란에 정보 기입 후 검색버튼 클릭 시 요청 라우팅
router.post('/search/:currentPage', (req, res)=>{
    logger.info(`POST /admin/reportedPost/search/${req.params.currentPage}`);
    search.search(req, res);
})

router.post('/search/:currentPage/:postId', (req, res)=>{
    logger.info(`POST /admin/reportedPost/search/${req.params.currentPage}/${req.params.postId}`);
    search.searchDetail(req, res);
})

router.get('/:currentPage/:postId/deletePost', (req, res)=>{
    logger.info(`GET /admin/reportedPost/${req.params.currentPage}/${req.params.postId}/deletePost`);
    deleteReportedPost.deletePost(req, res);
})

router.post('/search/:currentPage/:postId/deletePost', (req, res)=>{
    logger.info(`GET /admin/reportedPost/search/${req.params.currentPage}/${req.params.postId}/deletePost`);
    deleteReportedPost.deleteSearchPost(req, res);
})

router.get('/:currentPage/:postId/:commentId/deleteComment', (req, res)=>{
    logger.info(`GET /admin/reportedPost/${req.params.currentPage}/${req.params.postId}/${req.params.commentId}/deleteComment`);
    deleteReportedPost.deleteComment(req, res);
})

router.post('/search/:currentPage/:postId/:commentId/deleteComment', (req, res)=>{
    logger.info(`GET /admin/reportedPost/search/${req.params.currentPage}/${req.params.postId}/${req.params.commentId}/deleteComment`);
    deleteReportedPost.deleteSearchComment(req, res);
})

module.exports=router;