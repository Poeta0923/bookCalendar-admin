const express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
const logger = require('./lib/logger');

//세션 저장소 관련 설정
var MySqlStore = require('express-mysql-session')(session);
var options = {
    host : 'localhost',
    port: 3307,
    user : 'bookcalendar',
    password : 'bookcalendar123',
    database : 'bookcalendar'
};

var sessionStore = new MySqlStore(options)

//세션 관련 설정. 세션 비밀 키는 깃허브 repository가 public이라 미끼입
const app = express();
app.use(session({
    secret : 'not decided yet',
    resave : false,
    saveUninitialized : false,
    store : sessionStore
}));

//ejs 파일들 관련 설정
app.set('views',__dirname+'/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));

const rootRouter = require('./router/rootRouter');
var memberRouter = require('./router/memberRouter');
var postRouter = require('./router/postRouter');
var reportedPostRouter = require('./router/reportedPostRouter');
var reportedCommentRouter = require('./router/reportedCommentRouter');
var aiRouter = require('./router/aiRouter');
var statisticsRouter = require('./router/statisticsRouter');

//정적 파일들이 위치한 폴더 지정
app.use(express.static('public'));

app.use('/admin', rootRouter);
app.use('/admin/member', memberRouter);
app.use('/admin/post', postRouter);
app.use('/admin/reportedPost', reportedPostRouter);
app.use('/admin/reportedComment', reportedCommentRouter);
app.use('/admin/ai', aiRouter);
app.use('/admin/statistics', statisticsRouter);

//favicon 파일이 없기 때문에 브라우저가 요청 시 에러 처리.
app.get('/favicon.ico', (req, res)=>res.writeHead(404));

//포트 번호는 nginx 정적 파일 전송을 위해 내부 포트 사용. callback 함수는 개발 이후에도 로깅과 디버깅을 위해 남겨둘 예정
app.listen(3005, '0.0.0.0', ()=>{
    logger.info(`Server listening on port 60001`);
    console.log('Example app listening on port 60001');
});
