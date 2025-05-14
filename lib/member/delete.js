const bodyParser = require('body-parser');
const db = require('../db');
const auth = require('../util');
const logger = require('../logger');

module.exports = {

    //'/admin/member/delete/:memberId' 요청 응답
    delete : (req, res)=>{

        //로그인 정보 반환 
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //member.ejs 파일에서 전달된 파라미터인 memberId를 저장
        var memberId = req.params.memberId;

        //로그인 되어있을 경우에만 삭제 허용
        if (login==true){
            //memberId가 동일한 컬럼을 DB에서 삭제
            db.query(`DELETE FROM member WHERE memberId = ?`,
                [memberId], (error, result)=>{

                    //데이터베이스 에러 처리
                    if(error){
                        logger.error(`데이터베이스 오류 발생`, error);
                        res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                        return;
                    }

                    //삭제 후 다시 회원 관리 화면으로 연결
                    res.redirect('/admin/member/1');
                    res.end();
                }
            )
        } else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
        }
    }
}