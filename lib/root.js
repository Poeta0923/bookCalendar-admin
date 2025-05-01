const bodyParser = require('body-parser');
const db = require('./db');
const auth = require('./util');
const logger = require('./logger');
var sanitizeHtml = require('sanitize-html');
const bcrypt = require('bcrypt');

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
    },

    //'/login' 요청 응답
    login: (req, res) => {
        const post = req.body;
        const sntzedNickName = sanitizeHtml(post.nickName);
        const sntzedPassword = sanitizeHtml(post.password); // 사용자가 입력한 평문 비밀번호
        logger.debug(`${post.nickName} 로그인 시도`);
    
        db.query(
            `SELECT password, nickName FROM member WHERE nickName = ? AND role = 'administrator'`,
            [sntzedNickName],
            (error, results) => {
                if (error) {
                    logger.error('데이터베이스 오류 발생', error);
                    res.status(1003).send('<h1>데이터베이스 오류</h1>');
                    return;
                }
    
                if (results.length === 1) {
                    const hashedPasswordFromDB = results[0].password;
    
                    // 입력된 비밀번호와 데이터베이스의 해시 값 비교
                    bcrypt.compare(sntzedPassword, hashedPasswordFromDB, (err, isMatch) => {
                        if (err) {
                            logger.error('비밀번호 비교 오류', err);
                            res.status(500).send('<h1>비밀번호 비교 오류 발생</h1>');
                            return;
                        }
    
                        if (isMatch) {
                            // 비밀번호가 일치하면 세션에 사용자 정보 저장
                            req.session.is_logined = true;
                            req.session.name = results[0].nickName;
                            logger.debug(`로그인 성공. 로그인 여부 : ${req.session.is_logined} 로그인 정보 : ${req.session.name}`);
                            res.redirect('/admin');
                        } else {
                            // 비밀번호가 일치하지 않으면 로그인 실패 처리
                            logger.debug(`로그인 실패. 비밀번호 불일치. 시도 nickName : ${post.nickName}`);
                            req.session.is_logined = false;
                            req.session.name = 'Guest';
                            res.redirect('/');
                        }
                    });
                } else {
                    // 해당 닉네임의 관리자 계정이 없거나 여러 개일 경우
                    logger.debug(`로그인 실패. 해당 닉네임의 관리자 계정 없음 또는 중복. 시도 nickName : ${post.nickName}`);
                    req.session.is_logined = false;
                    req.session.name = 'Guest';
                    res.redirect('/');
                }
            }
        );
    },

    //'/logout' 요청 응답
    logout : (req, res)=>{

        //로그인 세션 삭제
        req.session.destroy((error)=>{

            //로그아웃 실패 에러 처리
            if(error){
                logger.error(`로그아웃 실패`, error);
                res.redirect('/');
            }

            //세션 삭제 후 로그인 전 메인화면으로 이동
            res.redirect('/');
        })
    },

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
    },

    alter : (req, res)=>{

        //로그인 정보 반환 
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //로그인 되어있을 경우에만 접근 허용
        if(login===true){
            //ejs 템플릿에 넘겨줄 파라미터 저장
            var context={
                who : name,
                body: "alter.ejs"
            };

            //mainFrame.ejs 화면에 context 내용 추가하여 전송
            req.app.render('mainFrame', context, (error, html)=>{

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
    },

    alter_process : (req, res)=>{

        //로그인 정보 반환 
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //새로운 비밀번호와 기존 비밀번호 저장
        const post = req.body;
        const sntzedPassword = sanitizeHtml(post.password);
        const sntzedNewPassword = sanitizeHtml(post.newPassword);

        //로그인 되어있을 경우에만 접근 허용
        if(login===true){

            db.query(
                `SELECT password, nickName FROM member WHERE nickName = ? AND role = 'administrator'`,
                [name],
                (error, results) => {
                    if (error) {
                        logger.error('데이터베이스 오류 발생', error);
                        res.status(1003).send('<h1>데이터베이스 오류</h1>');
                        return;
                    }
        
                    if (results.length === 1) {
                        const hashedPasswordFromDB = results[0].password;
        
                        // 입력된 비밀번호와 데이터베이스의 해시 값 비교
                        bcrypt.compare(sntzedPassword, hashedPasswordFromDB, (err, isMatch) => {
                            if (err) {
                                logger.error('비밀번호 비교 오류', err);
                                res.status(500).send('<h1>비밀번호 비교 오류 발생</h1>');
                                return;
                            }
        
                            if (isMatch) {

                                //비밀번호 일치할 경우 새로운 비밀번호 해시화
                                const newHashPassword = bcrypt.hash(sntzedNewPassword, 10);

                                // 비밀번호가 일치하면 비밀번호 변경
                                db.query(`UPDATE member SET password = ? WHERE nickName = ?`,
                                    [newHashPassword, name], (error, result)=>{

                                        //db 에러 처리
                                        if(error){
                                            logger.error(`데이터베이스 오류`, error);
                                            return res.status(500).send(`<h1>데이터베이스 오류</h1>`);
                                        }

                                        logger.debug(`비밀번호 변경 성공 : ${sntzedNewPassword}`);
                                        res.redirect('/admin/alter');
                                    }
                                )

                            } else {
                                // 비밀번호가 일치하지 않으면 비밀번호 변경 실패 처리
                                logger.debug(`로그인 실패. 비밀번호 불일치. 시도 nickName : ${post.nickName}`);
                                res.send(`<h1>비밀번호 불일치</h1>`);
                            }
                        });
                    } else {
                        // 해당 닉네임의 관리자 계정이 없거나 여러 개일 경우
                        logger.debug(`로그인 실패. 해당 닉네임의 관리자 계정 없음 또는 중복. 시도 nickName : ${post.nickName}`);
                        req.session.is_logined = false;
                        req.session.name = 'Guest';
                        res.redirect('/');
                    }
                }
            );

        }

        //로그인 상태가 아닐 경우 예외 처리
        else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
        }
    }
}