
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const clients = new Map();
let adminCount = 0;

const chatHistory = [];
const recentNotifications = [];
const MAX_HISTORY = 50;

function broadcast(message) {
  const messageStr = JSON.stringify(message);

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });

  if (message.type === 'notification') {
    recentNotifications.push(message);
    if (recentNotifications.length > MAX_HISTORY) {
      recentNotifications.shift();
    }
  } else if (message.type === 'chat') {
    chatHistory.push(message);
    if (chatHistory.length > MAX_HISTORY) {
      chatHistory.shift();
    }
  }
}

wss.on('connection', (ws) => {
  const clientId = adminCount++;
  const clientName = `Admin`;
  clients.set(ws, { id: clientId, name: clientName });

  console.log(`Новий клієнт підключився: ${clientName}`);

  ws.send(JSON.stringify({
    type: 'connection',
    id: clientId,
    name: clientName,
    message: 'Підключено до WebSocket сервера кінотеатру'
  }));

  ws.send(JSON.stringify({
    type: 'history',
    chatHistory: chatHistory,
    notifications: recentNotifications
  }));

  broadcast({
    type: 'notification',
    message: `${clientName} підключився до системи`,
    timestamp: new Date().toISOString()
  });

  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message);
      console.log('Отримано повідомлення:', data);

      switch (data.type) {
        case 'chat':
          const client = clients.get(ws);
          broadcast({
            type: 'chat',
            sender: client.name,
            message: data.message,
            timestamp: new Date().toISOString()
          });
          break;

        case 'schedule_update':
          broadcast({
            type: 'notification',
            action: 'schedule_update',
            message: `Розклад оновлено: ${data.message}`,
            details: data.details,
            timestamp: new Date().toISOString()
          });
          break;

        case 'movie_add':
          broadcast({
            type: 'notification',
            action: 'movie_add',
            message: `Додано новий фільм: ${data.movie.title}`,
            movie: data.movie,
            timestamp: new Date().toISOString()
          });
          break;

        case 'movie_delete':
          broadcast({
            type: 'notification',
            action: 'movie_delete',
            message: `Видалено фільм: ${data.movie.title}`,
            movieId: data.movie.id,
            timestamp: new Date().toISOString()
          });
          break;

        case 'name_change':
          const oldName = clients.get(ws).name;
          clients.get(ws).name = data.name;
          broadcast({
            type: 'notification',
            message: `${oldName} змінив ім'я на ${data.name}`,
            timestamp: new Date().toISOString()
          });
          break;

        default:
          console.log('Невідомий тип повідомлення:', data.type);
      }
    } catch (error) {
      console.error('Помилка обробки повідомлення:', error);
    }
  });

  ws.on('close', () => {
    const client = clients.get(ws);
    if (client) {
      console.log(`Клієнт відключився: ${client.name}`);
      broadcast({
        type: 'notification',
        message: `${client.name} відключився від системи`,
        timestamp: new Date().toISOString()
      });
      clients.delete(ws);
    }
  });
});

app.post('/api/movie', (req, res) => {
  const movie = req.body;
  console.log('Додано новий фільм через API:', movie);

  broadcast({
    type: 'notification',
    action: 'movie_add',
    message: `Додано новий фільм: ${movie.title}`,
    movie: movie,
    timestamp: new Date().toISOString()
  });

  res.status(201).json({
    success: true,
    message: 'Фільм додано успішно',
    movie: movie
  });
});

app.delete('/api/movie/:id', (req, res) => {
  const movieId = req.params.id;
  const movieTitle = req.query.title || 'Невідомий фільм';
  console.log(`Видалено фільм з ID: ${movieId}`);

  broadcast({
    type: 'notification',
    action: 'movie_delete',
    message: `Видалено фільм: ${movieTitle}`,
    movieId: movieId,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    message: 'Фільм видалено успішно'
  });
});

app.put('/api/schedule', (req, res) => {
  const scheduleUpdate = req.body;
  console.log('Оновлено розклад:', scheduleUpdate);

  broadcast({
    type: 'notification',
    action: 'schedule_update',
    message: `Розклад оновлено: ${scheduleUpdate.message || 'Оновлення розкладу'}`,
    details: scheduleUpdate,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    message: 'Розклад оновлено успішно'
  });
});

const PORT = process.env.PORT || 8003;
server.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});
