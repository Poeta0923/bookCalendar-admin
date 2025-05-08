const bodyParser = require('body-parser');
const db = require('./db');
const auth = require('./util');
const logger = require('./logger');

module.exports = {

    //'/post' 요청 응답
    post : (req, res)=>{

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);

        //로그인 되어있을 경우에만 접근 허용
        if(login===true){
            const monthlyQuery = `
                SELECT
                    DATE_FORMAT(date, '%Y-%m') AS month,
                    COUNT(*) AS count
                FROM
                    post
                WHERE
                    date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
                GROUP BY
                    month
                ORDER BY
                    month;
            `;

            const yearlyQuery = `
                SELECT
                    DATE_FORMAT(date, '%Y') AS year,
                    COUNT(*) AS count
                FROM
                    post
                WHERE
                    date >= DATE_SUB(CURDATE(), INTERVAL 6 YEAR)
                GROUP BY
                    year
                ORDER BY
                    year;
            `;

            const monthlyGrowthQuery = `
                WITH MonthlyCounts AS (
                    SELECT
                        DATE_FORMAT(date, '%Y-%m') AS month,
                        COUNT(*) AS current_count
                    FROM
                        post
                    WHERE
                        date >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
                    GROUP BY
                        month
                    ORDER BY
                        month
                )
                SELECT
                    mc1.month,
                    (mc1.current_count - COALESCE(mc2.current_count, 0)) / COALESCE(mc2.current_count, 1) * 100 AS monthly_growth_rate
                FROM
                    MonthlyCounts mc1
                LEFT JOIN
                    MonthlyCounts mc2 ON DATE_FORMAT(DATE_SUB(STR_TO_DATE(mc1.month, '%Y-%m'), INTERVAL 1 MONTH), '%Y-%m') = mc2.month
                ORDER BY
                    mc1.month;
            `;

            const yearlyGrowthQuery = `
                WITH YearlyCounts AS (
                    SELECT
                        DATE_FORMAT(date, '%Y') AS year,
                        COUNT(*) AS current_count
                    FROM
                        post
                    WHERE
                        date >= DATE_SUB(CURDATE(), INTERVAL 7 YEAR)
                    GROUP BY
                        year
                    ORDER BY
                        year
                )
                SELECT
                    yc1.year,
                    (yc1.current_count - COALESCE(yc2.current_count, 0)) / COALESCE(yc2.current_count, 1) * 100 AS yearly_growth_rate
                FROM
                    YearlyCounts yc1
                LEFT JOIN
                    YearlyCounts yc2 ON DATE_FORMAT(DATE_SUB(STR_TO_DATE(yc1.year, '%Y'), INTERVAL 1 YEAR), '%Y') = yc2.year
                ORDER BY
                    yc1.year;
            `;

            Promise.all([
                new Promise((resolve, reject) => {
                    db.query(monthlyQuery, (err, results) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        results.sort((a, b) => new Date(a.month + '-01') - new Date(b.month + '-01'));
                        resolve(results);
                    });
                }),
                new Promise((resolve, reject) => {
                    db.query(yearlyQuery, (err, results) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        results.sort((a, b) => a.year - b.year);
                        resolve(results);
                    });
                }),
                new Promise((resolve, reject) => {
                    db.query(monthlyGrowthQuery, (err, results) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        results.sort((a, b) => new Date(a.month + '-01') - new Date(b.month + '-01'));
                        resolve(results);
                    });
                }),
                new Promise((resolve, reject) => {
                    db.query(yearlyGrowthQuery, (err, results) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        results.sort((a, b) => a.year - b.year);
                        resolve(results);
                    });
                })
            ])
            .then(([monthlyData, yearlyData, monthlyGrowthData, yearlyGrowthData]) => {
                var context = {
                    who: name,
                    body: "statistics.ejs",
                    kind: `게시물 수`,
                    monthlyData: monthlyData,
                    yearlyData: yearlyData,
                    monthlyGrowthData: monthlyGrowthData,
                    yearlyGrowthData: yearlyGrowthData
                };

                req.app.render('mainFrame', context, (error, html) => {
                    if (error) {
                        logger.error(`mainFrame 렌더링 오류`, error);
                        res.status(500).send(`<h1>서버 내부 오류 발생</h1>`);
                        return;
                    }
                    res.end(html);
                });
            })
            .catch(error => {
                console.error('데이터를 가져오는 중 오류 발생:', error);
                res.status(500).send('데이터를 가져오는 데 실패했습니다.');
            });
        }

        //로그인 상태가 아닐 경우 예외 처리
        else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
        }
    },

    //'/comment' 요청 응답
    comment : (req, res)=>{

        //로그인 정보 반환
        var { login, name } = auth.authIsOwner(req, res);
        logger.debug(`login : ${login} name : ${name}`);
    
        //로그인 되어있을 경우에만 접근 허용
        if(login===true){
            const monthlyQuery = `
                SELECT
                    DATE_FORMAT(date, '%Y-%m') AS month,
                    COUNT(*) AS count
                FROM
                    comment
                WHERE
                    date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
                GROUP BY
                    month
                ORDER BY
                    month;
            `;
    
            const yearlyQuery = `
                SELECT
                    DATE_FORMAT(date, '%Y') AS year,
                    COUNT(*) AS count
                FROM
                    comment
                WHERE
                    date >= DATE_SUB(CURDATE(), INTERVAL 6 YEAR)
                GROUP BY
                    year
                ORDER BY
                    year;
            `;
    
            const monthlyGrowthQuery = `
                WITH MonthlyCounts AS (
                    SELECT
                        DATE_FORMAT(date, '%Y-%m') AS month,
                        COUNT(*) AS current_count
                    FROM
                        comment
                    WHERE
                        date >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
                    GROUP BY
                        month
                    ORDER BY
                        month
                )
                SELECT
                    mc1.month,
                    (mc1.current_count - COALESCE(mc2.current_count, 0)) / COALESCE(mc2.current_count, 1) * 100 AS monthly_growth_rate
                FROM
                    MonthlyCounts mc1
                LEFT JOIN
                    MonthlyCounts mc2 ON DATE_FORMAT(DATE_SUB(STR_TO_DATE(mc1.month, '%Y-%m'), INTERVAL 1 MONTH), '%Y-%m') = mc2.month
                ORDER BY
                    mc1.month;
            `;
    
            const yearlyGrowthQuery = `
                WITH YearlyCounts AS (
                    SELECT
                        DATE_FORMAT(date, '%Y') AS year,
                        COUNT(*) AS current_count
                    FROM
                        comment
                    WHERE
                        date >= DATE_SUB(CURDATE(), INTERVAL 7 YEAR)
                    GROUP BY
                        year
                    ORDER BY
                        year
                )
                SELECT
                    yc1.year,
                    (yc1.current_count - COALESCE(yc2.current_count, 0)) / COALESCE(yc2.current_count, 1) * 100 AS yearly_growth_rate
                FROM
                    YearlyCounts yc1
                LEFT JOIN
                    YearlyCounts yc2 ON DATE_FORMAT(DATE_SUB(STR_TO_DATE(yc1.year, '%Y'), INTERVAL 1 YEAR), '%Y') = yc2.year
                ORDER BY
                    yc1.year;
            `;
    
            Promise.all([
                new Promise((resolve, reject) => {
                    db.query(monthlyQuery, (err, results) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        results.sort((a, b) => new Date(a.month + '-01') - new Date(b.month + '-01'));
                        resolve(results);
                    });
                }),
                new Promise((resolve, reject) => {
                    db.query(yearlyQuery, (err, results) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        results.sort((a, b) => a.year - b.year);
                        resolve(results);
                    });
                }),
                new Promise((resolve, reject) => {
                    db.query(monthlyGrowthQuery, (err, results) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        results.sort((a, b) => new Date(a.month + '-01') - new Date(b.month + '-01'));
                        resolve(results);
                    });
                }),
                new Promise((resolve, reject) => {
                    db.query(yearlyGrowthQuery, (err, results) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        results.sort((a, b) => a.year - b.year);
                        resolve(results);
                    });
                })
            ])
            .then(([monthlyData, yearlyData, monthlyGrowthData, yearlyGrowthData]) => {
                var context = {
                    who: name,
                    body: "statistics.ejs",
                    kind: `댓글 수`,
                    monthlyData: monthlyData,
                    yearlyData: yearlyData,
                    monthlyGrowthData: monthlyGrowthData,
                    yearlyGrowthData: yearlyGrowthData
                };
                req.app.render('mainFrame', context, (error, html) => {
                    if (error) {
                        logger.error(`mainFrame 렌더링 오류`, error);
                        res.status(500).send(`<h1>서버 내부 오류 발생</h1>`);
                        return;
                    }
                    res.end(html);
                });
            })
            .catch(error => {
                console.error('데이터를 가져오는 중 오류 발생:', error);
                res.status(500).send('데이터를 가져오는 데 실패했습니다.');
            });
        }

        //로그인 상태가 아닐 경우 예외 처리
        else {
            logger.warn(`인증 없는 접속 시도`);
            res.status(401).send(`<h1>인증 필요</h1>`);
            return;
        }
    }
};