const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

//lib 폴더의 ai.js파일 연결
var ai = require('../lib/ai');

//AI 버전 관리 화면 요청
router.get('/version', (req, res)=>{
    logger.info(`GET /admin/ai/version`);
    ai.view(req, res);
})

//감정 분류 모델 선택 요청
router.get('/emotionLoad/:modelName', (req, res)=>{
    logger.info(`GET /admin/ai/emotionLoad/${req.params.modelName}`);
    ai.emotionLoad(req, res);
})

//의도 분류 모델 선택 요청
router.get('/intentLoad/:modelName', (req, res)=>{
    logger.info(`GET /admin/ai/intentLoad/${req.params.modelName}`);
    ai.intentLoad(req, res);
})

//질문 생성 모델 선택 요청
router.get('/questionLoad/:modelName', (req, res)=>{
    logger.info(`GET /admin/ai/questionLoad/${req.params.modelName}`);
    ai.questionLoad(req, res);
})

//감정 분류 모델 삭제 요청
router.get('/deleteEmotion/:modelName', (req, res)=>{
    logger.info(`GET /admin/ai/deleteEmotion/${req.params.modelName}`);
    ai.deleteEmotion(req, res);
})

//의도 분류 모델 삭제 요청
router.get('/deleteIntent/:modelName', (req, res)=>{
    logger.info(`GET /admin/ai/deleteIntent/${req.params.modelName}`);
    ai.deleteIntent(req, res);
})

//질문 생성 모델 삭제 요청
router.get('/deleteQuestion/:modelName', (req, res)=>{
    logger.info(`GET /admin/ai/deleteQuestion/${req.params.modelName}`);
    ai.deleteQuestion(req, res);
})

//감정 분류 모델 생성 요청
router.post('/emotionModelTrain', (req, res)=>{
    logger.info(`POST /emotionModelTrain`);
    ai.emotionModelTrain(req, res);
})

//의도 분류 모델 생성 요청
router.post('/intentModelTrain', (req, res)=>{
    logger.info(`POST /intentModelTrain`);
    ai.intentModelTrain(req, res);
})

//질문 생성 모델 생성 요청
router.post('/questionModelTrain', (req, res)=>{
    logger.info(`POST /questionModelTrain`);
    ai.questionModelTrain(req, res);
})

//자동 학습 선택 요청
router.post('/updateAuto', (req, res)=>{
    logger.info(`POST /updateAuto`);
    ai.updateAuto(req, res);
})

//현재 load된 모델들의 성능지표 검사
router.get('/testModel', (req, res)=>{
    logger.info(`get /testModel`);
    ai.testModel(req, res);
})

module.exports=router;