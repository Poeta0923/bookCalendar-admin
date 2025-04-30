const bodyParser = require('body-parser');
const db = require('./db');
const auth = require('./util');
const logger = require('./logger');
const fetch = require('node-fetch');

module.exports = {

    //'/admin/ai/version' 요청 응답
    view : async (req, res)=>{ // view 함수를 async로 변경

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/modelRequire';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        if(login===true){

            //fast api에 요청
            try {
                const response = await fetch(fastapiUrl);
                if (!response.ok) {
                    logger.error(`FastAPI 요청 실패: ${response.status}`);
                    res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                } else {
                    //json 파일 내용 저장
                    const aiData = await response.json();
                    logger.debug('FastAPI 응답:', aiData);
                }
            } catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }

            //각 모델들의 성능지표 저장
            var questionScore = [];

            for(i=0; i<aiData.questionModel.length; i++){
                db.query(`SELECT * FROM questionAi WHERE modelName = ?`,
                    [aiData.questionModel[i][0]], (error, result)=>{
                        if(error){
                            logger.error(`데이터베이스 오류 발생`, error);
                            res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                            return;
                        }
                        questionScore[i] = result.rouge;
                    }
                )
            }

            var emotionScore = [];

            for(i=0; i<aiData.emotionModel.length; i++){
                db.query(`SELECT * FROM emotionAi WHERE modelName = ?`,
                    [aiData.emotionModel[i][0]], (error, result)=>{
                        if(error){
                            logger.error(`데이터베이스 오류 발생`, error);
                            res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                            return;
                        }
                        emotionScore[i] = result.f1;
                    }
                )
            }
            
            var intentionScore = [];

            for(i=0; i<aiData.intentionModel.length; i++){
                db.query(`SELECT * FROM intentionAi WHERE modelName = ?`,
                    [aiData.intentionModel[i][0]], (error, result)=>{
                        if(error){
                            logger.error(`데이터베이스 오류 발생`, error);
                            res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                            return;
                        }
                        intentionScore[i] = result.accuracy;
                    }
                )
            }

            var context = {
                who : name,
                body : "aiVersion.ejs",
                questionModel : aiData.questionModel,
                emotionModel : aiData.emotionModel,
                intentionModel : aiData.intentionModel,
                questionModelAuto : aiData.questionModelAuto,
                emotionModelAuto : aiData.emotionModelAuto,
                intentionModelAuto : aiData.intentionModelAuto,
                questionLoaded : aiData.questionLoaded,
                emotionLoaded : aiData.emotionLoaded,
                intentionLoaded : aiData.intentionLoaded,
                questionScore : questionScore,
                emotionScore : emotionScore,
                intentionScore : intentionScore
            }
            //mainFrame.ejs 화면에 context 내용 추가하여 전송
            req.app.render('mainFrame', context, (error, html)=>{

                //화면 구성 실패 에러 처리
                if(error){
                    logger.error(`mainFrame 렌더링 오류`, error);
                    res.status(500).send(`<h1>서버 내부 오류 발생</h1>`)
                    return;
                }
                res.end(html);
            })
        }
    },

    //'/emotionLoad/:modelName' 요청 응답
    emotionLoad : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/emotionModelLoad';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        var loadModelName = req.params.modelName;

        const requestData = {
            "loadModelName": loadModelName
        };

        if(login===true){

            //fast api에 요청
            try {
                const response = await fetch(fastapiUrl, {
                    method: 'POSt',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
                    signal: controller.signal,
                });
                if (!response.ok) {
                    logger.error(`FastAPI 요청 실패: ${response.status}`);
                    res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                } else {
                    //json 파일 내용 저장
                    const aiData = await response.json();
                    logger.debug('FastAPI 응답:', aiData);
                }
            } catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }

            res.redirect('/admin/ai/version');
            res.end();

        }
    },

    //'/intentionLoad/:modelName' 요청 응답
    intentionLoad : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/intentionModelLoad';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        var loadModelName = req.params.modelName;

        const requestData = {
            "loadModelName": loadModelName
        };

        if(login===true){

            //fast api에 요청
            try {
                const response = await fetch(fastapiUrl, {
                    method: 'POSt',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
                    signal: controller.signal,
                });
                if (!response.ok) {
                    logger.error(`FastAPI 요청 실패: ${response.status}`);
                    res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                } else {
                    //json 파일 내용 저장
                    const aiData = await response.json();
                    logger.debug('FastAPI 응답:', aiData);
                }
            } catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }

            res.redirect('/admin/ai/version');
            res.end();

        }
    },

    //'/questionLoad/:modelName' 요청 응답
    questionLoad : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/questionModelLoad';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        var loadModelName = req.params.modelName;

        const requestData = {
            "loadModelName": loadModelName
        };

        if(login===true){

            //fast api에 요청
            try {
                const response = await fetch(fastapiUrl, {
                    method: 'POSt',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
                    signal: controller.signal,
                });
                if (!response.ok) {
                    logger.error(`FastAPI 요청 실패: ${response.status}`);
                    res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                } else {
                    //json 파일 내용 저장
                    const aiData = await response.json();
                    logger.debug('FastAPI 응답:', aiData);
                }
            } catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }

            res.redirect('/admin/ai/version');
            res.end();

        }
    },

    //'/delete/:modelName' 요청 응답
    deleteEmotion : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/deleteModel';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        var deleteModelName = req.params.modelName;

        const requestData = {
            "deleteModelName": deleteModelName
        };

        if(login===true){

            //fast api에 요청
            try {
                const response = await fetch(fastapiUrl, {
                    method: 'POSt',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
                    signal: controller.signal,
                });
                if (!response.ok) {
                    logger.error(`FastAPI 요청 실패: ${response.status}`);
                    res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                } else {
                    //json 파일 내용 저장
                    const aiData = await response.json();
                    logger.debug('FastAPI 응답:', aiData);
                }
            } catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }

            db.query(`DELETE FROM emotionAi WHERE modelName = ?`,
                [deleteModelName], (error, result)=>{
                    if(error){
                        logger.error(`데이터베이스 오류 발생`, error);
                        res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                        return;
                    }
                    res.redirect('/admin/ai/version');
                    res.end();

                }
            )
        }
    },

    //'/emotionModelTrain' 요청 응답
    emotionModelTrain : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/emotionModelTrain';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);
 
        var modelName = req.body.modelName;
        var epoch = req.body.epoch;
        var dropOut = req.body.dropOut;
        var batchSize = req.body.batchSize;

        const requestData = {
            "newModelName": modelName,
            "epoch": epoch,
            "dropOut": dropOut,
            "batchSize": batchSize
        };

        if(login===true){

            //fast api에 요청
            try {
                const response = await fetch(fastapiUrl, {
                    method: 'POSt',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
                    signal: controller.signal,
                });
                if (!response.ok) {
                    logger.error(`FastAPI 요청 실패: ${response.status}`);
                    res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                } else {
                    //json 파일 내용 저장
                    const aiData = await response.json();
                    logger.debug('FastAPI 응답:', aiData);
                }
            } catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }

            res.redirect('/admin/ai/version');
            res.end();
        }
    },

    //'/intentionModelTrain' 요청 응답
    intentionModelTrain : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/intentionModelTrain';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);
 
        var modelName = req.body.modelName;
        var epoch = req.body.epoch;
        var dropOut = req.body.dropOut;
        var batchSize = req.body.batchSize;

        const requestData = {
            "newModelName": modelName,
            "epoch": epoch,
            "dropOut": dropOut,
            "batchSize": batchSize
        };

        if(login===true){

            //fast api에 요청
            try {
                const response = await fetch(fastapiUrl, {
                    method: 'POSt',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
                    signal: controller.signal,
                });
                if (!response.ok) {
                    logger.error(`FastAPI 요청 실패: ${response.status}`);
                    res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                } else {
                    //json 파일 내용 저장
                    const aiData = await response.json();
                    logger.debug('FastAPI 응답:', aiData);
                }
            } catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }

            res.redirect('/admin/ai/version');
            res.end();
        }
    },

    //'/questionModelTrain' 요청 응답
    questionModelTrain : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/questionModelTrain';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);
 
        var modelName = req.body.modelName;
        var epoch = req.body.epoch;
        var batchSize = req.body.batchSize;

        const requestData = {
            "newModelName": modelName,
            "epoch": epoch,
            "batchSize": batchSize
        };

        if(login===true){

            //fast api에 요청
            try {
                const response = await fetch(fastapiUrl, {
                    method: 'POSt',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
                    signal: controller.signal,
                });
                if (!response.ok) {
                    logger.error(`FastAPI 요청 실패: ${response.status}`);
                    res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                } else {
                    //json 파일 내용 저장
                    const aiData = await response.json();
                    logger.debug('FastAPI 응답:', aiData);
                }
            } catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }

            res.redirect('/admin/ai/version');
            res.end();
        }
    },

    //'/updateAuto' 요청 응답
    updateAuto : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/autoTrain';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);
 
        var questionModelAuto = req.body.questionModelAuto;
        var emotionModelAuto = req.body.emotionModelAuto;
        var intentionModelAuto = req.body.intentionModelAuto;

        const requestData = {
            "questionAuto": questionModelAuto,
	        "intentionAuto": emotionModelAuto, 
	        "emotionAuto": intentionModelAuto
        };

        if(login===true){

            //fast api에 요청
            try {
                const response = await fetch(fastapiUrl, {
                    method: 'POSt',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
                    signal: controller.signal,
                });
                if (!response.ok) {
                    logger.error(`FastAPI 요청 실패: ${response.status}`);
                    res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                } else {
                    //json 파일 내용 저장
                    const aiData = await response.json();
                    logger.debug('FastAPI 응답:', aiData);
                }
            } catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }

            res.redirect('/admin/ai/version');
            res.end();
        }
    },

    testModel : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/testModel';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        if(login===true){

            //fast api에 요청
            try {
                const response = await fetch(fastapiUrl);
                if (!response.ok) {
                    logger.error(`FastAPI 요청 실패: ${response.status}`);
                    res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                } else {
                    //json 파일 내용 저장
                    const aiData = await response.json();
                    logger.debug('FastAPI 응답:', aiData);
                }
            } catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }

            db.query(`UPDATE questionAi SET rouge = ? WHERE modelName = ?`,
                [aiData.questionScore, aiData.questionModel], (error1, questionScore)=>{
                    if(error1){
                        logger.error(`데이터베이스 오류 발생`, error);
                        res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                        return;
                    }
                    db.query(`UPDATE intentionAi SET accuracy = ? WHERE modelName = ?`,
                        [aiData.intentionScore, aiData.intentionModel], (error2, intentionScore)=>{
                            if(error2){
                                logger.error(`데이터베이스 오류 발생`, error);
                                res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                                return;
                            }
                            db.query(`UPDATE emotionAi SET f1 = ? WHERE modelName = ?`,
                                [aiData.emotionScore, aiData.emotionModel], (error3, emotionScore)=>{
                                    res.redirect('/admin/ai/version');
                                    res.end();
                                }
                            )
                        }
                    )
                }
            )
        }
    }
}