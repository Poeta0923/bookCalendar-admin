const bodyParser = require('body-parser');
const db = require('../db');
const auth = require('../util');
const logger = require('../logger');

module.exports = {

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

        //로그인 상태가 아닐 경우 예외 처리
        else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
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

        //로그인 상태가 아닐 경우 예외 처리
        else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
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

        //로그인 상태가 아닐 경우 예외 처리
        else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
        }
    }
}