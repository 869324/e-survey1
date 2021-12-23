const express = require('express');
const app = express();
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require("crypto");

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1886',
    database: 'shangri_la_db'
});

app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const type = req.body.type;

    const hash = crypto.createHash('sha256').update(password).digest('base64');

    const quey1 = 'select * from users where email = ? and password = ?';
    const query2 = 'select * from admin where username = ? and password = ?';
    const fetch = type == "resident" ? quey1 : query2;

    db.query(fetch, [email, hash], (err, result) => {
        if (result.length > 0) {
            const username = type == "resident" ? result[0].name : result[0].username;
            const userId = result[0].user_id;
            res.send({
                status: true,
                username: username,
                userId: userId
            });
        }
        else {
            res.send({ status: false })
        }
    });

});

app.post("/signup", (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const dob = req.body.dob;
    const address = req.body.address;
    const sni = req.body.sni;
    const password = req.body.password;

    const hash = crypto.createHash('sha256').update(password).digest('base64');

    const insert = "insert into users (email, name, dob, address, sni, password) values (?, ?, ?, ?, ?, ?)"
    const fetch1 = "select * from users where email = ?";
    const fetch2 = "select * from sni_numbers where sni_number = ?";
    const fetch3 = "select * from users where sni = ?";

    db.query(fetch1, [email], (err, result) => {
        if (result.length > 0) {
            res.send({ status: false, msg: "A user has already been registered with this email!" });
        }
        else {
            db.query(fetch2, [sni], (err, result) => {
                if (result.length > 0) {
                    db.query(fetch3, [sni], (err, result) => {
                        if (result.length > 0) {
                            res.send({ status: false, msg: "A user has already been registered with SNI number!" });
                        }
                        else {
                            db.query(insert, [email, name, dob, address, sni, hash], (err, result) => {
                                if (result.insertId) {
                                    res.send({ status: true, msg: "Sing up successful" });
                                }
                                else {
                                    res.send({ status: false, msg: "Something went wrong!" });
                                }
                            });
                        }
                    });
                }
                else {
                    res.send({ status: false, msg: "The SNI number entered is invalid!" });
                }
            })

        }
    });

});

app.post("/add", (req, res) => {
    const question = req.body.question;
    const options = req.body.options;

    let query = 'insert into questions (question_text) values (?)';

    db.query(query, [question], (err, result) => {
        if (result.insertId) {
            let status = true;

            options.forEach(option => {
                query = "insert into options (question_id, option_text) values (?, ?)";
                db.query(query, [result.insertId, option], (err, result) => {
                    if (!result.insertId) {
                        status = false;
                    }
                });

            });

            res.send({
                status: status,

            });
        }
        else {
            res.send({ status: false })
        }
    });

});

app.get("/GetQuestions", (req, res) => {
    const query = "select * from questions";

    db.query(query, (err, result) => {
        if (result.length > 0) {
            res.send({
                questions: result
            });
        }
    });

});

app.get("/GetAllOptions", (req, res) => {
    const query = `select * from options`;

    db.query(query, (err, result) => {
        if (result.length > 0) {
            res.send({
                options: result
            });
        }
    });

});

app.get("/GetAllResponses", (req, res) => {
    const query = `select * from responses`;

    db.query(query, (err, result) => {
        if (result.length > 0) {
            res.send({
                responses: result
            });
        }
    });

});

app.get("/test/:value", (req, res) => {
    const someValue = req.params.value;
    const query = `select * from responses`;

    res.send({
        value: someValue
    });

});

app.post("/DeleteQuestion", (req, res) => {
    const questionId = req.body.questionId;
    const query1 = `delete from questions where question_id = ?`;
    const query2 = `delete from options where question_id = ?`;

    db.query(query1, [questionId], (err, result) => {
        if (result.affectedRows > 0) {
            db.query(query2, [questionId], (err, result) => {
                if (result.affectedRows > 0) {
                    res.send({
                        status: true
                    });
                }
                else {
                    res.send({
                        status: false
                    });
                }
            });

        }
        else {
            res.send({
                status: false
            });
        }
    });

});

app.post("/edit", (req, res) => {
    const questionId = req.body.questionId;
    const question = req.body.question;
    const options = req.body.options;
    const changes = req.body.changes;

    const query1 = `update questions set question_text = ? where question_id = ?`;
    const query2 = `delete from options where question_id = ?`;

    db.query(query1, [question, questionId], (err, result) => {
        if (err == null) {
            if (changes.indexOf("opt") != -1) {
                db.query(query2, [questionId], (err, result) => {
                    if (result.affectedRows > 0) {
                        let status = true;

                        options.forEach(option => {
                            query = "insert into options (question_id, option_text) values (?, ?)";
                            db.query(query, [questionId, option], (err, result) => {
                                if (!result.insertId) {
                                    status = false;
                                }
                            });

                        });

                        res.send({
                            status: true
                        });
                    }
                    else {
                        res.send({
                            status: false
                        });
                    }
                });
            }
            else {
                res.send({
                    status: true
                });
            }

        }
        else {
            res.send({
                status: false
            });
        }
    });

});

app.post("/submitResponse", (req, res) => {
    const question_id = req.body.question_id;
    const user_id = req.body.user_id;
    const option_id = req.body.option_id;

    const query = `insert into responses (question_id, user_id, option_id) values (?, ?, ?)`;

    db.query(query, [question_id, user_id, option_id], (err, result) => {
        if (result.insertId) {
            res.send({
                status: true
            });
        }
    });

});

app.get("/GetAllQuestions", (req, res) => {
    const query = `select * from questions`;

    db.query(query, (err, result) => {
        if (result.length > 0) {
            const questions = result.map(qtn => {
                return {
                    id: qtn.question_id,
                    Text: qtn.question_text
                }
            })
            res.json({
                consultation: {
                    Questions: questions
                }

            });
        }
    });

});

app.get("/GetLocations", (req, res) => {
    const query = `select * from locations`;

    db.query(query, (err, result) => {
        if (result.length > 0) {
            res.send({
                locations: result

            });
        }
    });

});

app.get("/GetQuestionOptions/:id", (req, res) => {
    const id = req.params.id;
    const query = `select * from options where question_id = ?`;

    db.query(query, [id], (err, result) => {
        if (result.length > 0) {
            const options = result.map(opt => {
                return {
                    id: opt.option_id,
                    Text: opt.option_text
                }
            })
            res.json({
                Question: id,
                Options: options
            });
        }
    });

});

app.get("/GetQuestionResponse/:id", (req, res) => {
    const id = req.params.id;
    const query1 = `select * from options where question_id = ?`;
    const query2 = `select * from responses where option_id = ?`;

    db.query(query1, [id], (err, result1) => {
        if (result1.length > 0) {
            const options = [];
            result1.forEach(elem => {
                db.query(query2, [elem.option_id], (err, result2) => {
                    if (result2.length > 0) {
                        options.push({
                            id: elem.option_id,
                            count: result2.length
                        });
                        if (options.length == result1.length) {
                            res.json({
                                Question: id,
                                Answers: options
                            });
                        }
                    }
                });

            });

        }
    });

});

app.post("/recordLocation", (req, res) => {
    const lat = req.body.lat;
    const lng = req.body.lng;

    const query = `insert into locations (latitude, longitude) values (?, ?)`;

    db.query(query, [lat, lng]);
});

app.listen(3080, () => {
    console.log("server running on port 3080");
})