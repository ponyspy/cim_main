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
      events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
      tag: String,
      date: {type: Date, default: Date.now}
});


var eventSchema = new Schema({
      ru: {
        title: String,
      s_title: String,
         body: String,
         ticket: String,
         comment: String,
         p_author: String
      },
      en: {
        title: String,
      s_title: String,
         body: String,
         ticket: String,
         comment: String,
         p_author: String
      },
      photo: String,
      poster: String,
      hall: String,
       tag: String,
      _parent: { type: Schema.Types.ObjectId, ref: 'Event' },
      date: {type: Date, default: Date.now},
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
    date: {type: Date, default: Date.now},
    img: String,
    status: [String]
    // events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
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
    banner: String,
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

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

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
  var start = new Date();
  var end = new Date();
  start.setDate(1);
  end.setFullYear(end.getFullYear(), (end.getMonth()+1), 0);

  Schedule.find({'date': {'$gte': start, '$lt': end}}).populate('events.event').exec(function(err, schedule) {
    News.find().sort('-date').limit(6).exec(function(err, news) {
      res.render('index', {news: news, schedule: schedule});
    });
  });
});

app.post('/', function (req, res) {
  var post = req.body;

  if (post.tag == 'all') {
    News.find().skip(post.offset).limit(6).sort('-date').exec(function(err, news) {
      if (news.length == 0) return res.send('exit')
      res.send(news);
    });
  }
  else {
    News.find({'tag':post.tag}).skip(post.offset).limit(6).sort('-date').exec(function(err, news) {
      if (news.length == 0) return res.send('exit')
      res.send(news);
    });
  }
});


// ------------------------
// *** News Block ***
// ------------------------


app.get('/news/:id', function (req, res) {
  var id = req.params.id;

  News.find({'_id':id}).populate('events').exec(function(err, news) {
    if (!news) return res.render('error');
    res.render('news', {news: news[0]});
  });
});


// ------------------------
// *** Afisha Block ***
// ------------------------


app.get('/afisha/:position', function (req, res) {
  var position = req.params.position;
  var start = new Date();
  var end = new Date();

  if (position == 'current') {
    start.setDate(1);
    end.setFullYear(end.getFullYear(), (end.getMonth()+1), 0);
  }
  else if (position == 'next') {
    start.setFullYear(start.getFullYear(), (start.getMonth()+1), 1);
    end.setFullYear(end.getFullYear(), (end.getMonth()+2), 0);
  }
  else res.redirect('error')

  Schedule.find({'date': {'$gte': start, '$lt': end}}).sort('date').populate('events.event').exec(function(err, schedule) {
    Schedule.populate(schedule, {path:'events.event.members.m_id', model: 'Member'}, function(err, schedule) {
      // console.log(schedule[0].events[0].event.members)
      res.render('afisha', {schedule: schedule});
    });
  });
});


// ------------------------
// *** Event Block ***
// ------------------------


app.get('/event/:id', function (req, res) {
  var id = req.params.id;
  var start = new Date();
  var end = new Date();
  start.setDate(start.getDate() - 1);
  end.setFullYear(end.getFullYear(), (end.getMonth()+1), 0);

  Schedule.find({'date': {'$gte': start, '$lt': end}, 'events.event': id}, {'events.$': 1}).limit(10).select('date').sort('date').exec(function(err, schedule) {
    Event.find({'_id':id}).populate('children members.m_id').exec(function(err, event) {
       if (!event) return res.render('error');
      res.render('event', {event: event, schedule: schedule});
    });
  });
});


// ------------------------
// *** Member Block ***
// ------------------------


app.get('/member/:id', function (req, res) {
  var id = req.params.id;

  Member.findById(id, function(err, member){
    Event.find({'members.m_id': id}, {'members.$': 1}).select('ru').sort('-date').exec(function(err, events) {
      res.render('members/member.jade', {member:member, events: events})
    });
  });
});




// ------------------------
// *** Auth Block ***
// ------------------------


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


// ------------------------
// *** Add Event Block ***
// ------------------------


app.get('/auth/add/event', checkAuth, function (req, res) {
  Member.find(function(err, members) {
    res.render('auth/add/event.jade', {members: members});
  });
});

app.post('/auth/add/event', function(req, res) {
  var post = req.body;
  var files = req.files;
  var event = new Event();

  event.ru.title = post.ru.title;
  event.ru.s_title = post.ru.s_title;
  event.ru.body = post.ru.body;
  event.ru.ticket = post.ru.ticket;
  event.ru.comment = post.ru.comment;
  event.ru.p_author = post.ru.p_author;

  if (post.en) {
    event.en.title = post.en.title;
    event.en.s_title = post.en.s_title;
    event.en.body = post.en.body;
    event.en.ticket = post.en.ticket;
    event.en.comment = post.en.comment;
    event.en.p_author = post.en.p_author;
  };

  event.tag = post.tag;
  event.hall = post.event.hall;
  event.members = memberSplit(post.event.members);

  async.parallel({
    photo: function(callback) {
      if (files.photo.size != 0) {
        fs.readFile(files.photo.path, function (err, data) {
          fs.mkdir(__dirname + '/public/images/events/' + event._id, function() {
            var newPath = __dirname + '/public/images/events/' + event._id + '/photo.jpg';
            fs.writeFile(newPath, data, function (err) {
              event.photo = '/images/events/' + event._id + '/photo.jpg';
              fs.unlink(files.photo.path);
              callback(null, 1);
            });
          });
        });
      }
      else {
        callback(null, 0);
        fs.unlink(files.photo.path);
      }
    },
    poster: function(callback) {
      if (files.poster.size != 0) {
        fs.readFile(files.poster.path, function (err, data) {
          fs.mkdir(__dirname + '/public/images/events/' + event._id, function() {
            var newPath = __dirname + '/public/images/events/' + event._id + '/poster.jpg';
            fs.writeFile(newPath, data, function (err) {
              event.poster = '/images/events/' + event._id + '/poster.jpg';
              fs.unlink(files.poster.path);
              callback(null, 2);
            });
          });
        });
      }
      else {
        callback(null, 0);
        fs.unlink(files.poster.path);
      }
    }
  },
  function(err, results) {
    event.save(function(err) {
      res.redirect('back');
    });
  });
});


// ------------------------
// *** Edit Events Block ***
// ------------------------


app.get('/auth/edit/events', checkAuth, function (req, res) {
  Event.find().populate('children members.m_id').exec(function(err, event) {
    res.render('auth/edit/events', {event: event});
  });
});

app.get('/auth/edit/events/:id', checkAuth, function (req, res) {
  var id = req.params.id;

  Event.find({'_id':id}).populate('children members.m_id').exec(function(err, event) {
    Member.find().exec(function(err, members) {
      res.render('auth/edit/events/event.jade', {event: event[0], members: members});
    });
  });
});

app.post('/auth/edit/events/:id', function (req, res) {
  var id = req.params.id;
  var post = req.body;
  var files = req.files;

  Event.findById(id, function(err, event) {
    event.ru.title = post.ru.title;
    event.ru.s_title = post.ru.s_title;
    event.ru.body = post.ru.body;
    event.ru.ticket = post.ru.ticket;
    event.ru.comment = post.ru.comment;
    event.ru.p_author = post.ru.p_author;

    if (post.en) {
      event.en.title = post.en.title;
      event.en.s_title = post.en.s_title;
      event.en.body = post.en.body;
      event.en.ticket = post.en.ticket;
      event.en.comment = post.en.comment;
      event.en.p_author = post.en.p_author;
    }

    async.parallel({
      photo: function(callback) {
        if (files.photo.size != 0) {
          fs.readFile(files.photo.path, function (err, data) {
            fs.mkdir(__dirname + '/public/images/events/' + event._id, function() {
              var newPath = __dirname + '/public/images/events/' + event._id + '/photo.jpg';
              fs.writeFile(newPath, data, function (err) {
                event.photo = '/images/events/' + event._id + '/photo.jpg';
                fs.unlink(files.photo.path);
                callback(null, 1);
              });
            });
          });
        }
        else {
          callback(null, 0);
          fs.unlink(files.photo.path);
        }
      },
      poster: function(callback) {
        if (files.poster.size != 0) {
          fs.readFile(files.poster.path, function (err, data) {
            fs.mkdir(__dirname + '/public/images/events/' + event._id, function() {
              var newPath = __dirname + '/public/images/events/' + event._id + '/poster.jpg';
              fs.writeFile(newPath, data, function (err) {
                event.poster = '/images/events/' + event._id + '/poster.jpg';
                fs.unlink(files.poster.path);
                callback(null, 2);
              });
            });
          });
        }
        else {
          callback(null, 0);
          fs.unlink(files.poster.path);
        }
      }
    },
    function(err, results) {
      event.save(function(err) {
        res.redirect('/auth/edit/events');
      });
    });
  });
});


// ------------------------
// *** Add Schedule Block ***
// ------------------------


app.get('/auth/add/schedule/:year', checkAuth, function (req, res) {
  var year = req.params.year;
  var start = new Date(year,0,1)
  var end = new Date(year,11,31)

  Schedule.find({'date': {'$gte': start, '$lt': end}}).sort('-date').populate('events.event').exec(function(err, schedule) {
    res.render('auth/add/schedule/add.jade', {schedule: schedule, year: year});
  });
});

app.post('/auth/add/schedule/:year', function (req, res) {
  var post = req.body;

  if (post.del == 'true') {
    Schedule.findByIdAndRemove(post.id, function() {
      res.redirect('back');
    });
  }
  else {
    var schedule = new Schedule({
      date: new Date(post.schedule.year, post.schedule.month, post.schedule.date)
    });

    schedule.save(function(err) {
      res.redirect('back');
    });
  }

});

app.get('/auth/add/schedule/:year/:id', checkAuth, function (req, res) {
  var id = req.params.id;

  Event.find(function(err, events) {
    Schedule.find({'_id':id}).populate('events.event').exec(function(err, result) {
      res.render('auth/add/schedule/date.jade', {result: result, events: events});
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
});


// ------------------------
// *** Add News Block ***
// ------------------------


app.get('/auth/add/news', checkAuth, function (req, res) {
  Event.find().sort('-date').exec(function(err, events){
    res.render('auth/add/news.jade', {events: events});
  });
});

app.post('/auth/add/news', function (req, res) {
  var post = req.body;
  var files = req.files;
  var news = new News();

  news.ru.title = post.ru.title;
  news.ru.s_title = post.ru.s_title;
  news.ru.body = post.ru.body;
  news.ru.p_author = post.ru.p_author;

  if (post.en) {
    news.en.title = post.en.title;
    news.en.s_title = post.en.s_title;
    news.en.body = post.en.body;
    news.en.p_author = post.en.p_author;
  };

  news.tag = post.tag;
  if (post.events != '')
    news.events = post.events;
  else
    news.events = [];

  async.parallel({
    photo: function(callback) {
      if (files.photo.size != 0) {
        fs.readFile(files.photo.path, function (err, data) {
          fs.mkdir(__dirname + '/public/images/news/' + news._id, function() {
            var newPath = __dirname + '/public/images/news/' + news._id + '/photo.jpg';
            fs.writeFile(newPath, data, function (err) {
              news.photo = '/images/news/' + news._id + '/photo.jpg';
              fs.unlink(files.photo.path);
              callback(null, 1);
            });
          });
        });
      }
      else {
        callback(null, 0);
        fs.unlink(files.photo.path);
      }
    },
    poster: function(callback) {
      if (files.poster.size != 0) {
        fs.readFile(files.poster.path, function (err, data) {
          fs.mkdir(__dirname + '/public/images/news/' + news._id, function() {
            var newPath = __dirname + '/public/images/news/' + news._id + '/poster.jpg';
            fs.writeFile(newPath, data, function (err) {
              news.poster = '/images/news/' + news._id + '/poster.jpg';
              fs.unlink(files.poster.path);
              callback(null, 2);
            });
          });
        });
      }
      else {
        callback(null, 0);
        fs.unlink(files.poster.path);
      }
    }
  },
  function(err, results) {
    news.save(function(err) {
      res.redirect('back');
    });
  });
});


// ------------------------
// *** Edit News Block ***
// ------------------------


app.get('/auth/edit/news', checkAuth, function (req, res) {
  News.find().sort('-date').exec(function(err, news){
    res.render('auth/edit/news', {news: news});
  });
});

app.get('/auth/edit/news/:id', checkAuth, function (req, res) {
  var id = req.params.id;

  News.find({'_id':id}).populate('events').exec(function(err, news) {
    Event.find(function(err, events){
      res.render('auth/edit/news/e_news.jade', {news: news[0], events: events});
    });
  });
});

app.post('/auth/edit/news/:id', function (req, res) {
  var id = req.params.id;
  var post = req.body;
  var files = req.files;

  if (post.del == 'true') {
    News.findByIdAndRemove(id, function() {
      deleteFolderRecursive(__dirname + '/public/images/news/' + id);
      res.redirect('back');
    });
  }
  else {
    News.findById(id, function(err, news) {
      news.ru.title = post.ru.title;
      news.ru.s_title = post.ru.s_title;
      news.ru.body = post.ru.body;
      news.ru.p_author = post.ru.p_author;

      if (post.en) {
        news.en.title = post.en.title;
        news.en.s_title = post.en.s_title;
        news.en.body = post.en.body;
        news.en.p_author = post.en.p_author;
      }

      news.tag = post.tag;
      if (post.events != '')
        news.events = post.events;
      else
        news.events = [];

      async.parallel({
        photo: function(callback) {
          if (files.photo.size != 0) {
            fs.readFile(files.photo.path, function (err, data) {
              fs.mkdir(__dirname + '/public/images/news/' + news._id, function() {
                var newPath = __dirname + '/public/images/news/' + news._id + '/photo.jpg';
                fs.writeFile(newPath, data, function (err) {
                  news.photo = '/images/news/' + news._id + '/photo.jpg';
                  fs.unlink(files.photo.path);
                  callback(null, 1);
                });
              });
            });
          }
          else {
            callback(null, 0);
            fs.unlink(files.photo.path);
          }
        },
        poster: function(callback) {
          if (files.poster.size != 0) {
            fs.readFile(files.poster.path, function (err, data) {
              fs.mkdir(__dirname + '/public/images/news/' + news._id, function() {
                var newPath = __dirname + '/public/images/news/' + news._id + '/poster.jpg';
                fs.writeFile(newPath, data, function (err) {
                  news.poster = '/images/news/' + news._id + '/poster.jpg';
                  fs.unlink(files.poster.path);
                  callback(null, 2);
                });
              });
            });
          }
          else {
            callback(null, 0);
            fs.unlink(files.poster.path);
          }
        }
      },
      function(err, results) {
        news.save(function(err) {
          res.redirect('/auth/edit/news');
        });
      });
    });
  }
});


// ------------------------
// *** Add Member Block ***
// ------------------------


app.get('/auth/add/member', checkAuth, function (req, res) {
  res.render('auth/add/member.jade');
});

app.post('/auth/add/member', function (req, res) {
  var post = req.body;
  var files = req.files;
  var member = new Member();

  member.status = post.status;
  member.ru.name = post.ru.name;
  member.ru.description = post.ru.description;

  if (post.en) {
    member.en.name = post.en.name;
    member.en.description = post.en.description;
  }

  if (files.img.size != 0) {
    fs.readFile(files.img.path, function (err, data) {
      var newPath = __dirname + '/public/images/members/' + member._id + '.jpg';
      fs.writeFile(newPath, data, function (err) {
        member.img = '/images/members/' + member._id + '.jpg';
        member.save(function() {
          fs.unlink(files.img.path);
          res.redirect('back');
        });
      });
    });
  }
  else {
    member.save(function() {
      fs.unlink(files.img.path);
      res.redirect('back');
    });
  }
});


// ------------------------
// *** Edit Members Block ***
// ------------------------


app.get('/auth/edit/members', checkAuth, function (req, res) {
  Member.find().sort('-date').exec(function(err, members) {
    res.render('auth/edit/members', {members: members});
  });
});

app.get('/auth/edit/members/:id', checkAuth, function (req, res) {
  var id = req.params.id;

  Member.findById(id, function(err, member) {
    res.render('auth/edit/members/member.jade', {member: member});
  });
});


app.post('/auth/edit/members/:id', function (req, res) {
  var id = req.params.id;
  var post = req.body;
  var files = req.files;

  if (post.del == 'true') {
    Member.findByIdAndRemove(id, function() {
      fs.unlink(__dirname + '/public/images/members/' + id + '.jpg', function() {
        res.redirect('back');
      });
    });
  }
  else {
    Member.findById(id, function(err, member) {
      if (post.en) {
      member.en.name = post.en.name;
      member.en.description = post.en.description;
      }

      member.ru.name = post.ru.name;
      member.ru.description = post.ru.description;

      if (files.img.size != 0) {
        fs.readFile(files.img.path, function (err, data) {
          var newPath = __dirname + '/public/images/members/' + member._id + '.jpg';
          fs.writeFile(newPath, data, function (err) {
            member.img = '/images/members/' + member._id + '.jpg';
            member.save(function() {
              fs.unlink(files.img.path);
              res.redirect('/auth/edit/members');
            });
          });
        });
      }
      else {
        member.save(function() {
          fs.unlink(files.img.path);
          res.redirect('/auth/edit/members');
        });
      }
    });
  }
});


// ------------------------
// *** Login Block ***
// ------------------------


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


// ------------------------
// *** Static Block ***
// ------------------------


app.get('/institute', function (req, res) {
  res.render('static/institute.jade');
});

app.get('/now', function (req, res) {
  res.render('static/now.jade');
});

app.get('/halls', function (req, res) {
  res.render('static/halls.jade');
});

app.get('/fa83f41cd8b1.html', function (req, res) {
  res.render('fa83f41cd8b1');
});


// ------------------------
// *** Other Block ***
// ------------------------


app.get('/error', function (req, res) {
  res.render('error');
});

app.get('*', function(req, res){
  res.render('error');
});


app.listen(3000);
console.log('http://127.0.0.1:3000')