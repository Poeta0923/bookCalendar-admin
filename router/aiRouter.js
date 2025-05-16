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
var errorLog = require('../lib/ai/errorLog');
var data = require('../lib/ai/data');
var detail = require('../lib/ai/detail');
var dataDetail = require('../lib/ai/dataDetail');
var deleteData = require('../lib/ai/deleteData');
var dataLoad = require('../lib/ai/dataLoad');

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

//ai 오류 로그 요청
router.get('/errorLog', (req, res)=>{
    logger.info(`get /errorLog`);
    errorLog.errorLog(req, res);
})

//질문 생성 모델 데이터셋 목록 요청
router.get('/questionData', (req, res)=>{
    logger.info(`get /questionData/`);
    data.questionData(req, res);
})

//의도 분류 모델 데이터셋 목록 요청
router.get('/intentData', (req, res)=>{
    logger.info(`get /intentData`);
    data.intentData(req, res);
})

//감정 파악 모델 데이터셋 목록 요청
router.get('/emotionData', (req, res)=>{
    logger.info(`get /emotionData`);
    data.emotionData(req, res);
})

//질문 생성 모델 데이터셋 상세 목록 요청
router.get('/questionData/:selected/:currentPage', (req, res)=>{
    logger.info(`get /questionData/${req.params.selected}/${req.params.currentPage}`);
    detail.questionData(req, res);
})

//질문 생성 모델 데이터 상세 정보 요청
router.get('/questionData/:selected/:currentPage/:dataId', (req, res)=>{
    logger.info(`get /questionData/${req.params.selected}/${req.params.currentPage}/${req.params.dataId}`);
    dataDetail.questionData(req, res);
})

//의도 파악 모델 데이터셋 상세 목록 요청
router.get('/intentData/:selected/:currentPage', (req, res)=>{
    logger.info(`get /intentData/${req.params.selected}/${req.params.currentPage}`);
    detail.intentData(req, res);
})

//의도 파악 모델 데이터 상세 정보 요청
router.get('/intentData/:selected/:currentPage/:dataId', (req, res)=>{
    logger.info(`get /intentData/${req.params.selected}/${req.params.currentPage}/${req.params.dataId}`);
    dataDetail.intentData(req, res);
})

//감정 분류 모델 데이터셋 상세 목록 요청
router.get('/emotionData/:selected/:currentPage', (req, res)=>{
    logger.info(`get /emotionData/${req.params.selected}/${req.params.currentPage}`);
    detail.emotionData(req, res);
})

//감정 분류 모델 데이터 상세 정보 요청
router.get('/emotionData/:selected/:currentPage/:dataId', (req, res)=>{
    logger.info(`get /emotionData/${req.params.selected}/${req.params.currentPage}/${req.params.dataId}`);
    dataDetail.emotionData(req, res);
})

//질문 생성 모델 데이터 삭제 요청
router.get('/questionData/:selected/:currentPage/:dataId/deleteData', (req, res)=>{
    logger.info(`get /questionData/${req.params.selected}/${req.params.currentPage}/${req.params.dataId}/deleteData`);
    deleteData.questionData(req, res);
})

//의도 파악 모델 데이터 삭제 요청
router.get('/intentData/:selected/:currentPage/:dataId/deleteData', (req, res)=>{
    logger.info(`get /intentData/${req.params.selected}/${req.params.currentPage}/${req.params.dataId}/deleteData`);
    deleteData.intentData(req, res);
})

//감정 분류 모델 데이터 삭제 요청
router.get('/emotionData/:selected/:currentPage/:dataId/deleteData', (req, res)=>{
    logger.info(`get /emotionData/${req.params.selected}/${req.params.currentPage}/${req.params.dataId}/deleteData`);
    deleteData.emotionData(req, res);
})

//질문 생성 모델 데이터셋 선택 요청
router.get('/questionData/:selected/load', (req, res)=>{
    logger.info(`get /questionData/${req.params.selected}/load`);
    dataLoad.questionData(req, res);
})

//의도 파악 모델 데이터셋 선택 요청
router.get('/intentData/:selected/load', (req, res)=>{
    logger.info(`get /intentData/${req.params.selected}/load`);
    dataLoad.intentData(req, res);
})

//감정 분류 모델 데이터셋 선택 요청
router.get('/emotionData/:selected/load', (req, res)=>{
    logger.info(`get /emotionData/${req.params.selected}/load`);
    dataLoad.emotionData(req, res);
})

module.exports=router;