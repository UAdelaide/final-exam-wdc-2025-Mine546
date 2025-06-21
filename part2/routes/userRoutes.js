/* eslint-disable linebreak-style */
const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login (dummy version)
router.post('/login', async (req, res) => {
  const { username, password } = req.body; //takes username

  try {
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [username, password]);
    if (rows.length === 0) {
      return res.status(401).json({ error: `Invalid credentials: ${usernames}` });//tester
    }
    const user = rows[0];
//sessions added
    req.session.userId = user.user_id;
    req.session.role = user.role;
    //sends to owner
    if(req.session.role === 'owner'){
      res.redirect('/owner-dashboard.html');
    } //sends to walker
    else if (req.session.role === 'walker'){
      res.redirect('/walker-dashboard.html');
    } //sends to jail
    else {
      res.status(401).json({ error: `Illegal! `});
    } //no requirement to send them back to login page
  } catch (error) {
    res.status(500).json({ error: `Login failed `});
  }

});



router.get('/logout', function (req, res){
  res.clearCookie('connect.sid');
  res.redirect('/');
});




router.get('/owner-dashboard.html', async (req, res) => {
  
  try {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa');
  const [rows] = await db.query(`
      select Dogs.name from Dogs join Users on Dogs.owner_id = Users.user_id
      where Dogs.owner_id = ?
    `, [req.session.userId]);
    console.log(`dogs: ${req.session.userId}`);
    for (let i=0; i<rows.length; i++){
      const sel = document.getElementById("dogName");
      const el = document.getElement("option");
      sel.add(el, sel.options[1]);
    }


  } catch (error) {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa');
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa');
});





module.exports = router;
