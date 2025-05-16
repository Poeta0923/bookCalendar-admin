const bodyParser = require('body-parser');
const db = require('../db');
const auth = require('../util');
const logger = require('../logger');

module.exports = {

    questionData : async(req, res)=>{

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);
        
        //현재 페이지 정보
        var whatAi = '질문 생성 모델 데이터셋';
        var url = 'questionData';

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/get_question_month';

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
                logger.debug(`loaded dataset : ${aiData.questionDataLoad}`);

                //데이터가 존재하는 연도와 월을 확인
                db.query(`SELECT DISTINCT DATE_FORMAT(date, '%Y-%m') AS formatted_date FROM questionData ORDER BY formatted_date DESC;`, (error, results)=>{
                    //데이터베이스 에러 처리
                    if(error){
                        logger.error(`데이터베이스 오류 발생`, error);
                        res.status(500).send(`<h1>데이터베이스 오류</h1>`);
                        return;
                    }

                    //mainFrame에 전달될 파라미터
                    var context = {
                        who : name,
                        body : 'data.ejs',
                        loaded : aiData.questionDataLoad,
                        dataset : results,
                        whatAi : whatAi,
                        url : url
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
                })
            } 

            //fast api 요청 실패 처리
            catch (error) {
                console.error('Fetch 에러:', error);
                res.status(500).send('FastAPI 요청 중 오류가 발생했습니다.');
            }
        }

        //로그인 상태가 아닐 경우 예외 처리
        else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
        }
    },

    intentData : async(req, res)=>{

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //현재 페이지 정보
        var whatAi = '의도 분류 모델 데이터셋'
        var url = 'intentData';

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/get_intent_month';

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
                logger.debug(`loaded dataset : ${aiData.intentDataLoad}`);

                //데이터가 존재하는 연도와 월을 확인
                db.query(`SELECT DISTINCT DATE_FORMAT(date, '%Y-%m') AS formatted_date FROM intentionData ORDER BY formatted_date DESC;`, (error, results)=>{
                    //데이터베이스 에러 처리
                    if(error){
                        logger.error(`데이터베이스 오류 발생`, error);
                        res.status(500).send(`<h1>데이터베이스 오류</h1>`);
                        return;
                    }

                    //mainFrame에 전달될 파라미터
                    var context = {
                        who : name,
                        body : 'data.ejs',
                        loaded : aiData.intentDataLoad,
                        dataset : results,
                        whatAi : whatAi,
                        url : url
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
                })
            } 

            //fast api 요청 실패 처리
            catch (error) {
                console.error('Fetch 에러:', error);
                res.status(500).send('FastAPI 요청 중 오류가 발생했습니다.');
            }
        }

        //로그인 상태가 아닐 경우 예외 처리
        else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
        }
    },

    emotionData : async(req, res)=>{

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //현재 페이지 정보
        var whatAi = '감정 분류 모델 데이터셋'
        var url = 'emotionData';

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/get_emotion_month';

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
                logger.debug(`loaded dataset : ${aiData.emotionDataLoad}`);

                //데이터가 존재하는 연도와 월을 확인
                db.query(`SELECT DISTINCT DATE_FORMAT(date, '%Y-%m') AS formatted_date FROM emotionData ORDER BY formatted_date DESC;`, (error, results)=>{
                    //데이터베이스 에러 처리
                    if(error){
                        logger.error(`데이터베이스 오류 발생`, error);
                        res.status(500).send(`<h1>데이터베이스 오류</h1>`);
                        return;
                    }

                    //mainFrame에 전달될 파라미터
                    var context = {
                        who : name,
                        body : 'data.ejs',
                        loaded : aiData.emotionDataLoad,
                        dataset : results,
                        whatAi : whatAi,
                        url : url
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
                })
            } 

            //fast api 요청 실패 처리
            catch (error) {
                console.error('Fetch 에러:', error);
                res.status(500).send('FastAPI 요청 중 오류가 발생했습니다.');
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