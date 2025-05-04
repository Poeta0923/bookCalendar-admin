const bodyParser = require('body-parser');
const db = require('./db');
const auth = require('./util');
const logger = require('./logger');

module.exports = {

    //'/admin/ai/version' 요청 응답
    view : async(req, res)=>{

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/modelRequire';

        //로그인 되어있을 경우에만 접근 허용
        if(login===true){
            try {
                //fast api의 응답을 저장
                const response = await fetch(fastapiUrl);

                //응답을 받지 못했을 경우 예외처리
                if(!response.ok){
                    logger.error(`fast api 요청 수신 실패 ${response.status}`);
                    return res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                }

                //요청을 받았을 경우 json 파일 내용 저장
                const aiData = await response.json();

                //질문 생성 모델 세부 정보 저장
                const questionDetail = await new Promise((resolve, reject) => {
                    db.query(`SELECT * FROM questionAi`, (error, results) => {
                        if (error) reject(error);
                        resolve(results);
                    });
                });

                //의도 파악 모델 세부 정보 저장
                const intentDetail = await new Promise((resolve, reject) => {
                    db.query(`SELECT * FROM intentionAi`, (error, results) => {
                        if (error) reject(error);
                        resolve(results);
                    });
                });

                //감정 분류 모델 세부 정보 저장
                const emotionDetail = await new Promise((resolve, reject) => {
                    db.query(`SELECT * FROM emotionAi`, (error, results) => {
                        if (error) reject(error);
                        resolve(results);
                    });
                });

                //mainFrame에 전달될 파라미터
                var context = {
                    who : name,
                    body : 'aiVersion.ejs',
                    questionModel : aiData.questionModel,
                    intentModel : aiData.intentModel,
                    emotionModel : aiData.emotionModel,
                    questionLoaded : aiData.questionLoaded,
                    intentLoaded : aiData.intentLoaded,
                    emotionLoaded : aiData.emotionLoaded,
                    questionModelAuto : aiData.questionModelAuto,
                    intentModelAuto : aiData.intentModelAuto,
                    emotionModelAuto : aiData.emotionModelAuto,
                    questionDetail : questionDetail,
                    intentDetail : intentDetail,
                    emotionDetail : emotionDetail
                };

                //mainFrame에 파라미터를 포함시켜 렌더링
                req.app.render('mainFrame', context, (error, html)=>{

                    //렌더링 오류 처리
                    if(error){
                        logger.error(`mainFrame 렌더링 오류`, error);
                        return res.status(500).send(`<h1>서버 내부 오류 발생</h1>`);
                    }
                    res.end(html);
                });
            } 
        
            //fast api 요청 실패 처리
            catch (error) {
                console.error('Fetch 에러:', error);
                res.status(500).send('FastAPI 요청 중 오류가 발생했습니다.');
            }
        }

    },

    //'/emotionLoad/:modelName' 요청 응답
    emotionLoad : async(req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/emotion/set_emotion';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //전달받은 로드할 모델명 저장
        var loadModelName = req.params.modelName;

        //json 형태로 전달할 파라미터 저장
        const requestData = {
            "loadModelName": loadModelName
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
                    res.redirect('/admin/ai/version');
                    res.end();
                }
            } 
            
            //fast api 요청 실패 처리
            catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                return res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }
        }
    },

    //'/intentLoad/:modelName' 요청 응답
    intentLoad : async(req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/intent/set_intent';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //전달받은 로드할 모델명 저장
        var loadModelName = req.params.modelName;

        //json 형태로 전달할 파라미터 저장
        const requestData = {
            "loadModelName": loadModelName
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
                    res.redirect('/admin/ai/version');
                    res.end();
                }
            } 
            
            //fast api 요청 실패 처리
            catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                return res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }
        }
    },

    //'/questionLoad/:modelName' 요청 응답
    questionLoad : async(req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/question/set_question';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //전달받은 로드할 모델명 저장
        var loadModelName = req.params.modelName;

        //json 형태로 전달할 파라미터 저장
        const requestData = {
            "loadModelName": loadModelName
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
                    res.redirect('/admin/ai/version');
                    res.end();
                }
            } 
            
            //fast api 요청 실패 처리
            catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                return res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }
        }
    },

    //'/deleteEmotion/:modelName' 요청 응답
    deleteEmotion : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/emotion/delete_emotion';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //전달받은 삭제할 모델명 저장
        var deleteModelName = req.params.modelName;

        //json 형태로 전달할 파라미터 저장
        const requestData = {
            "deleteModelName": deleteModelName
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

                    //db에서 해당 모델에 대한 정보 삭제
                    db.query(`DELETE FROM emotionAi WHERE modelName = ?`,
                        [deleteModelName], (error, result)=>{

                            //db 에러 처리
                            if(error){
                                logger.error(`데이터베이스 오류`, error);
                                return res.status(500).send(`<h1>데이터베이스 오류</h1>`)
                            }

                            //db 삭제 성공 시 /admin/ai/version 리다이렉트
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
    },

    //'/deleteIntent/:modelName' 요청 응답
    deleteIntent : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/intent/delete_intent';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //전달받은 삭제할 모델명 저장
        var deleteModelName = req.params.modelName;

        //json 형태로 전달할 파라미터 저장
        const requestData = {
            "deleteModelName": deleteModelName
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

                    //db에서 해당 모델에 대한 정보 삭제
                    db.query(`DELETE FROM intentionAi WHERE modelName = ?`,
                        [deleteModelName], (error, result)=>{

                            //db 에러 처리
                            if(error){
                                logger.error(`데이터베이스 오류`, error);
                                return res.status(500).send(`<h1>데이터베이스 오류</h1>`)
                            }

                            //db 삭제 성공 시 /admin/ai/version 리다이렉트
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
    },

    //'/deleteQuestion/:modelName' 요청 응답
    deleteQuestion : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/question/delete_question';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //전달받은 삭제할 모델명 저장
        var deleteModelName = req.params.modelName;

        //json 형태로 전달할 파라미터 저장
        const requestData = {
            "deleteModelName": deleteModelName
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

                    //db에서 해당 모델에 대한 정보 삭제
                    db.query(`DELETE FROM questionAi WHERE modelName = ?`,
                        [deleteModelName], (error, result)=>{

                            //db 에러 처리
                            if(error){
                                logger.error(`데이터베이스 오류`, error);
                                return res.status(500).send(`<h1>데이터베이스 오류</h1>`)
                            }

                            //db 삭제 성공 시 /admin/ai/version 리다이렉트
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
    },

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
                    db.query(`INSERT INTO emotionAi (modelName, accuracy, epoch, dropOut) VALUES (?, 0, ?, ?)`,
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
                    db.query(`INSERT INTO emotionAi (modelName, rouge, epoch, batchSize) VALUES (?, 0, ?, ?)`,
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
    },

    //'/updateAuto' 요청 응답
    updateAuto : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/autoTrain';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);
 
        //토글버튼의 값 저장. 활성화는 1, 비활성화는 undefined로 저장
        var questionModelAuto = req.body.questionModelAuto;
        var emotionModelAuto = req.body.emotionModelAuto;
        var intentModelAuto = req.body.intentModelAuto;

        //undefined일 경우 0 저장
        var questionModelAuto = questionModelAuto ? 1 : 0;
        var emotionModelAuto = emotionModelAuto ? 1 : 0;
        var intentModelAuto = intentModelAuto ? 1 : 0;

        //json 형태로 전달할 파라미터 저장
        const requestData = {
            "questionAuto": questionModelAuto,
	        "intentAuto": intentModelAuto, 
	        "emotionAuto": emotionModelAuto
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
                    res.redirect('/admin/ai/version');
                    res.end();    
                }
            } 
            
            //fast api 요청 실패 처리
            catch (error) {
                logger.error('FastAPI 통신 오류:', error);
                return res.status(500).send(`<h1>FastAPI 통신 오류</h1>`);
            }
        }
    },

    testModel : async (req, res)=>{

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/testModel';

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //로그인 되어있을 경우에만 접근 허용
        if(login===true){
            try {
                //fast api의 응답을 저장
                const response = await fetch(fastapiUrl);

                //응답을 받지 못했을 경우 예외처리
                if(!response.ok){
                    logger.error(`fast api 요청 수신 실패 ${response.status}`);
                    return res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                }

                //요청을 받았을 경우 json 파일 내용 저장
                const aiData = await response.json();

                //db에 json 파일로 전달받은 감정 분류 모델이 저장되어있는지 확인
                db.query(`SELECT * FROM emotionAi WHERE modelName = ?`,
                    [aiData.emotionModel], (error1, result1)=>{

                        //db 오류 처리
                        if(error1){
                            logger.error(`데이터베이스 오류`, error);
                            return res.status(500).send(`<h1>데이터베이스 오류</h1>`)
                        }

                        //해당 모델이 저장되어있을 경우
                        if(result1.length===1){
                            
                            //db에 성능지표 업데이트
                            db.query(`UPDATE emotionAi SET f1 = ? WHERE modelName = ?`,
                                [aiData.emotionScore, aiData.modelName], (error2, result2)=>{

                                    //db 오류 처리
                                    if(error2){
                                        logger.error(`데이터베이스 오류`, error);
                                        return res.status(500).send(`<h1>데이터베이스 오류</h1>`)
                                    }
                                }
                            )
                        }
                    }
                )

                //db에 json 파일로 전달받은 의도 파악 모델이 저장되어있는지 확인
                db.query(`SELECT * FROM intentionAi WHERE modelName = ?`,
                    [aiData.intentModel], (error1, result1)=>{

                        //db 오류 처리
                        if(error1){
                            logger.error(`데이터베이스 오류`, error);
                            return res.status(500).send(`<h1>데이터베이스 오류</h1>`)
                        }

                        //해당 모델이 저장되어있을 경우
                        if(result1.length===1){
                            
                            //db에 성능지표 업데이트
                            db.query(`UPDATE intentionAi SET accuracy = ? WHERE modelName = ?`,
                                [aiData.intentScore, aiData.modelName], (error2, result2)=>{

                                    //db 오류 처리
                                    if(error2){
                                        logger.error(`데이터베이스 오류`, error);
                                        return res.status(500).send(`<h1>데이터베이스 오류</h1>`)
                                    }
                                }
                            )
                        }
                    }
                )

                //db에 json 파일로 전달받은 질문 생성 모델이 저장되어있는지 확인
                db.query(`SELECT * FROM questionAi WHERE modelName = ?`,
                    [aiData.questionModel], (error1, result1)=>{

                        //db 오류 처리
                        if(error1){
                            logger.error(`데이터베이스 오류`, error);
                            return res.status(500).send(`<h1>데이터베이스 오류</h1>`)
                        }

                        //해당 모델이 저장되어있을 경우
                        if(result1.length===1){
                            
                            //db에 성능지표 업데이트
                            db.query(`UPDATE questionAi SET rouge = ? WHERE modelName = ?`,
                                [aiData.emotionScore, aiData.modelName], (error2, result2)=>{

                                    //db 오류 처리
                                    if(error2){
                                        logger.error(`데이터베이스 오류`, error);
                                        return res.status(500).send(`<h1>데이터베이스 오류</h1>`)
                                    }
                                }
                            )
                        }
                    }
                )

                //db 저장 종료 후 /admin/ai/version 리다이렉트
                res.redirect('/admin/ai/version');
                res.end();
            } 
        
            //fast api 요청 실패 처리
            catch (error) {
                console.error('Fetch 에러:', error);
                res.status(500).send('FastAPI 요청 중 오류가 발생했습니다.');
            }
        }
    }
}