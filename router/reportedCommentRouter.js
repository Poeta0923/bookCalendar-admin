const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

//lib 폴더의 reportedComment.js파일 연결
var view = require('../lib/reportedComment/view');
var search = require('../lib/reportedComment/search');
var deleteComment = require('../lib/reportedComment/delete');

//신고 댓글 관리 화면 요청 라우팅
router.get('/:currentPage', (req, res)=>{
    logger.info(`GET /admin/reportedComment/${req.params.currentPage}`);
    view.view(req, res);
})

//신고 댓글 삭제 버튼 클릭 시 요청 라우팅
router.get('/delete/:commentId', (req, res)=>{
    logger.info(`GET /admin/reportedComment/delete/${req.params.commentId}`);
    deleteComment.delete(req, res);
})

//신고 댓글 검색란에 정보 기입 후 검색버튼 클릭 시 요청 라우팅
router.post('/search/:currentPage', (req, res)=>{
    logger.info(`POST /admin/reportedComment/search/${req.params.currentPage}`);
    search.search(req, res);
})

module.exports=router;