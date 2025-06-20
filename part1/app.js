var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
let db;

(async () => {
  try {

    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });


  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();


app.get('/api/dogs', async (req, res) => {
  try {
    const [dogs] = await db.execute('select Dogs.name, Dogs.size, Users.username from Dogs join Users on Dogs.owner_id = Users.user_id;');
    res.json(dogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

app.get('/api/walkrequests/open', async (req, res) => {
  try {
    const [open] = await db.execute(`select WalkRequests.request_id, Dogs.name, WalkRequests.requested_time, WalkRequests.duration_minutes, WalkRequests.location, Users.username from WalkRequests join Dogs on WalkRequests.dog_id = Dogs.dog_id join Users on Dogs.owner_id = Users.user_id where WalkRequests.status = 'open';`);
    res.json(open);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch open reqs' });
  }
});

app.get('/api/walkers/summary', async (req, res) => {
  try {
    const [rating] = await db.execute(`select Users.username, count(WalkRatings.request_id) as completed_walks, count(WalkRatings.rating) as total_ratings, avg (WalkRatings.rating) as average_rating from WalkRatings join Users on
WalkRatings.walker_id = Users.user_id group by Users.username;`);
    res.json(rating);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch summaries' });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
