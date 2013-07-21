var fs = require('fs');
var express = require('express');
    var app = express();
var async = require('async');

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
      ru: {
        title: String,
      s_title: String,
         body: String
      },
      en: {
        title: String,
      s_title: String,
         body: String    
      },
      img: {
          path: String,
        author: String
      },
      hall: String,
       tag: String,
      child: {type: Boolean, default: false},
      date: {type: Date, default: Date.now},
   members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
  children: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
});

var userSchema = new Schema({
   login: String,
    password: String,
   email: String,
  status: {type: String, default: 'User'},
    date: {type: Date, default: Date.now},
});

var memberSchema = new Schema({
    ru: {
      name: String, 
      description: String
    },
    en: {
      name: String, 
      description: String
    },
    img: String,
    status: String,
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
});

var User = mongoose.model('User', userSchema);
var Member = mongoose.model('Member', memberSchema);
var Event = mongoose.model('Event', eventSchema);


// ------------------------
// *** Midleware Block ***
// ------------------------


function checkAuth (req, res, next) {
  if (req.session.user_id)
    next();
  else
    res.redirect('/login');
}

function memberSplit (members) {
  var results = [];
  for (var i in members)
    if (members[i] != '') results.push(members[i]);
  
  return results; 
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
  Event.find().populate('children').exec(function(err, event) {
    res.render('event', {event: event});
  });
});

app.get('/auth', checkAuth, function (req, res) {
  res.render('auth');
});

app.post('/auth', checkAuth, function (req, res) {
  var post = req.body;
  console.log(req.body);
  // console.log(req.body.children[0].ru.title);
  // console.log(req.body.children[0].cal);
  // console.log(req.body.event.ru.actors);
  // console.log(results);

  res.redirect('back');
});

app.get('/auth/add/event', checkAuth, function (req, res) {
  Member.find(function(err, members) {
    res.render('add_event', {members: members});
  });
});

app.post('/auth/add/event', function(req, res) {
  var post = req.body;
  var files = req.files;
  for (var i in post.children) {
    post.children[i].files = files.children[i];
  }

  var event = new Event({
    ru: {
      title: post.ru.title,
      s_title: post.ru.s_title,
      body: post.ru.body
    },
    tag: post.tag
  });

  if (post.en) {
    event.en.title = post.en.title;
    event.en.s_title = post.en.s_title;
    event.en.body = post.en.body;
  };

  if (post.event) {
    event.members = memberSplit(post.event.members);
    if (!post.children)
      event.hall = post.event.hall;
    if (post.event.cal)
      event.date = new Date(post.event.cal.year, post.event.cal.month, post.event.cal.date);
  };


  if (post.children) {
    async.forEach(post.children, function(post_ch, callback) {
      var child = new Event({
        ru: {
          title: post_ch.ru.title,
          s_title: post_ch.ru.s_title,
          body: post_ch.ru.body
        },
        date: ch_date,
        hall: post_ch.hall,
        members: memberSplit(post_ch.members),
        child: true
      });

      if (post_ch.cal)
        var ch_date = new Date(post_ch.cal.year, post_ch.cal.month, post_ch.cal.date);

      if (post_ch.en) {
        child.en.title = post_ch.en.title;
        child.en.s_title = post_ch.en.s_title;
        child.en.body = post_ch.en.body;
      }

      child.save(function(err, result) {
        // event.children.push(result._id);

        Member.find({'_id': { $in: result.members} }, function(err, members) {
          async.forEach(members, function(member, callback) {
            member.events.push(result._id);
            member.save();
            callback();
          });
        });

        if (post_ch.files.poster.size != 0) {          
          Event.findById(result._id, function(err, child) {
            fs.readFile(post_ch.files.poster.path, function (err, data) {
              var newPath = __dirname + '/public/images/events/children/' + child._id + '.jpg';
              fs.writeFile(newPath, data, function(err) {
                child.img.path = '/public/images/events/children/' + child._id + '.jpg';
                callback(child);
              });              
            });
          });
        }
        else callback();

      });
    }, function(child) {
      child.save();
    });
  }

  event.save(function(err, result) {
    Member.find({'_id': { $in: result.members} }, function(err, members) {
      async.forEach(members, function(member, callback) {
        member.events.push(result._id);
        member.save();
        callback();
      });
    });

    if (files) {
      Event.findById(result._id, function(err, event) {      
        fs.readFile(files.poster.path, function (err, data) {
          fs.mkdir(__dirname + '/public/images/events/' + event._id, function() {
            var newPath = __dirname + '/public/images/events/' + event._id + '/poster.jpg';
            fs.writeFile(newPath, data, function (err) {
              event.img.path = '/public/images/events/' + event._id + '/poster.jpg';
              event.save(function() {
                res.redirect('back');
              })              
            });
          });
        });
      });
    }     
  }); 
});













app.get('/auth/add/member', checkAuth, function (req, res) {
  res.render('add_member');
});

app.post('/auth/add/member', function (req, res) {
  var post = req.body;
  var files = req.files;
  var ru = post.ru;
  var en = post.en;

  var member = new Member({
    ru:{
      name: ru.name,
      description: ru.description
    },
    status: post.status
  });

  member.save(function(err, member) {
    fs.readFile(files.img.path, function (err, data) {
      var newPath = __dirname + '/public/images/members/' + member._id + '.jpg';
      fs.writeFile(newPath, data, function (err) {
        Member.findById(member._id, function(err, mem) {
          mem.img = '/public/images/members/' + member._id + '.jpg';
          mem.save(function() {
            res.redirect('back');
          })
        });
      });
    });
  });
});





app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  var post = req.body;

  User.findOne({ 'login': post.login, 'password': post.password }, function (err, person) {
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

  var user = new User({
    login: post.login,
    password: post.password,
    email: post.email
  });

  user.save(function(err, user) {
    if(err) {throw err;}
    console.log('New User created');
    req.session.user_id = user._id;
    req.session.login = user.login;
    req.session.status = user.status;
    res.redirect('/login');
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