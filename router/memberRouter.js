const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

//lib 폴더의 member.js파일 연결
var view = require('../lib/member/view');
var deleteMember = require('../lib/member/delete');
var search = require('../lib/member/search');

//회원 관리 화면 요청 라우팅
router.get('/:currentPage', (req, res)=>{
    logger.info(`GET /admin/member/${req.params.currentPage}`);
    view.view(req, res);
})

//회원 삭제 버튼 클릭 시 요청 라우팅
router.get('/delete/:memberId', (req, res)=>{
    logger.info(`GET /admin/member/delete/${req.params.memberId}`);
    deleteMember.delete(req, res);
})

//회원 검색란에 정보 기입 후 검색버튼 클릭 시 요청 라우팅
router.post('/search/:currentPage', (req, res)=>{
    logger.info(`POST /admin/member/search/${req.params.currentPage}`);
    search.search(req, res);
})


module.exports = router;