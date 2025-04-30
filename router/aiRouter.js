const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

//lib 폴더의 ai.js파일 연결
var ai = require('../lib/ai');

//AI 버전 관리 화면 요청
router.get('/version', (req, res)=>{
    logger.info(`GET /admin/ai`);
    ai.view(req, res);
})

module.exports=router;