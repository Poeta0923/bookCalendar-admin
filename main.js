const express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
const logger = require('./lib/logger');

//세션 저장소 관련 설정. mariadb npm 패키지는 정상 작동하지 않는 경우가 많아 express-mysql-session 사용
//추후 서버에서 테스트 시 정보 변경 예정
var MySqlStore = require('express-mysql-session')(session);
var options = {
    host : 'localhost',
    user : 'nodejs',
    password : 'nodejs',
    database : 'bookCalander'
};

var sessionStore = new MySqlStore(options)

//세션 관련 설정. 세션 비밀 키는 깃허브 repository가 public이라 미기입
const app = express();
app.use(session({
    secret : 'not decided yet',
    resave : false,
    saveUninitialized : false,
    store : sessionStore
}));

//ejs 파일들 관련 설정 (아래의 주석처리는 개발할 때 빼오기)
app.set('views',__dirname+'/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));

const rootRouter = require('./router/rootRouter');
var memberRouter = require('./router/memberRouter');
var postRouter = require('./router/postRouter');
var reportedPostRouter = require('./router/reportedPostRouter');
var reportedCommentRouter = require('./router/reportedCommentRouter');
var aiRouter = require('./router/aiRouter');
/*var satisticsRouter = require('./router/satisticsRouter'); */

//정적 파일들이 위치한 폴더 지정
app.use(express.static('public'));

app.use('/admin', rootRouter);
app.use('/admin/member', memberRouter);
app.use('/admin/post', postRouter);
app.use('/admin/reportedPost', reportedPostRouter);
app.use('/admin/reportedComment', reportedCommentRouter);
app.use('/admin/ai', aiRouter);
/*app.use('/admin/satistics', satisticsRouter);*/

//favicon 파일이 없기 때문에 브라우저가 요청 시 에러 처리.
app.get('/favicon.ico', (req, res)=>res.writeHead(404));

//포트 번호는 수정 예정. callback 함수는 개발 이후에도 로깅과 디버깅을 위해 남겨둘 예정
app.listen(3005, '0.0.0.0', ()=>{
    logger.info(`Server listening on port 60001`);
    console.log('Example app listening on port 60001');
});