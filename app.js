var fs = require('fs');
var express = require('express');
    var app = express();

var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
mongoose.connect('localhost', 'main');
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.pretty = true;
// app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.bodyParser({ keepExtensions: true, uploadDir:__dirname + '/uploads' }));
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});
app.use(app.router);


// -------------------
// *** Model Block ***
// -------------------


var eventSchema = new Schema({
    title: {
      ru: String,
      en: String
     },
    s_title: {
      ru: String,
      en: String
     },
    body: {
      ru: String,
      en: String
    },
    hall: String,
    img: {
        path: String,
        author: String
    },
       tag: String,
      date: {type: Date, default: Date.now},
   members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
  children: [eventSchema]
});

var userSchema = new Schema({
   login: String,
    pass: String,
   email: String,
  status: {type: String, default: 'User'},
    date: {type: Date, default: Date.now},
});

var memberSchema = new Schema({
    name: {
      ru: String, 
      en: String
    },
    description: {
      ru: String, 
      en: String
    },
    img: String,
    status: String,
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
});

var User = mongoose.model('User', userSchema);
var Member = mongoose.model('Member', memberSchema);
var EventRU = mongoose.model('Event', eventSchema);


// ------------------------
// *** Midleware Block ***
// ------------------------


function checkAuth (req, res, next) {
  if (req.session.user_id)
    next();
  else
    res.redirect('/login');
}


// ------------------------
// *** Main Block ***
// ------------------------

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/', function (req, res) {
  var post = req.body;

  var arr = [
  {'name':'1','tag':post.tag, 'img':'/images/1.jpg'},
  {'name':'2','tag':post.tag, 'img':'/images/1.jpg'},
  {'name':'3','tag':post.tag, 'img':'/images/1.jpg'},
  {'name':'4','tag':post.tag, 'img':'/images/1.jpg'},
  {'name':'5','tag':post.tag, 'img':'/images/1.jpg'},
  {'name':'6','tag':post.tag, 'img':'/images/1.jpg'},
  {'name':'7','tag':post.tag, 'img':'/images/1.jpg'},
  {'name':'8','tag':post.tag, 'img':'/images/1.jpg'},
  {'name':'9','tag':post.tag, 'img':'/images/1.jpg'},
  {'name':'10','tag':post.tag},
  {'name':'11','tag':post.tag},
  {'name':'12','tag':post.tag},
  {'name':'13','tag':post.tag},
  {'name':'14','tag':post.tag},
  {'name':'15','tag':post.tag},
  {'name':'16','tag':post.tag, 'img':'/images/1.jpg'},
  {'name':'17','tag':post.tag, 'img':'/images/1.jpg'},
  {'name':'18','tag':post.tag, 'img':'/images/2.jpg'},
  {'name':'19','tag':post.tag, 'img':'/images/2.jpg'},
  {'name':'20','tag':post.tag, 'img':'/images/1.jpg'},
  {'name':'21','tag':post.tag, 'img':'/images/2.jpg'},
  {'name':'22','tag':post.tag, 'img':'/images/1.jpg'},
  {'name':'23','tag':post.tag},
  {'name':'24','tag':post.tag}  
  ]

  if (post.offset == 18)
    res.send('exit');
  else
    res.send(arr.slice(post.offset, post.offset*2 || 6));  
});


app.get('/event', function (req, res) {
  Event.find().populate({ path: '_locale', match: { locale: 'RU' }}).exec(function(err, event) {
    res.render('event', {event: event});
  });
});

app.get('/auth', checkAuth, function (req, res) {
  res.render('auth');
});

app.post('/auth', checkAuth, function (req, res) {
  console.log(req.body);
  console.log(req.body.children[0].ru.title);
  console.log(req.body.children[0].cal);
  console.log(req.body.event.ru.actors);
  res.redirect('back');
});

app.get('/auth/add/event', checkAuth, function (req, res) {
  res.render('add_event');
});

app.post('/auth/add/event', function(req, res) {
  var post = req.body;

  if (post.event.cal)
    var date = new Date(post.event.cal.year, post.event.cal.month, post.event.cal.date);
  else
    var date = new Date();

  var event_ru = new EventRU({
    date: date,
    tag: post.event.tag,
    fields: {
      title: post.ru.title,
      s_title: post.ru.s_title
    }
  });

  for (var i in post.children) {
    var ch_date = new Date(post.children[i].cal.year, post.children[i].cal.month, post.children[i].cal.date);
    event_ru.children.push({
      fields: {
        title: post.children[i].ru.title,
        s_title: post.children[i].ru.s_title
      },
      date: ch_date
    })
  }

  event_ru.save(function() {
    res.redirect('back');
  });


});

app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  var post = req.body;

  User.findOne({ 'login': post.login, 'pass': post.password }, function (err, person) {
    if (!person) return res.redirect('back');
    req.session.user_id = person._id;
    req.session.status = person.status;
    req.session.login = person.login;
    res.redirect('/auth');
  });
});


app.get('/logout', function (req, res) {
  delete req.session.user_id;
  delete req.session.login;
  delete req.session.status;
  res.redirect('back');
});


app.get('/registr', function(req, res) {
  if (!req.session.user_id)
    res.render('registr');
  else
    res.redirect('/');
});


app.post('/registr', function (req, res) {
  var post = req.body;
  var user = new User();


  user.login = post.login;
  user.pass = post.password;


  user.save(function(err) {
    if(err) {throw err;}
    console.log('New User created');
    User.findOne({ 'login': post.login, 'pass': post.password }, function (err, person) {
      req.session.user_id = person._id;
      req.session.login = person.login;
      req.session.status = person.status;
      res.redirect('/login');
    });
  });
});












app.get('/error', function (req, res) {
  res.render('error');
});


app.get('*', function(req, res){
  res.render('error');
});


app.listen(3000);
console.log('http://127.0.0.1:3000')