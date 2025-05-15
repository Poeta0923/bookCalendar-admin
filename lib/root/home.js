const bodyParser = require('body-parser');
const auth = require('../util');
const logger = require('../logger');

module.exports = {

    //'/' 요청 응답
    home : (req, res)=>{

        //로그인 정보 반환 
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //로그인 상태일 경우 관리 메인 페이지로 이동
        if(login===true){
            return res.redirect('/admin/main');
        }

        //로그아웃 상태일 경우 로그인 화면 전송
        else{

            //login.ejs 파일 렌더링
            const viewName = 'login.ejs';
            req.app.render(viewName, (error, html)=>{

                //화면 구성 실패 에러 처리
                if(error){
                    logger.error(`${viewName} 렌더링 오류`, error);
                    res.status(500).send(`<h1>서버 내부 오류 발생</h1>`);
                    return;
                }
                res.end(html);
            })
        }
    }
}