var mysql = require('mysql');
//db 연결. 서버에 업로드 시 내용 변경 예정
var db = mysql.createConnection({
    host : 'localhost',
    port: 3307,
    user : 'bookcalendar',
    password : 'bookcalendar123',
    database : 'bookcalendar',
    multipleStatements : true
});

//db 연결
db.connect();
module.exports = db;