const bodyParser = require('body-parser');
const auth = require('./util');
const logger = require('./logger');

module.exports = {
    view : (req, res)=>{

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);
        

        if(login===true){

            //fast api에 정보 요청

            var context = {
                who : name,
                body : "ai.ejs"
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
        }
    }
}