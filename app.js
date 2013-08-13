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


var newsSchema = new Schema({
      ru: {
        title: String,
      s_title: String,
         body: String,
     p_author: String
      },
      en: {
        title: String,
      s_title: String,
         body: String,
     p_author: String
      },
      photo: String,
      poster: String,
      tag: String,
      date: {type: Date, default: Date.now}
});


var eventSchema = new Schema({
      ru: {
        title: String,
      s_title: String,
         body: String,
         ticket: String,
         p_author: String
      },
      en: {
        title: String,
      s_title: String,
         body: String,
         ticket: String,
         p_author: String
      },
      photo: String,
      poster: String,
      hall: String,
       tag: String,
      _parent: { type: Schema.Types.ObjectId, ref: 'Event' },
      date: {type: Date, default: Date.now},
      // cal: {type: Date, default: Date.now},
   members: [{
    c_status: String,
    m_id: { type: Schema.Types.ObjectId, ref: 'Member' }
   }],
  children: [{ type: Schema.Types.ObjectId, ref: 'Child' }]
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
    status: [String],
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
});

var userSchema = new Schema({
   login: String,
    password: String,
   email: String,
  status: {type: String, default: 'User'},
    date: {type: Date, default: Date.now},
});

var scheduleSchema = new Schema({
  events: [{
    event: { type: Schema.Types.ObjectId, ref: 'Event' },
    premiere: String,
    time: {
      hours: String,
      minutes: String
    }
    }],
  date: {type: Date, default: Date.now}
});

var User = mongoose.model('User', userSchema);
var Member = mongoose.model('Member', memberSchema);
var Event = mongoose.model('Event', eventSchema);
var News = mongoose.model('News', newsSchema);
var Child = mongoose.model('Child', eventSchema);
var Schedule = mongoose.model('Schedule', scheduleSchema);


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
  var split = [];
  var results = [];
  var s;

  for (var i in members)
    if (members[i] != '') split.push(members[i]);

  for (var i in split) {
    s = split[i].split('-');
    results.push({
      m_id: s[0],
      c_status: s[1]
    });
  }

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

app.get('/afisha/current', function (req, res) {
  var start = new Date();
  var end = new Date();
  start.setDate(1);
  end.setFullYear(end.getFullYear(), end.getDate()+1, 0);

  Schedule.find({"date": {"$gte": start, "$lt": end}}).sort('-date').populate('events.event').exec(function(err, schedule) {
    res.render('afisha', {schedule: schedule})
  });
});


app.get('/event', function (req, res) {
  Event.find().populate('children members.m_id').exec(function(err, event) {
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

  var event = new Event({
    ru: {
      title: post.ru.title,
      s_title: post.ru.s_title,
      body: post.ru.body,
      ticket: post.ru.ticket,
      p_author: post.ru.p_author
    },
    tag: post.tag
  });

  if (post.en) {
    event.en.title = post.en.title;
    event.en.s_title = post.en.s_title;
    event.en.body = post.en.body;
    event.en.ticket = post.en.ticket;
    event.en.p_author = post.en.p_author;
  };

  if (post.event) {
    event.members = memberSplit(post.event.members);
    if (!post.children)
      event.hall = post.event.hall;
    // if (post.event.cal)
    //   event.cal = new Date(post.event.cal.year, post.event.cal.month, post.event.cal.date);
  };


  if (post.children) {

    for (var i in post.children) {
      post.children[i].files = files.children[i];
    }

    async.forEach(post.children, function(post_ch, callback) {
      var child = new Child({
        ru: {
          title: post_ch.ru.title,
          s_title: post_ch.ru.s_title,
          body: post_ch.ru.body
        },
        cal: ch_date,
        hall: post_ch.hall,
        members: memberSplit(post_ch.members),
        _parent: event._id
      });

      // if (post_ch.cal)
      //   var ch_date = new Date(post_ch.cal.year, post_ch.cal.month, post_ch.cal.date);

      if (post_ch.en) {
        child.en.title = post_ch.en.title;
        child.en.s_title = post_ch.en.s_title;
        child.en.body = post_ch.en.body;
      }

      event.children.push(child._id);

      child.save(function(err, result) {


        Member.find({'_id': { $in: result.members} }, function(err, members) {
          async.forEach(members, function(member, callback) {
            member.events.push(result._id);
            member.save();
            callback();
          });
        });

        if (post_ch.files.photo.size != 0) {
          Child.findById(result._id, function(err, child) {
            fs.readFile(post_ch.files.photo.path, function (err, data) {
              var newPath = __dirname + '/public/images/events/children/' + child._id + '.jpg';
              fs.writeFile(newPath, data, function(err) {
                child.photo = '/public/images/events/children/' + child._id + '.jpg';
                child.save();
              });
            });
          });
        }
        else callback();

      });
    }, function() {
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

    async.series([
      function(callback) {
        if (files.photo.size != 0) {
          Event.findById(result._id, function(err, event) {
            fs.readFile(files.photo.path, function (err, data) {
              fs.mkdir(__dirname + '/public/images/events/' + event._id, function() {
                var newPath = __dirname + '/public/images/events/' + event._id + '/photo.jpg';
                fs.writeFile(newPath, data, function (err) {
                  event.photo = '/public/images/events/' + event._id + '/photo.jpg';
                  event.save(function() {
                    callback(null, 'one');
                  })
                });
              });
            });
          });
        }
        else {
          fs.unlink(files.photo.path);
          callback(null, 'one');
        }
      },
      function(callback) {
        if (files.poster.size != 0) {
          Event.findById(result._id, function(err, event) {
            fs.readFile(files.poster.path, function (err, data) {
              fs.mkdir(__dirname + '/public/images/events/' + event._id, function() {
                var newPath = __dirname + '/public/images/events/' + event._id + '/poster.jpg';
                fs.writeFile(newPath, data, function (err) {
                  event.poster = '/public/images/events/' + event._id + '/poster.jpg';
                  event.save(function() {
                    callback(null, 'two');
                  })
                });
              });
            });
          });
        }
        else {
          fs.unlink(files.poster.path);
          callback(null, 'two');
        }
      }
    ],
    function(err, results){
      res.redirect('back');
    });
  });
});








/****************
  Schedule Block
****************/


app.get('/auth/add/schedule', checkAuth, function (req, res) {
  res.render('add_schedule');
});


app.get('/auth/add/schedule/:year', checkAuth, function (req, res) {
  var year = req.params.year;
  var start = new Date(year,0,1)
  var end = new Date(year,11,31)

  Schedule.find({"date": {"$gte": start, "$lt": end}}).sort('-date').populate('events.event').exec(function(err, schedule) {
    res.render('add_schedule/add', {schedule: schedule, year: year});
  });
});

app.post('/auth/add/schedule/:year', function (req, res) {
  var post = req.body;

  var schedule = new Schedule({
    date: new Date(post.schedule.year, post.schedule.month, post.schedule.date)
  });

  schedule.save(function(err) {
    res.redirect('back');
  });

});

app.get('/auth/add/schedule/:year/:id', checkAuth, function (req, res) {
  var id = req.params.id;

  Event.find(function(err, events) {
    Schedule.find({'_id':id}).populate('events.event').exec(function(err, date) {
      res.render('add_schedule/date', {date: date, events: events});
    });
  });
});

app.post('/auth/add/schedule/:year/:id', function (req, res) {
  var post = req.body;
  var id = req.params.id;

  Schedule.findById(id, function(err, date) {
    date.events = post.events;

    date.save(function(err) {
      res.redirect('back');
    });
  });

  // console.log(post);
  // res.redirect('back');
});

/************
  News Block
************/


app.get('/auth/add/news', checkAuth, function (req, res) {
  res.render('add_news');
});

app.post('/auth/add/news', function (req, res) {
  var post = req.body;
  var files = req.files;

  var news = new News({
    ru: {
      title: post.ru.title,
      s_title: post.ru.s_title,
      body: post.ru.body,
      p_author: post.ru.p_author
    }
  });

  if (post.en) {
    news.en.title = post.en.title;
    news.en.s_title = post.en.s_title;
    news.en.body = post.en.body;
    news.en.p_author = post.en.p_author;
  };

  news.tag = post.tag;

  news.save(function(err, result) {
    async.series([
      function(callback) {
        if (files.photo.size != 0) {
          News.findById(result._id, function(err, news) {
            fs.readFile(files.photo.path, function (err, data) {
              fs.mkdir(__dirname + '/public/images/news/' + news._id, function() {
                var newPath = __dirname + '/public/images/news/' + news._id + '/photo.jpg';
                fs.writeFile(newPath, data, function (err) {
                  news.photo = '/public/images/news/' + news._id + '/photo.jpg';
                  news.save(function() {
                    callback(null, 'one');
                  })
                });
              });
            });
          });
        }
        else {
          fs.unlink(files.photo.path);
          callback(null, 'one');
        }
      },
      function(callback) {
        if (files.poster.size != 0) {
          News.findById(result._id, function(err, news) {
            fs.readFile(files.poster.path, function (err, data) {
              fs.mkdir(__dirname + '/public/images/news/' + news._id, function() {
                var newPath = __dirname + '/public/images/news/' + news._id + '/poster.jpg';
                fs.writeFile(newPath, data, function (err) {
                  news.poster = '/public/images/news/' + news._id + '/poster.jpg';
                  news.save(function() {
                    callback(null, 'two');
                  })
                });
              });
            });
          });
        }
        else {
          fs.unlink(files.poster.path);
          callback(null, 'two');
        }
      }
    ],
    function(err, results){
      res.redirect('back');
    });
  });
});


/*************
Members Block
*************/


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
    if (files.img.size != 0) {
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
    }
    else {
      fs.unlink(files.img.path);
      res.redirect('back');
    }
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