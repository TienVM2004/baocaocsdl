const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

/** 
 * Here lies all the GET 
 */
app.get('/', (req, res) => {
  res.render('intro');
});
app.get('/login', function(req, res) {
  res.render('login');
});
app.get('/register', function(req, res) {
  res.render('register');
});
app.get('/delete', function(req, res) {
  res.render('delete');
});
app.get('/success', function(req, res) {
  res.send('Login successful!');
});
app.get('/fail', function(req, res) {
  res.send('Login failed!');
});
app.get('/register_fail', function(req, res) {
  res.render('register_fail');
});
app.get('/login_fail', function(req, res) {
  res.render('login_fail');
});
app.get('/login_success', function(req, res) {
  res.render('login_success');
});


/** 
 * Here lies all the POST
 */
app.post('/login', async function(req, res) {
  const result = await find(client, req.body.username, req.body.password);
  if(result) {
      res.redirect('/login_success');
  } else {
      // Send the message as part of the redirect URL
      res.redirect('/login_fail');
  }
});

app.post('/register', async function(req, res) {
  const result = await findByUserName(client, req.body.username);
  if(result) {
    res.redirect('/register_fail');
      
  } else {
      // Send the message as part of the redirect URL
    insert(client, req.body.username, req.body.password);
    res.redirect('/login');
  }
});

app.post('/delete', async function(req, res) {
  const result = await findByUserName(client, req.body.username);
  if(result) {
    deleteUser(client, req.body.username);
    res.redirect('/');
  } else {
      // Send the message as part of the redirect URL
    res.redirect('/');
  }
});


/**
 * All custom function to use for user input validation
 */
async function find(client, username, password) {
  console.log(username, password); // print the username and password from the login form

  const result = await client.db("test").collection("users")
  .findOne({
    username: username,
    password: password
  });

  console.log(result); // print the result of the findOne query

  if(result) {
    console.log(`Return found with username ${username}`);
    return true;
  } else {
    console.log(`No user found with username ${username}`)
    return false;
  }
}

async function findByUserName(client, username) {
  const result = await client.db("test").collection("users")
  .findOne({
      username: username,
  })

  if(result) {
      console.log(`Return found with username ${username}`);
      return true;
  } else {
      console.log(`No return found with username ${username}`)
      return false;
  }
}

async function insert(client, username, password) {
  const result = await client.db("test").collection("users")
  .insertOne({
      username: username,
      password: password
              });

  console.log(`Inserted 1 document into collection with ID ${result.insertedId}`);
}

async function deleteUser(client, username) {
  const result = await client.db("test").collection("users")
  .deleteOne({
      username: username
              });

  console.log(`Deleted 1 document into collection with ID ${result.insertedId}`);
}

/**
 * I honestly don't know what this bitch does
 */

const client = new MongoClient('mongodb+srv://ineedsumsnack0308:ineedsumsnack2004@tienvm2004.lfouc8n.mongodb.net/?retryWrites=true&w=majority', {maxPoolSize : 10});
client.connect().then(() => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`)
    });
}).catch(err => {
    console.error(err);
});
