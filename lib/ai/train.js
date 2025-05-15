const bodyParser = require('body-parser');
const db = require('../db');
const auth = require('../util');
const logger = require('../logger');

module.exports = {
    
    //'/emotionModelTrain' 요청 응답
    emotionModelTrain : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/emotion/train_emotion';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);
 
        //생성할 모델 이름과 학습시킬 파라미터들 저장
        var modelName = req.body.modelName;
        var epoch = req.body.epoch;
        var dropOut = req.body.dropOut;

        //json 형태로 전달할 파라미터 저장
        const requestData = {
            "newModelName": modelName,
            "epoch": epoch,
            "dropOut": dropOut
        };

        //로그인 되어있을 경우에만 접근 허용
        if(login===true){
            //fast api에 요청
            try {

                //post 방식으로 요청하여 response에 응답 저장
                const response = await fetch(fastapiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
                });

                //요청 실패했을 경우 에러 처리
                if (!response.ok) {
                    logger.error(`FastAPI 요청 실패: ${response.status}`);
                    return res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                } 
                
                //요청 성공했을 경우 db에 해당 모델의 정보 저장 및 /admin/ai/version 리다이렉트
                else {

                    //db에 해당 모델 정보 저장
                    db.query(`INSERT INTO emotionAi (modelName, f1, epoch, dropOut) VALUES (?, 0, ?, ?)`,
                        [modelName, epoch, dropOut], (error, result)=>{

                            //db 오류처리
                            if(error){
                                logger.error(`데이터베이스 오류`, error);
                                return res.status(500).send(`<h1>데이터베이스 오류</h1>`);
                            }
                            res.redirect('/admin/ai/version');
                            res.end(); 
                        }
                    )  
                }
            } 
            
            //fast api 요청 실패 처리
            catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                return res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }
        }

        //로그인 상태가 아닐 경우 예외 처리
        else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
        }
    },

    //'/intentModelTrain' 요청 응답
    intentModelTrain : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/intent/train_intent';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);
 
        //생성할 모델 이름과 학습시킬 파라미터들 저장
        var modelName = req.body.modelName;
        var epoch = req.body.epoch;
        var dropOut = req.body.dropOut;

        //json 형태로 전달할 파라미터 저장
        const requestData = {
            "newModelName": modelName,
            "epoch": epoch,
            "dropOut": dropOut
        };

        //로그인 되어있을 경우에만 접근 허용
        if(login===true){
            //fast api에 요청
            try {

                //post 방식으로 요청하여 response에 응답 저장
                const response = await fetch(fastapiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
                });

                //요청 실패했을 경우 에러 처리
                if (!response.ok) {
                    logger.error(`FastAPI 요청 실패: ${response.status}`);
                    return res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                } 
                
                //요청 성공했을 경우 /admin/ai/version 리다이렉트
                else {
                    //db에 해당 모델 정보 저장
                    db.query(`INSERT INTO intentionAi (modelName, accuracy, epoch, dropOut) VALUES (?, 0, ?, ?)`,
                        [modelName, epoch, dropOut], (error, result)=>{

                            //db 오류처리
                            if(error){
                                logger.error(`데이터베이스 오류`, error);
                                return res.status(500).send(`<h1>데이터베이스 오류</h1>`);
                            }
                            res.redirect('/admin/ai/version');
                            res.end(); 
                        }
                    )   
                }
            } 
            
            //fast api 요청 실패 처리
            catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                return res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }
        }

        //로그인 상태가 아닐 경우 예외 처리
        else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
        }
    },

    //'/questionModelTrain' 요청 응답
    questionModelTrain : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/question/train_question';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);
 
        //생성할 모델 이름과 학습시킬 파라미터들 저장
        var modelName = req.body.modelName;
        var epoch = req.body.epoch;
        var batchSize = req.body.batchSize;

        //json 형태로 전달할 파라미터 저장
        const requestData = {
            "newModelName": modelName,
            "epoch": epoch,
            "batchSize": batchSize
        };

        //로그인 되어있을 경우에만 접근 허용
        if(login===true){
            //fast api에 요청
            try {

                //post 방식으로 요청하여 response에 응답 저장
                const response = await fetch(fastapiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
                });

                //요청 실패했을 경우 에러 처리
                if (!response.ok) {
                    logger.error(`FastAPI 요청 실패: ${response.status}`);
                    return res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                } 
                
                //요청 성공했을 경우 /admin/ai/version 리다이렉트
                else {
                    //db에 해당 모델 정보 저장
                    db.query(`INSERT INTO questionAi (modelName, rouge, epoch, batchSize) VALUES (?, 0, ?, ?)`,
                        [modelName, epoch, batchSize], (error, result)=>{

                            //db 오류처리
                            if(error){
                                logger.error(`데이터베이스 오류`, error);
                                return res.status(500).send(`<h1>데이터베이스 오류</h1>`);
                            }
                            res.redirect('/admin/ai/version');
                            res.end(); 
                        }
                    )  
                }
            } 
            
            //fast api 요청 실패 처리
            catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                return res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }
        }

        //로그인 상태가 아닐 경우 예외 처리
        else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
        }
    }
}