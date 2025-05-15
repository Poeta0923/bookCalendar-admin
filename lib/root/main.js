const bodyParser = require('body-parser');
const auth = require('../util');
const logger = require('../logger');

module.exports = {

    //'/main' 요청 응답
    main : (req, res)=>{

        //로그인 정보 반환 
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //로그인 되어있을 경우에만 접근 허용
        if(login===true){
            
            //ejs 템플릿에 넘겨줄 파라미터 저장
            var context={
                who : name,
            };

            //mainFrame.ejs 화면에 context 내용 추가하여 전송
            req.app.render('main', context, (error, html)=>{

                //화면 구성 실패 에러 처리
                if(error){
                    logger.error(`main 렌더링 오류`, error);
                    res.status(500).send(`<h1>서버 내부 오류 발생</h1>`);
                    return;
                }
                res.end(html);
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