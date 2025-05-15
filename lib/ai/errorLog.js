const bodyParser = require('body-parser');
const auth = require('../util');
const logger = require('../logger');

module.exports = {

    errorLog : async(req, res) =>{

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //fast api url
        const fastapiUrl = 'http://192.9.202.17:3004/errorRequest';

        //로그인 되어있을 경우에만 접근 허용
        if(login===true) {

            try{
                //fast api의 응답을 저장
                const response = await fetch(fastapiUrl);

                //응답을 받지 못했을 경우 예외처리
                if(!response.ok){
                    logger.error(`fast api 요청 수신 실패 ${response.status}`);
                    return res.status(500).send(`<h1>FastAPI 요청 실패</h1>`);
                }

                //요청을 받았을 경우 json 파일 내용 저장
                const aiData = await response.json();

                //mainFrame에 전달될 파라미터
                var context = {
                    who : name,
                    body : 'errorLog.js',
                    log : aiData.errorLog
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

            catch (error) {
                console.error('Fetch 에러:', error);
                res.status(500).send('FastAPI 요청 중 오류가 발생했습니다.');
            }
        }
    }
}