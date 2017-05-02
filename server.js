
var express = require('express');
var app = express();
bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var fs = require("fs");
var fs1 = require("fs");
var fs2 = require("fs");
var df = require('dateformat');
var mysql = require('mysql');
var connection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '3188',
database: 'data'
})
connection.connect();
var http = require('http');
var server = http.createServer(app);
//timestamp를 구하는 함수
function getTimeStamp() {
    var d = new Date();
    var s =
        Zeros(d.getFullYear(), 4) + ', ' +
        Zeros(d.getMonth() + 1, 2) + ', ' +
        Zeros(d.getDate(), 2) + ', ' +

        Zeros(d.getHours(), 2) + ', ' +
        Zeros(d.getMinutes(), 2); 
    return s;
}
function Zeros(n, digits) {
    var zero = '';
    n = n.toString();

    if (n.length < digits) {
        for (i = 0; i < digits - n.length; i++)
            zero += '0';
    }
    return zero + n;
}

app.get('/', function (request, response) {
        fs2.readFile('page.html',function(error,data){
                response.writeHead(200,{'content-type':'text/html'});
                response.end(data);
                });
        });
app.get('/img', function (request, response) {
        fs.readFile('ka.jpeg', function (error, data) {
                response.writeHead(200, { 'content-type': 'text/html' });
                response.end(data);
                });
        });
app.get('/dump', function(req, res) {
        console.log("param=" + req.query);

        var qstr = 'select * from koogle3 where time > date_sub(now(), INTERVAL 1 DAY) ';
        connection.query(qstr, function(err, rows, cols) {
                if (err) {
                throw err;
                res.send('query error: '+ qstr);
                return;
                }

                var html = "<!doctype html><html><body>";
                html+= "{<br>";
                html += "\"noise\" : [ <br>";
                for (var i=0; i< rows.length-1; i++) {
                html +=  JSON.stringify(rows[i])+",<br>";
                }
                html += JSON.stringify(rows[i])+"<br>]<br>}";
                html += "</body></html>";
                res.send(html);
                });
});


app.get('/data', function (req, res) {
        var Temp = req.query.snore;
        var Time = getTimeStamp();
        console.log(Time);
        var query = connection.query("insert into koogle3 (value,time) values ('"+parseInt(Temp) +"','"+Time+"')", function(err, rows, cols) {
                if (err) {
                console.log("Done");
                process.exit();
                }
                });

        });
app.get('/graph', function (req, res) {
        console.log('got app.get(graph)');
        var html = fs1.readFile('./graph4.html', function (err, html) {
                html = " "+ html
                console.log('read file');
                var qstr = 'select * from koogle3';
                connection.query(qstr, function(err, rows, cols) {
                        if (err) throw err;

                        var data = "";
                        var comma = ""
                        for (var i=0; i< rows.length; i++) {
                        r = rows[i];
                        console.log(r);
                        data += comma + "[new Date("+r.time+"),"+ r.value +"]";
                        comma = ",";
                        }
                        html = html.replace("<%DATA%>", data);
                        });
                var qstr1 = 'select * from koogle5';
                connection.query(qstr1, function(err, rows, cols) {
                        if (err) throw err;

                        var data = "";
                        var comma = ""
                        for (var i=0; i< rows.length; i++) {
                        r = rows[i];
                        console.log(r);
                        data += comma + "[new Date("+r.time+"),"+ r.value +"]";
                        comma = ",";
                        }
                        html = html.replace("<%DATA1%>", data);
                        });
                var qstr2 = 'select * from koogle7';
                connection.query(qstr2, function(err, rows, cols) {
                        if (err) throw err;

                        var data = "";
                        var comma = ""
                        for (var i=0; i< rows.length; i++) {
                        r = rows[i];
                        console.log(r);
                        data += comma + "[new Date("+r.time+"),"+ r.cnt +","+r.dur+"]";
                        comma = ",";
                        }
                        html = html.replace("<%DATA2%>", data);
                        res.writeHeader(200, {"Content-Type": "text/html"});
                        res.write(html);
                        res.end();
                        });
        });
});
//server is on
var server = app.listen(3000, function () {
        var port = server.address().port
        console.log('listening at http://:%s',  port)
        });/when client connect the broker, it prints out the text
