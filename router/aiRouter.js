const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

//lib/ai 폴더의 js파일 연결
var view = require('../lib/ai/view');
var load = require('../lib/ai/load');
var deleteAi = require('../lib/ai/delete');
var train = require('../lib/ai/train');
var update = require('../lib/ai/update');
var test = require('../lib/ai/test');

//AI 버전 관리 화면 요청
router.get('/version', (req, res)=>{
    logger.info(`GET /admin/ai/version`);
    view.view(req, res);
})

//감정 분류 모델 선택 요청
router.get('/emotionLoad/:modelName', (req, res)=>{
    logger.info(`GET /admin/ai/emotionLoad/${req.params.modelName}`);
    load.emotionLoad(req, res);
})

//의도 분류 모델 선택 요청
router.get('/intentLoad/:modelName', (req, res)=>{
    logger.info(`GET /admin/ai/intentLoad/${req.params.modelName}`);
    load.intentLoad(req, res);
})

//질문 생성 모델 선택 요청
router.get('/questionLoad/:modelName', (req, res)=>{
    logger.info(`GET /admin/ai/questionLoad/${req.params.modelName}`);
    load.questionLoad(req, res);
})

//감정 분류 모델 삭제 요청
router.get('/deleteEmotion/:modelName', (req, res)=>{
    logger.info(`GET /admin/ai/deleteEmotion/${req.params.modelName}`);
    deleteAi.deleteEmotion(req, res);
})

//의도 분류 모델 삭제 요청
router.get('/deleteIntent/:modelName', (req, res)=>{
    logger.info(`GET /admin/ai/deleteIntent/${req.params.modelName}`);
    deleteAi.deleteIntent(req, res);
})

//질문 생성 모델 삭제 요청
router.get('/deleteQuestion/:modelName', (req, res)=>{
    logger.info(`GET /admin/ai/deleteQuestion/${req.params.modelName}`);
    deleteAi.deleteQuestion(req, res);
})

//감정 분류 모델 생성 요청
router.post('/emotionModelTrain', (req, res)=>{
    logger.info(`POST /emotionModelTrain`);
    train.emotionModelTrain(req, res);
})

//의도 분류 모델 생성 요청
router.post('/intentModelTrain', (req, res)=>{
    logger.info(`POST /intentModelTrain`);
    train.intentModelTrain(req, res);
})

//질문 생성 모델 생성 요청
router.post('/questionModelTrain', (req, res)=>{
    logger.info(`POST /questionModelTrain`);
    train.questionModelTrain(req, res);
})

//자동 학습 선택 요청
router.post('/updateAuto', (req, res)=>{
    logger.info(`POST /updateAuto`);
    update.updateAuto(req, res);
})

//현재 load된 모델들의 성능지표 검사
router.get('/testModel', (req, res)=>{
    logger.info(`get /testModel`);
    test.testModel(req, res);
})

module.exports=router;