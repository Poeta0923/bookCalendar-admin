const bodyParser = require('body-parser');
const db = require('../db');
const auth = require('../util');
const logger = require('../logger');

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

    }
}