const bodyParser = require('body-parser');
const db = require('../db');
const auth = require('../util');
const logger = require('../logger');
var sanitizeHtml = require('sanitize-html');

module.exports = {

    //'/reportedPost/:currentPage/:postId/deletePost 요청 응답
    deletePost : (req, res)=>{

        //로그인 정보 반환 
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //post.ejs 파일에서 전달된 파라미터인 currentPage를 저장
        var currentPage = req.params.currentPage;

        //post.ejs 파일에서 전달된 파라미터인 postId를 저장
        var postId = req.params.postId;

        //로그인 되어있을 경우에만 삭제 허용
        if(login===true){

            //postId가 동일한 comment들을 컬럼을 DB에서 삭제
            db.query(`DELETE FROM comment WHERE postId = ?`,
                [postId], (error, result)=>{

                    //데이터베이스 에러 처리
                    if(error){
                        logger.error(`데이터베이스 오류 발생`, error);
                        res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                        return;
                    }
                    logger.debug(`postId : ${postId} 댓글 삭제`);

                    //comment들 삭제 후 post 삭제
                    db.query(`DELETE FROM post WHERE postId = ?`,
                        [postId], (error, results)=>{

                            //데이터베이스 에러 처리
                            if(error){
                                logger.error(`데이터베이스 오류 발생`, error);
                                res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                                return;
                            }
                            logger.debug(`postId : ${postId} 게시물 삭제`);
                            res.redirect(`/admin/reportedPost/${currentPage}`);
                            res.end();
                        }
                    )
                }
            )
        }
    },

    //'/reportedPost/search/:currentPage/:postId/deletePost 요청 응답
    deleteSearchPost : (req, res)=>{

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);
    
        //post 방식으로 전달된 검색어를 페이지 선택 시 사용하기 위해 변수에 저장
        var post = req.body;
        var searchTerm = post.searchTerm;
        logger.debug(`검색어 : ${searchTerm}`);
    
        //post.ejs 파일에서 전달된 파라미터인 currentPage를 저장
        var currentPage = req.params.currentPage;
    
        //post.ejs 파일에서 전달된 파라미터인 postId를 저장
        var postId = req.params.postId;
    
        //로그인 되어있을 경우에만 삭제 허용
        if(login===true){
    
            //postId가 동일한 comment들을 컬럼을 DB에서 삭제
            db.query(`DELETE FROM comment WHERE postId = ?`,
                [postId], (error, result)=>{
    
                    //데이터베이스 에러 처리
                    if(error){
                        logger.error(`데이터베이스 오류 발생`, error);
                        res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                        return;
                    }
                    logger.debug(`postId : ${postId} 댓글 삭제`);
    
                    //comment들 삭제 후 post 삭제
                    db.query(`DELETE FROM post WHERE postId = ?`,
                        [postId], (error, results)=>{
    
                            //데이터베이스 에러 처리
                            if(error){
                                logger.error(`데이터베이스 오류 발생`, error);
                                res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                                return;
                            }
                            logger.debug(`postId : ${postId} 게시물 삭제`);
    
                            // 클라이언트에게 POST 요청을 보내는 JavaScript 코드 응답
                            res.send(`
                                <form id="redirectForm" action="/admin/reportedPost/search/${currentPage}" method="post">
                                    <input type="hidden" name="searchTerm" value="${searchTerm}">
                                </form>
                                <script>
                                    document.getElementById('redirectForm').submit();
                                </script>
                            `);
                            res.end();
                        }
                    )
                }
            )
        }
    },

    //'/reportedPost/:currentPage/:postId/:commentId/deleteComment' 요청 응답
    deleteComment : (req, res)=>{

        //로그인 정보 반환 
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //post.ejs 파일에서 전달된 파라미터인 currentPage를 저장
        var currentPage = req.params.currentPage;

        //post.ejs 파일에서 전달된 파라미터인 postId를 저장
        var postId = req.params.postId;

        //post.ejs 파일에서 전달된 파라미터인 commentId를 저장
        var commentId = req.params.commentId;

        //로그인 되어있을 경우에만 삭제 허용
        if(login===true){

            //postId가 동일한 comment들을 컬럼을 DB에서 삭제
            db.query(`DELETE FROM comment WHERE commentId = ?`,
                [commentId], (error, result)=>{

                    //데이터베이스 에러 처리
                    if(error){
                        logger.error(`데이터베이스 오류 발생`, error);
                        res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                        return;
                    }
                    logger.debug(`commentId : ${commentId} 댓글 삭제`);
                    res.redirect(`/admin/reportedPost/${currentPage}/${postId}`);
                    res.end();
                }
            )
        }
    },

    //'/reportedPost/search/:currentPage/:postId/:commentId/deleteComment' 요청 응답
    deleteSearchComment : (req, res)=>{

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);
    
        //post 방식으로 전달된 검색어를 페이지 선택 시 사용하기 위해 변수에 저장
        var post = req.body;
        var searchTerm = post.searchTerm;
        logger.debug(`검색어 : ${searchTerm}`);
    
        //post.ejs 파일에서 전달된 파라미터인 currentPage를 저장
        var currentPage = req.params.currentPage;
    
        //post.ejs 파일에서 전달된 파라미터인 postId를 저장
        var postId = req.params.postId;

        //post.ejs 파일에서 전달된 파라미터인 commentId를 저장
        var commentId = req.params.commentId;

        //로그인 되어있을 경우에만 삭제 허용
        if(login===true){

            //postId가 동일한 comment들을 컬럼을 DB에서 삭제
            db.query(`DELETE FROM comment WHERE commentId = ?`,
                [commentId], (error, result)=>{

                    //데이터베이스 에러 처리
                    if(error){
                        logger.error(`데이터베이스 오류 발생`, error);
                        res.status(1003).send(`<h1>데이터베이스 오류</h1>`);
                        return;
                    }
                    logger.debug(`commentId : ${commentId} 댓글 삭제`);

                    // 클라이언트에게 POST 요청을 보내는 JavaScript 코드 응답
                    res.send(`
                        <form id="redirectForm" action="/admin/reportedPost/search/${currentPage}/${postId}" method="post">
                            <input type="hidden" name="searchTerm" value="${searchTerm}">
                        </form>
                        <script>
                            document.getElementById('redirectForm').submit();
                        </script>
                    `);
                    res.end();
                }
            )
        }
    }
}