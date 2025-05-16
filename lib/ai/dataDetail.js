const bodyParser = require('body-parser');
const db = require('../db');
const auth = require('../util');
const logger = require('../logger');

module.exports = {

    questionData : (req, res)=>{

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //현재 페이지 저장
        var currentPage = req.params.currentPage;
        logger.debug(`접속 페이지 : ${currentPage}`);

        //현재 데이터셋 저장
        var selected = req.params.selected;
        logger.debug(`현재 데이터셋 : ${selected}`);

        //현재 상세 데이터 저장
        var dataId = req.params.dataId;
        logger.debug(`현재 데이터 : ${dataId}`);
        
        //현재 페이지 정보
        var whatAi = '질문 생성 모델 데이터셋';
        var url = 'questionData';

        var dataDetail = true;

        if(login===true){

            db.query(`SELECT * FROM questionData WHERE DATE_FORMAT(date, '%Y-%m') = ?`, [selected], (error, results)=>{

                //데이터베이스 에러 처리
                if(error){
                    logger.error(`데이터베이스 오류 발생`, error);
                    res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                    return;
                }

                db.query(`SELECT * FROM questionData WHERE dataId = ?`, [dataId], (error, result2)=>{

                    //데이터베이스 에러 처리
                    if(error){
                        logger.error(`데이터베이스 오류 발생`, error);
                        res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                        return;
                    }

                    //페이징 기능을 위한 페이지 수와 표시할 칼럼 수 계산
                    logger.debug(`전체 데이터 수 : ${results.length}`);
                    var pageNum = Math.ceil(results.length / 10);
                    if (results.length - ((currentPage - 1) * 10) >= 10){
                        columns = 10;
                    } else {
                        columns = results.length % 10;
                    }
                    logger.debug(`총 페이지 수 : ${pageNum} 출력 데이터 수 : ${columns}`);

                    var context = {
                        who : name,
                        body : 'datasetDetail.ejs',
                        datasets : results,
                        currentPage : currentPage,
                        pageNum : pageNum,
                        columns : columns,
                        whatAi : whatAi,
                        url : url,
                        dataDetail : dataDetail,
                        data : result2,
                        selected : selected
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
                })
            })
        }

        //로그인 상태가 아닐 경우 예외 처리
        else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
        }
    },

    intentData : (req, res)=>{

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //현재 페이지 저장
        var currentPage = req.params.currentPage;
        logger.debug(`접속 페이지 : ${currentPage}`);

        //현재 데이터셋 저장
        var selected = req.params.selected;
        logger.debug(`현재 데이터셋 : ${selected}`);

        //현재 상세 데이터 저장
        var dataId = req.params.dataId;
        logger.debug(`현재 데이터 : ${dataId}`);
        
        //현재 페이지 정보
        var whatAi = '질문 생성 모델 데이터셋';
        var url = 'intentData';

        var dataDetail = true;

        if(login===true){

            db.query(`SELECT * FROM intentionData WHERE DATE_FORMAT(date, '%Y-%m') = ?`, [selected], (error, results)=>{

                //데이터베이스 에러 처리
                if(error){
                    logger.error(`데이터베이스 오류 발생`, error);
                    res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                    return;
                }

                db.query(`SELECT * FROM intentionData WHERE dataId = ?`, [dataId], (error, result2)=>{

                    //데이터베이스 에러 처리
                    if(error){
                        logger.error(`데이터베이스 오류 발생`, error);
                        res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                        return;
                    }

                    //페이징 기능을 위한 페이지 수와 표시할 칼럼 수 계산
                    logger.debug(`전체 데이터 수 : ${results.length}`);
                    var pageNum = Math.ceil(results.length / 10);
                    if (results.length - ((currentPage - 1) * 10) >= 10){
                        columns = 10;
                    } else {
                        columns = results.length % 10;
                    }
                    logger.debug(`총 페이지 수 : ${pageNum} 출력 데이터 수 : ${columns}`);

                    var context = {
                        who : name,
                        body : 'datasetDetail.ejs',
                        datasets : results,
                        currentPage : currentPage,
                        pageNum : pageNum,
                        columns : columns,
                        whatAi : whatAi,
                        url : url,
                        dataDetail : dataDetail,
                        data : result2,
                        selected : selected
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
                })
            })
        }

        //로그인 상태가 아닐 경우 예외 처리
        else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
        }
    },

    emotionData : (req, res)=>{

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //현재 페이지 저장
        var currentPage = req.params.currentPage;
        logger.debug(`접속 페이지 : ${currentPage}`);

        //현재 데이터셋 저장
        var selected = req.params.selected;
        logger.debug(`현재 데이터셋 : ${selected}`);

        //현재 상세 데이터 저장
        var dataId = req.params.dataId;
        logger.debug(`현재 데이터 : ${dataId}`);
        
        //현재 페이지 정보
        var whatAi = '질문 생성 모델 데이터셋';
        var url = 'emotionData';

        var dataDetail = true;

        if(login===true){

            db.query(`SELECT * FROM emotionData WHERE DATE_FORMAT(date, '%Y-%m') = ?`, [selected], (error, results)=>{

                //데이터베이스 에러 처리
                if(error){
                    logger.error(`데이터베이스 오류 발생`, error);
                    res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                    return;
                }

                db.query(`SELECT * FROM emotionData WHERE dataId = ?`, [dataId], (error, result2)=>{

                    //데이터베이스 에러 처리
                    if(error){
                        logger.error(`데이터베이스 오류 발생`, error);
                        res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                        return;
                    }

                    //페이징 기능을 위한 페이지 수와 표시할 칼럼 수 계산
                    logger.debug(`전체 데이터 수 : ${results.length}`);
                    var pageNum = Math.ceil(results.length / 10);
                    if (results.length - ((currentPage - 1) * 10) >= 10){
                        columns = 10;
                    } else {
                        columns = results.length % 10;
                    }
                    logger.debug(`총 페이지 수 : ${pageNum} 출력 데이터 수 : ${columns}`);

                    var context = {
                        who : name,
                        body : 'datasetDetail.ejs',
                        datasets : results,
                        currentPage : currentPage,
                        pageNum : pageNum,
                        columns : columns,
                        whatAi : whatAi,
                        url : url,
                        dataDetail : dataDetail,
                        data : result2,
                        selected : selected
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
                })
            })
        }

        //로그인 상태가 아닐 경우 예외 처리
        else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
        }
    }
}