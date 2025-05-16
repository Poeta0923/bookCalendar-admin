const bodyParser = require('body-parser');
const db = require('../db');
const auth = require('../util');
const logger = require('../logger');

module.exports = {

    questionData : (req, res)=>{

        //로그인 정보 반환 
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //post.ejs 파일에서 전달된 파라미터인 currentPage를 저장
        var selected = req.params.selected;

        //post.ejs 파일에서 전달된 파라미터인 currentPage를 저장
        var currentPage = req.params.currentPage;

        //dataId를 저장
        var dataId = req.params.dataId;

        if(login===true){

            db.query(`DELETE FROM questionData WHERE dataId = ?`, [dataId], (error, result)=>{

                //데이터베이스 에러 처리
                if(error){
                    logger.error(`데이터베이스 오류 발생`, error);
                    res.status(500).send(`<h1>데이터베이스 오류</h1>`);
                    return;
                }
                logger.debug(`dataId : ${dataId} 데이터 삭제`);

                res.redirect(`/admin/questionData/${selected}/${currentPage}`);
                res.end();
            })
        }
    },

    intentData : (req, res)=>{

        //로그인 정보 반환 
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //post.ejs 파일에서 전달된 파라미터인 currentPage를 저장
        var selected = req.params.selected;

        //post.ejs 파일에서 전달된 파라미터인 currentPage를 저장
        var currentPage = req.params.currentPage;

        //dataId를 저장
        var dataId = req.params.dataId;

        if(login===true){

            db.query(`DELETE FROM intentionData WHERE dataId = ?`, [dataId], (error, result)=>{

                //데이터베이스 에러 처리
                if(error){
                    logger.error(`데이터베이스 오류 발생`, error);
                    res.status(500).send(`<h1>데이터베이스 오류</h1>`);
                    return;
                }
                logger.debug(`dataId : ${dataId} 데이터 삭제`);

                res.redirect(`/admin/intentData/${selected}/${currentPage}`);
                res.end();
            })
        }
    },

    emotionData : (req, res)=>{

        //로그인 정보 반환 
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //post.ejs 파일에서 전달된 파라미터인 currentPage를 저장
        var selected = req.params.selected;

        //post.ejs 파일에서 전달된 파라미터인 currentPage를 저장
        var currentPage = req.params.currentPage;

        //dataId를 저장
        var dataId = req.params.dataId;

        if(login===true){

            db.query(`DELETE FROM emotionData WHERE dataId = ?`, [dataId], (error, result)=>{

                //데이터베이스 에러 처리
                if(error){
                    logger.error(`데이터베이스 오류 발생`, error);
                    res.status(500).send(`<h1>데이터베이스 오류</h1>`);
                    return;
                }
                logger.debug(`dataId : ${dataId} 데이터 삭제`);

                res.redirect(`/admin/emotionData/${selected}/${currentPage}`);
                res.end();
            })
        }
    }
}