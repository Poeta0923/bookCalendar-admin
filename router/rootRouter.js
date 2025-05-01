const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

//lib 폴더의 root.js파일 연결
var root = require('../lib/root');

//'login' 버튼 클릭 시 요청 라우팅
router.post('/login', (req, res)=>{
    logger.info(`POST /admin/login`);
    root.login(req, res);
})

//'/logout' 요청 라우팅
router.get('/logout', (req, res)=>{
    logger.info(`GET /admin/logout`);
    root.logout(req, res);
})

//'/main' 요청 라우팅
router.get('/', (req, res)=>{
    logger.info(`GET /admin`);
    root.main(req, res);
})

module.exports = router;