const bodyParser = require('body-parser');
const db = require('../db');
const auth = require('../util');
const logger = require('../logger');

module.exports = {
    
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

                logger.debug(`${aiData}`);

                //db에 json 파일로 전달받은 감정 분류 모델이 저장되어있는지 확인
                db.query(`SELECT * FROM emotionAi WHERE modelName = ?`,
                    [aiData.emotionModel], (error1, result1)=>{

                        logger.debug(`${aiData.emotionModel}`);

                        //db 오류 처리
                        if(error1){
                            logger.error(`데이터베이스 오류`, error);
                            return res.status(500).send(`<h1>데이터베이스 오류</h1>`)
                        }

                        //해당 모델이 저장되어있을 경우
                        if(result1.length===1){
                            
                            //db에 성능지표 업데이트
                            db.query(`UPDATE emotionAi SET f1 = ? WHERE modelName = ?`,
                                [aiData.emotionScore, aiData.emotionModel], (error2, result2)=>{

                                    logger.debug(`${aiData.emotionScore}`);

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

                        logger.debug(`${aiData.intentModel}`);

                        //db 오류 처리
                        if(error1){
                            logger.error(`데이터베이스 오류`, error);
                            return res.status(500).send(`<h1>데이터베이스 오류</h1>`)
                        }

                        //해당 모델이 저장되어있을 경우
                        if(result1.length===1){
                            
                            //db에 성능지표 업데이트
                            db.query(`UPDATE intentionAi SET accuracy = ? WHERE modelName = ?`,
                                [aiData.intentScore, aiData.intentModel], (error2, result2)=>{

                                    logger.debug(`${aiData.intentScore}`);

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

                        logger.debug(`${aiData.questionModel}`);

                        //db 오류 처리
                        if(error1){
                            logger.error(`데이터베이스 오류`, error);
                            return res.status(500).send(`<h1>데이터베이스 오류</h1>`)
                        }

                        //해당 모델이 저장되어있을 경우
                        if(result1.length===1){
                            
                            //db에 성능지표 업데이트
                            db.query(`UPDATE questionAi SET rouge = ? WHERE modelName = ?`,
                                [aiData.questionScore, aiData.questionModel], (error2, result2)=>{

                                    logger.debug(`${aiData.questionScore}`);

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

        //로그인 상태가 아닐 경우 예외 처리
        else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
        }
    }
}