const bodyParser = require('body-parser');
const db = require('../db');
const auth = require('../util');
const logger = require('../logger');

module.exports = {
    
    //'/reportedComment/delete/:commentId' 요청 응답
    delete : (req, res)=>{

        //로그인 정보 반환 
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //comment.ejs 파일에서 전달된 파라미터인 commentId를 저장
        var commentId = req.params.commentId;

        //로그인 되어있을 경우에만 삭제 허용
        if (login==true){
            //commentId가 동일한 컬럼을 DB에서 삭제
            db.query(`DELETE FROM comment WHERE commentId = ?`,
                [commentId], (error, result)=>{

                    //데이터베이스 에러 처리
                    if(error){
                        logger.error(`데이터베이스 오류 발생`, error);
                        res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                        return;
                    }

                    //삭제 후 다시 회원 관리 화면으로 연결
                    logger.debug(`commentId : ${commentId} 댓글 삭제`);
                    res.redirect('/admin/reportedComment/1');
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