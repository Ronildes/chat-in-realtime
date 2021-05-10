import express from 'express';
import path from 'path';
import { createServer } from 'http';
import socketIO from 'socket.io';
import { renderFile } from 'ejs';

const app = express();
const server = createServer(app);
const io = new socketIO.Server(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', renderFile);
app.set('view engine', 'html');

app.use('/', (request, response) => {
  response.render('index.html');
});

// @ts-ignore
const messages = [];

io.on('connection', socket => {
  // @ts-ignore
  socket.emit('previousMessages', messages);

  socket.on('sendMessage', data => {
    messages.push(data);
    socket.broadcast.emit('receivedMessage', data);
  });
});

server.listen(3000, () => {
  console.log('Server started on port 3000!');
});
