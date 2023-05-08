const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const oracledb = require('oracledb');
const app = express();
const http = require("http");
const fs = require('fs');
let records;
const server = http.createServer(app);
const port = process.env.PORT || 4122;

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on('connection', (socket) => {
  console.log("Socket Connected");

  socket.on("oracle-logs", (data) => {
    console.log("=== creating stream ===");
    fs.createReadStream('ologs.txt')
    .on('data', (chunk) => {
      const lines = chunk.toString().split('\n');
      // console.log(lines)
      for (let i = 0; i < lines.length; i++) {
        setTimeout(() => {
          if (lines[i]) socket.emit('oracle-logs', lines[i]);
          }, i * 1500);
        }
    })
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/oracle-logs', (req, res) => {
  
  // const {user, password, connectionString} = req.body;
  
  oracledb.getConnection({
      user: 'fypcs11' ,
      password: '123' ,
      connectString: 'localhost:1524/orcl1',
      privilege: oracledb.SYSDBA},

  (err, connection) => {if (err) {
        console.error(err);
        res.status(500).send(err);
      } 
      
      else {
        connection.execute(
          'SELECT * FROM (SELECT TRUNC(ORIGINATING_TIMESTAMP) , MESSAGE_GROUP, MESSAGE_TEXT FROM v$diag_alert_ext ORDER BY originating_timestamp DESC)',
          (err, result) => {
            if (err) {

              console.error(err);
              res.status(500).send(err);

            } 
            else {
              connection.release((err) => {
                if (err) {
                  console.error(err);
                  res.status(500).send(err);
                } else {                                
                  const writeData = result.rows.map(arr => arr.join(',')).join('');

                  fs.writeFile('ologs.txt', writeData, (err) => {
                    if (err) throw err;
                    console.log('Data Written')
                  })
                  res.send(result);
                }
              });
            }
          }
        );
      }
    }
    
  );
});

})
app.listen(port, () => {
  console.log(`Server started on ${port}`);
});


server.listen(port+10, () => {
  console.log(`Socket port: ${port+10}`)
});