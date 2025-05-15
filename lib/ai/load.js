const bodyParser = require('body-parser');
const auth = require('../util');
const logger = require('../logger');

module.exports={

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

        //로그인 상태가 아닐 경우 예외 처리
        else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
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

        //로그인 상태가 아닐 경우 예외 처리
        else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
        }
    }
}