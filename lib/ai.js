const bodyParser = require('body-parser');
const db = require('./db');
const auth = require('./util');
const logger = require('./logger');

module.exports = {

    //'/admin/ai/version' 요청 응답
    view : async (req, res)=>{ // view 함수를 async로 유지

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/modelRequire';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        if(login===true){

            let aiData = {};

            //fast api에 요청
            try {
                const fetch = await import('node-fetch');
                const response = await fetch(fastapiUrl);
                if (!response.ok) {
                    logger.error(`FastAPI 요청 실패: ${response.status}`);
                    return res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                }
                aiData = await response.json();
                logger.debug('FastAPI 응답:', aiData);
            } catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                return res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }

            // 각 모델들의 성능 지표를 가져오는 Promise 배열 생성
            const questionScorePromises = aiData.questionModel.map(model => {
                return new Promise((resolve, reject) => {
                    db.query(`SELECT rouge FROM questionAi WHERE modelName = ?`, [model[0]], (error, result) => {
                        if (error) {
                            logger.error(`데이터베이스 오류 발생 (questionAi)`, error);
                            reject(error);
                            return;
                        }
                        resolve(result[0] ? result[0].rouge : null);
                    });
                });
            });

            const emotionScorePromises = aiData.emotionModel.map(model => {
                return new Promise((resolve, reject) => {
                    db.query(`SELECT f1 FROM emotionAi WHERE modelName = ?`, [model[0]], (error, result) => {
                        if (error) {
                            logger.error(`데이터베이스 오류 발생 (emotionAi)`, error);
                            reject(error);
                            return;
                        }
                        resolve(result[0] ? result[0].f1 : null);
                    });
                });
            });

            const intentionScorePromises = aiData.intentionModel.map(model => {
                return new Promise((resolve, reject) => {
                    db.query(`SELECT accuracy FROM intentionAi WHERE modelName = ?`, [model[0]], (error, result) => {
                        if (error) {
                            logger.error(`데이터베이스 오류 발생 (intentionAi)`, error);
                            reject(error);
                            return;
                        }
                        resolve(result[0] ? result[0].accuracy : null);
                    });
                });
            });

            let questionScore = [];
            let emotionScore = [];
            let intentionScore = [];

            try {
                // 모든 Promise가 완료될 때까지 기다림
                questionScore = await Promise.all(questionScorePromises);
                emotionScore = await Promise.all(emotionScorePromises);
                intentionScore = await Promise.all(intentionScorePromises);
                logger.debug('questionScore:', questionScore);
                logger.debug('emotionScore:', emotionScore);
                logger.debug('intentionScore:', intentionScore);
            } catch (error) {
                logger.error('성능 지표 조회 중 오류 발생:', error);
                return res.status(500).send(`<h1>성능 지표 조회 중 오류 발생</h1>`);
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
                    return res.status(500).send(`<h1>서버 내부 오류 발생</h1>`);
                }
                res.end(html);
            });
        }
    },

    //'/emotionLoad/:modelName' 요청 응답
    emotionLoad : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/emotion/set_emotion';

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
                const fetch = await import('node-fetch');
                const response = await fetch(fastapiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
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
                return; // 오류 발생 시 리다이렉트 전에 응답을 종료하는 것이 좋습니다.
            }

            res.redirect('/admin/ai/version');
            res.end();

        }
    },

    //'/intentionLoad/:modelName' 요청 응답
    intentionLoad : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/intention/set_intention';

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
                const fetch = await import('node-fetch');
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
        const fastapiUrl = 'http://192.9.202.17:3004/question/set_question';

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
                const fetch = await import('node-fetch');
                const response = await fetch(fastapiUrl, {
                    method: 'POSt',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
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

    //'/deleteEmotion/:modelName' 요청 응답
    deleteEmotion : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/emotion/delete_emotion';

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
                const fetch = await import('node-fetch');
                const response = await fetch(fastapiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
                });
                if (!response.ok) {
                    logger.error(`FastAPI 요청 실패: ${response.status}`);
                    return res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                }
                //json 파일 내용 저장
                const aiData = await response.json();
                logger.debug('FastAPI 응답:', aiData);
            } catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                return res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }

            // 데이터베이스 삭제 쿼리를 Promise로 감싸고 await로 기다립니다.
            try {
                await new Promise((resolve, reject) => {
                    db.query(`DELETE FROM emotionAi WHERE modelName = ?`, [deleteModelName], (error, result) => {
                        if (error) {
                            logger.error(`데이터베이스 오류 발생`, error);
                            reject(`데이터베이스 오류`);
                            return;
                        }
                        resolve(result);
                    });
                });
                logger.debug(`모델 ${deleteModelName} 삭제 완료`);
                res.redirect('/admin/ai/version');
                res.end();
            } catch (error) {
                res.status(1003).send(`<h1>${error}</h1>`);
            }
        }
    },

    //'/deleteIntention/:modelName' 요청 응답
    deleteIntention : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/intention/delete_intention';

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
                const fetch = await import('node-fetch');
                const response = await fetch(fastapiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
                });
                if (!response.ok) {
                    logger.error(`FastAPI 요청 실패: ${response.status}`);
                    return res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                }
                //json 파일 내용 저장
                const aiData = await response.json();
                logger.debug('FastAPI 응답:', aiData);
            } catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                return res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }

            // 데이터베이스 삭제 쿼리를 Promise로 감싸고 await로 기다립니다.
            try {
                await new Promise((resolve, reject) => {
                    db.query(`DELETE FROM intentionAi WHERE modelName = ?`, [deleteModelName], (error, result) => {
                        if (error) {
                            logger.error(`데이터베이스 오류 발생`, error);
                            reject(`데이터베이스 오류`);
                            return;
                        }
                        resolve(result);
                    });
                });
                logger.debug(`모델 ${deleteModelName} 삭제 완료`);
                res.redirect('/admin/ai/version');
                res.end();
            } catch (error) {
                res.status(1003).send(`<h1>${error}</h1>`);
            }
        }
    },

    //'/deleteQuestion/:modelName' 요청 응답
    deleteQuestion : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/question/delete_question';

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
                const fetch = await import('node-fetch');
                const response = await fetch(fastapiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
                });
                if (!response.ok) {
                    logger.error(`FastAPI 요청 실패: ${response.status}`);
                    return res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                }
                //json 파일 내용 저장
                const aiData = await response.json();
                logger.debug('FastAPI 응답:', aiData);
            } catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                return res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }

            // 데이터베이스 삭제 쿼리를 Promise로 감싸고 await로 기다립니다.
            try {
                await new Promise((resolve, reject) => {
                    db.query(`DELETE FROM questionAi WHERE modelName = ?`, [deleteModelName], (error, result) => {
                        if (error) {
                            logger.error(`데이터베이스 오류 발생`, error);
                            reject(`데이터베이스 오류`);
                            return;
                        }
                        resolve(result);
                    });
                });
                logger.debug(`모델 ${deleteModelName} 삭제 완료`);
                res.redirect('/admin/ai/version');
                res.end();
            } catch (error) {
                res.status(1003).send(`<h1>${error}</h1>`);
            }
        }
    },

    //'/emotionModelTrain' 요청 응답
    emotionModelTrain : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/emotion/train_emotion';

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
                const fetch = await import('node-fetch');
                const response = await fetch(fastapiUrl, {
                    method: 'POSt',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
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
        const fastapiUrl = 'http://192.9.202.17:3004/intention/train_intention';

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
                const fetch = await import('node-fetch');
                const response = await fetch(fastapiUrl, {
                    method: 'POSt',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData),
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
        const fastapiUrl = 'http://192.9.202.17:3004/question/train_question';

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
                const fetch = await import('node-fetch');

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

        var questionModelAuto = questionModelAuto ? 1 : 0;
        var emotionModelAuto = emotionModelAuto ? 1 : 0;
        var intentionModelAuto = intentionModelAuto ? 1 : 0;

        const requestData = {
            "questionAuto": questionModelAuto,
	        "intentionAuto": emotionModelAuto, 
	        "emotionAuto": intentionModelAuto
        };

        if(login===true){

            //fast api에 요청
            try {
                const fetch = await import('node-fetch');

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

            let aiData = {};

            //fast api에 요청
            try {
                const fetch = await import('node-fetch');

                const response = await fetch(fastapiUrl);
                if (!response.ok) {
                    logger.error(`FastAPI 요청 실패: ${response.status}`);
                    return res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                }
                aiData = await response.json();
                logger.debug('FastAPI 응답:', aiData);
            } catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                return res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }

            try {
                // questionAi 업데이트
                await new Promise((resolve, reject) => {
                    db.query(`UPDATE questionAi SET rouge = ? WHERE modelName = ?`,
                        [aiData.questionScore, aiData.questionModel], (error, result) => {
                            if (error) {
                                logger.error(`questionAi 업데이트 오류`, error);
                                reject(`questionAi 업데이트 오류`);
                                return;
                            }
                            resolve(result);
                        });
                });

                // intentionAi 업데이트
                await new Promise((resolve, reject) => {
                    db.query(`UPDATE intentionAi SET accuracy = ? WHERE modelName = ?`,
                        [aiData.intentionScore, aiData.intentionModel], (error, result) => {
                            if (error) {
                                logger.error(`intentionAi 업데이트 오류`, error);
                                reject(`intentionAi 업데이트 오류`);
                                return;
                            }
                            resolve(result);
                        });
                });

                // emotionAi 업데이트
                await new Promise((resolve, reject) => {
                    db.query(`UPDATE emotionAi SET f1 = ? WHERE modelName = ?`,
                        [aiData.emotionScore, aiData.emotionModel], (error, result) => {
                            if (error) {
                                logger.error(`emotionAi 업데이트 오류`, error);
                                reject(`emotionAi 업데이트 오류`);
                                return;
                            }
                            resolve(result);
                        });
                });

                res.redirect('/admin/ai/version');
                res.end();

            } catch (error) {
                res.status(1003).send(`<h1>${error}</h1>`);
            }
        }
    },
}