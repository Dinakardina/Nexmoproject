const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Init Nexmo
const nexmo = new Nexmo({
  apiKey: '919d840f',
  apiSecret: 'dGCaxa1youdiG8hW'
}, {debug: true});

// Init app
const app = express();

// Template engine setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Public folder setup
app.use(express.static(__dirname + '/public'));

// Body parser middleware


// Index route
app.get('/', (req, res) => {
  res.render('index');
});


// Catch form submit
app.post('/fetch', (req, res) => {
  // res.send(req.body);
  console.log(req.body);
  const number = req.body.number;
  const text = req.body.text;
//  { type: 'unicode' },
  nexmo.message.sendSms('Daan', number, text,(err, responseData) => {
      if(err) {
        console.log("helooo");
        
        console.log(err);
      }
       else if(responseData.messages[0].status != '0') {
        console.error(responseData);
        throw 'Nexmo returned back a non-zero status';
      }
       else {
        console.log(JSON.stringify(responseData));
        // Get data from response
        const data = {
          id: responseData.messages[0]['message-id'],
          number: responseData.messages[0]['to']
        }

        console.log("going to emittt")
        // Emit to the client
        io.emit('smsStatus', data);
      }
    }
  );
});

// Define port
const port = 3000;

// Start server
const server = app.listen(port, () => console.log(`Server started on port ${port}`));

// Connect to socket.io
const io = socketio(server);
io.on('connection', (socket) => {
  console.log('Connected');
  io.on('disconnect', () => {
    console.log('Disconnected');
  })
})