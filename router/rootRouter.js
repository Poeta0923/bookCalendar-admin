const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

//lib 폴더의 root.js파일 연결
var home = require('../lib/root/home');
var main = require('../lib/root/main');
var auth = require('../lib/root/auth');
var alter = require('../lib/root/alter');

//'login' 버튼 클릭 시 요청 라우팅
router.post('/login', (req, res)=>{
    logger.info(`POST /admin/login`);
    auth.login(req, res);
})

//'/logout' 요청 라우팅
router.get('/logout', (req, res)=>{
    logger.info(`GET /admin/logout`);
    auth.logout(req, res);
})

//'/main' 요청 라우팅
router.get('/', (req, res)=>{
    logger.info(`GET /admin`);
    main.main(req, res);
})

//'/alter' 요청 라우팅
router.get('/alter', (req, res)=>{
    logger.info(`GET /admin/alter`);
    alter.alter(req, res);
})

router.post('/alter_process', (req, res)=>{
    logger.info(`POST /admin/alter_process`);
    alter.alter_process(req, res);
})

module.exports = router;