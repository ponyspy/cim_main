var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });

var express = require('express');
    var app = express();
var async = require('async');

var mongoose = require('mongoose');
  var models = require('./models/main.js');
mongoose.connect('localhost', 'main');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.pretty = true;
// app.use(express. favicon(__dirname + '/public/images/design/favicon.png'));
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


var User = models.User;
var Member = models.Member;
var Event = models.Event;
var News = models.News;
var Press = models.Press;
var Photo = models.Photo;
var Schedule = models.Schedule;


// ------------------------
// *** Midleware Block ***
// ------------------------


function checkAuth (req, res, next) {
  if (req.session.user_id)
    next();
  else
    res.redirect('/login');
}

function photoStream (req, res, next) {
  Photo.find().sort('-date').limit(3).exec(function(err, photos) {
    res.locals.photos = photos;
    next();
  });
}

function editPhotoStream (req, res, next) {
  Photo.find({'_id':req.params.id}).exec(function(err, photos) {
    res.locals.photos = photos;
    next();
  });
}


// ------------------------
// *** Handlers Block ***
// ------------------------


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


// ------------------------
// *** Post parms Block ***
// ------------------------


app.post('/photo_stream', function (req, res) {
  var post = req.body;

  Photo.find().sort('-date').skip(post.offset).limit(1).exec(function(err, photos) {
    if (!photos)
      res.send('false')
    else
      res.send(photos);
  });
});

app.post('/edit', function (req, res) {
  var files = req.files;
  var name = files.mf_file_undefined.path.slice(33);
  var newPath = __dirname + '/public/preview/' + name;
  gm(files.mf_file_undefined.path).resize(1120, false).quality(60).noProfile().write(newPath, function() {
    var path = {'path':'/preview/' + name}
    res.send(path);
  });
});

app.post('/mlist', function (req, res) {
  var post = req.body;

  Member.find({'status': post.status}).sort('-date').exec(function(err, members) {
    res.send(members);
  });
});


// ------------------------
// *** Main Block ***
// ------------------------


app.get('/', photoStream, function(req, res) {
  var start = new Date();
  var end = new Date();
  start.setDate(start.getDate()-1);
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


app.get('/news/:id', photoStream, function (req, res) {
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
    start.setDate(0);
    end.setFullYear(end.getFullYear(), (end.getMonth()+1), 0);
  }
  else if (position == 'next') {
    start.setFullYear(start.getFullYear(), (start.getMonth()+1), 0);
    end.setFullYear(end.getFullYear(), (end.getMonth()+2), 0);
  }
  else res.render('error');

  Schedule.find({'date': {'$gte': start, '$lte': end}}).sort('date').populate('events.event').exec(function(err, schedule) {
    Schedule.populate(schedule, {path:'events.event.members.m_id', model: 'Member'}, function(err, schedule) {
      res.render('afisha', {schedule: schedule, month: start.getMonth()+1});
    });
  });
});


// ------------------------
// *** Event Block ***
// ------------------------


app.get('/event/:id', photoStream, function (req, res) {
  var id = req.params.id;
  var start = new Date();
  var end = new Date();
  start.setDate(start.getDate() - 1);
  end.setFullYear(end.getFullYear(), (end.getMonth()+1), 0);

  Schedule.find({'date': {'$gte': start, '$lt': end}, 'events.event': id}, {'events.$': 1}).limit(10).select('date').sort('date').exec(function(err, schedule) {
    Press.find({'events': id}).sort('-date').exec(function(err, press) {
      Event.find({'_id':id}).populate('members.m_id').exec(function(err, event) {
         if (!event) return res.render('error');
        res.render('event', {event: event[0], schedule: schedule, press: press});
      });
    })
  });
});


// ------------------------
// *** Member Block ***
// ------------------------


app.get('/member/:id', photoStream, function (req, res) {
  var id = req.params.id;

  Member.findById(id, function(err, member) {
    if (!member) return res.render('error');
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


// ------------------------
// *** Add Event Block ***
// ------------------------


app.get('/auth/add/event', photoStream, checkAuth, function (req, res) {
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
  event.hall = post.hall;
  event.age = post.age;
  event.members = post.members;
  event.duration = post.duration;
  event.meta.columns = post.columns;

  if (post.img != 'null') {
    fs.mkdir(__dirname + '/public/images/events/' + event._id, function() {
      var newPath = __dirname + '/public/images/events/' + event._id + '/photo.jpg';
      gm(__dirname + '/public' + post.img).write(newPath, function() {
        event.photo = '/images/events/' + event._id + '/photo.jpg';
        fs.unlink(__dirname + '/public' + post.img);
        event.save(function() {
          res.redirect('back');
        });
      });
    });
  }
  else {
    event.save(function(err, event) {
      res.redirect('back');
    });
  }
});


// ------------------------
// *** Edit Events Block ***
// ------------------------


app.get('/auth/edit/events', checkAuth, function (req, res) {
  Event.find().sort('-date').exec(function(err, events) {
    res.render('auth/edit/events', {events: events});
  });
});

app.get('/auth/edit/events/:id', checkAuth, photoStream, function (req, res) {
  var id = req.params.id;

  Event.find({'_id':id}).populate('members.m_id').exec(function(err, event) {
    Member.find().exec(function(err, members) {
      res.render('auth/edit/events/event.jade', {event: event[0], members: members});
    });
  });
});

app.post('/rm_event', function (req, res) {
  var id = req.body.id;

  Schedule.update({'events.event':id}, { $pull: { 'events': { event: id } } }, { multi: true }).exec(function() {
    Event.findByIdAndRemove(id, function() {
      deleteFolderRecursive(__dirname + '/public/images/events/' + id);
      res.send('ok');
    });
  });
});

app.post('/auth/edit/events/:id', function (req, res) {
  var id = req.params.id;
  var post = req.body;
  var files = req.files;

  Event.findById(id, function(err, event) {

    event.members = post.members;
    event.tag = post.tag;
    event.hall = post.hall;
    event.age = post.age;
    event.duration = post.duration;
    event.meta.columns = post.columns;

    if (post.ru) {
      event.ru.title = post.ru.title;
      event.ru.s_title = post.ru.s_title;
      event.ru.body = post.ru.body;
      event.ru.ticket = post.ru.ticket;
      event.ru.comment = post.ru.comment;
      event.ru.p_author = post.ru.p_author;
    }

    if (post.en) {
      event.en.title = post.en.title;
      event.en.s_title = post.en.s_title;
      event.en.body = post.en.body;
      event.en.ticket = post.en.ticket;
      event.en.comment = post.en.comment;
      event.en.p_author = post.en.p_author;
    }

    if (post.img != 'null') {
      fs.mkdir(__dirname + '/public/images/events/' + event._id, function() {
        var newPath = __dirname + '/public/images/events/' + event._id + '/photo.jpg';
        gm(__dirname + '/public' + post.img).write(newPath, function() {
          event.photo = '/images/events/' + event._id + '/photo.jpg';
          fs.unlink(__dirname + '/public' + post.img);
          event.save(function() {
            res.send('ok_img');
          });
        });
      });
    }
    else {
      event.save(function(err, event) {
        res.send('ok')
      });
    }
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

  var schedule = new Schedule({
    date: new Date(post.schedule.year, post.schedule.month, post.schedule.date)
  });

  schedule.save(function(err) {
    res.redirect('back');
  });
});

app.post('/rm_schedule', function (req, res) {
  var id = req.body.id;

  Schedule.findByIdAndRemove(id, function() {
    res.send('ok');
  });
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
  news.status = post.status;
  if (post.events != '')
    news.events = post.events;
  else
    news.events = [];

  async.parallel({
    photo: function(callback) {
      if (files.photo.size != 0) {
        fs.mkdir(__dirname + '/public/images/news/' + news._id, function() {
          var newPath = __dirname + '/public/images/news/' + news._id + '/photo.jpg';
          gm(files.photo.path).resize(1120, false).quality(60).noProfile().write(newPath, function() {
            news.photo = '/images/news/' + news._id + '/photo.jpg';
            fs.unlink(files.photo.path);
            callback(null, 1);
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
        fs.mkdir(__dirname + '/public/images/news/' + news._id, function() {
          var newPath = __dirname + '/public/images/news/' + news._id + '/poster.jpg';
          gm(files.poster.path).resize(580, false).quality(60).noProfile().write(newPath, function() {
            news.poster = '/images/news/' + news._id + '/poster.jpg';
            fs.unlink(files.poster.path);
            callback(null, 2);
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

app.post('/rm_news', function (req, res) {
  var id = req.body.id;

  News.findByIdAndRemove(id, function() {
    deleteFolderRecursive(__dirname + '/public/images/news/' + id);
    res.send('ok');
  });
});

app.post('/auth/edit/news/:id', function (req, res) {
  var id = req.params.id;
  var post = req.body;
  var files = req.files;

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
    news.status = post.status;
    if (post.events != '')
      news.events = post.events;
    else
      news.events = [];

    async.parallel({
      photo: function(callback) {
        if (files.photo.size != 0) {
          fs.mkdir(__dirname + '/public/images/news/' + news._id, function() {
            var newPath = __dirname + '/public/images/news/' + news._id + '/photo.jpg';
            gm(files.photo.path).resize(1120, false).quality(60).noProfile().write(newPath, function() {
              news.photo = '/images/news/' + news._id + '/photo.jpg';
              fs.unlink(files.photo.path);
              callback(null, 1);
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
          fs.mkdir(__dirname + '/public/images/news/' + news._id, function() {
            var newPath = __dirname + '/public/images/news/' + news._id + '/poster.jpg';
            gm(files.poster.path).resize(580, false).quality(60).noProfile().write(newPath, function() {
              news.poster = '/images/news/' + news._id + '/poster.jpg';
              fs.unlink(files.poster.path);
              callback(null, 2);
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
});


// ------------------------
// *** Add Press Block ***
// ------------------------


app.get('/auth/add/press', checkAuth, function (req, res) {
  Event.find().sort('-date').exec(function(err, events) {
    res.render('auth/add/press.jade', {events: events});
  });
});

app.post('/auth/add/press', function (req, res) {
  var post = req.body;
  var press = new Press();

  press.ru.author = post.ru.author;
  press.ru.body = post.ru.body;
  press.link = post.link;

  if (post.en) {
    press.en.author = post.en.author;
    press.en.body = post.en.body;
  };

  if (post.events != '')
    press.events = post.events;
  else
    press.events = [];

  press.save(function(err) {
    res.redirect('back');
  });
});


// ------------------------
// *** Edit Press Block ***
// ------------------------


app.get('/auth/edit/press', checkAuth, function (req, res) {
  Press.find().sort('-date').exec(function(err, press){
    res.render('auth/edit/press', {press: press});
  });
});

app.get('/auth/edit/press/:id', checkAuth, function (req, res) {
  var id = req.params.id;

  Press.find({'_id':id}).populate('events').exec(function(err, press) {
    Event.find(function(err, events){
      res.render('auth/edit/press/e_press.jade', {press: press[0], events: events});
    });
  });
});

app.post('/rm_press', function (req, res) {
  var id = req.body.id;

  Press.findByIdAndRemove(id, function() {
    res.send('ok');
  });
});

app.post('/auth/edit/press/:id', function (req, res) {
  var post = req.body;
  var id = req.params.id;

  Press.findById(id, function(err, press) {
    press.ru.author = post.ru.author;
    press.ru.body = post.ru.body;
    press.link = post.link;

    if (post.en) {
      press.en.author = post.en.author;
      press.en.body = post.en.body;
    };

    if (post.events != '')
      press.events = post.events;
    else
      press.events = [];

    press.save(function(err) {
      res.redirect('back');
    });
  });
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
    var newPath = __dirname + '/public/images/members/' + member._id + '.jpg';
    gm(files.img.path).resize(1120, false).quality(60).noProfile().write(newPath, function() {
      member.img = '/images/members/' + member._id + '.jpg';
      member.save(function() {
        fs.unlink(files.img.path);
        res.redirect('back');
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

app.post('/rm_member', function (req, res) {
  var id = req.body.id;

  Event.update({'members.m_id':id}, { $pull: { 'members': { m_id: id } } }, { multi: true }).exec(function() {
    Member.findByIdAndRemove(id, function() {
      fs.unlink(__dirname + '/public/images/members/' + id + '.jpg', function() {
        res.send('ok');
      });
    });
  });
});

app.post('/auth/edit/members/:id', function (req, res) {
  var id = req.params.id;
  var post = req.body;
  var files = req.files;

  Member.findById(id, function(err, member) {
    member.ru.name = post.ru.name;
    member.ru.description = post.ru.description;

    if (post.en) {
      member.en.name = post.en.name;
      member.en.description = post.en.description;
    }

    if (files.img.size != 0) {
      var newPath = __dirname + '/public/images/members/' + member._id + '.jpg';
      gm(files.img.path).resize(1120, false).quality(60).noProfile().write(newPath, function() {
        member.img = '/images/members/' + member._id + '.jpg';
        member.save(function() {
          fs.unlink(files.img.path);
          res.redirect('/auth/edit/members');
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
});


// ------------------------
// *** Add Photo Block ***
// ------------------------


app.get('/auth/add/photo', photoStream, checkAuth, function (req, res) {
  res.render('auth/add/photo.jade');
});

app.post('/auth/add/photo', function (req, res) {
  var post = req.body;
  var files = req.files;
  var photo = new Photo();

  photo.ru.description = post.ru.description;
  photo.ru.author = post.ru.author;

  photo.style = post.style;

  if (post.en) {
    photo.en.description = post.en.description;
    photo.en.author = post.en.author;
  }

  if (files.img.size != 0) {
    var newPath = __dirname + '/public/images/photo_stream/' + photo._id + '.jpg';
    gm(files.img.path).resize(2200, false).quality(60).noProfile().write(newPath, function() {
      photo.image = '/images/photo_stream/' + photo._id + '.jpg';
      photo.save(function() {
        fs.unlink(files.img.path);
        res.redirect('back');
      });
    });
  }
  else {
    photo.save(function() {
      fs.unlink(files.img.path);
      res.redirect('back');
    });
  }
});


// ------------------------
// *** Edit Photos Block ***
// ------------------------


app.get('/auth/edit/photos', checkAuth, function (req, res) {
  Photo.find().sort('-date').exec(function(err, photos){
    res.render('auth/edit/photos', {photos: photos});  // broken var name photos
  });
});

app.get('/auth/edit/photos/:id', checkAuth, editPhotoStream, function (req, res) {
  var id = req.params.id;

  Photo.findById(id, function(err, photo) {
    res.render('auth/edit/photos/photo.jade', {photo: photo});
  });
});

app.post('/rm_photo', function (req, res) {
  var id = req.body.id;

  Photo.findByIdAndRemove(id, function() {
    fs.unlink(__dirname + '/public/images/photo_stream/' + id + '.jpg', function() {
      res.send('ok');
    });
  });
});

app.post('/auth/edit/photos/:id', function (req, res) {
  var id = req.params.id;
  var post = req.body;
  var files = req.files;

  if (post.del == 'true') {
    Photo.findByIdAndRemove(id, function() {
      fs.unlink(__dirname + '/public/images/photo_stream/' + id + '.jpg', function() {
        res.redirect('back');
      });
    });
  }
  else {
    Photo.findById(id, function(err, photo) {
      photo.style = post.style;
      photo.ru.author = post.ru.author;
      photo.ru.description = post.ru.description;

      if (post.en) {
        photo.en.author = post.en.author;
        photo.en.description = post.en.description;
      }

      if (files.img.size != 0) {
        var newPath = __dirname + '/public/images/photo_stream/' + photo._id + '.jpg';
        gm(files.img.path).resize(2200, false).quality(60).noProfile().write(newPath, function() {
          photo.img = '/images/photo_stream/' + photo._id + '.jpg';
          photo.save(function() {
            fs.unlink(files.img.path);
            res.redirect('/auth/edit/photos');
          });
        });
      }
      else {
        photo.save(function() {
          fs.unlink(files.img.path);
          res.redirect('/auth/edit/photos');
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


// app.get('/registr', function(req, res) {
//   if (!req.session.user_id)
//     res.render('registr');
//   else
//     res.redirect('/');
// });


// app.post('/registr', function (req, res) {
//   var post = req.body;

//   var user = new User({
//     login: post.login,
//     password: post.password,
//     email: post.email
//   });

//   user.save(function(err, user) {
//     if(err) {throw err;}
//     console.log('New User created');
//     req.session.user_id = user._id;
//     req.session.login = user.login;
//     req.session.status = user.status;
//     res.redirect('/login');
//   });
// });


// ------------------------
// *** Static Block ***
// ------------------------

app.get('/contacts', photoStream, function (req, res) {
  res.render('static/contacts.jade');
});

app.get('/institute', photoStream, function (req, res) {
  res.render('static/institute.jade');
});

app.get('/now', photoStream, function (req, res) {
  res.render('static/now.jade');
});

app.get('/halls', photoStream, function (req, res) {
  res.render('static/halls.jade');
});

app.get('/fokin', photoStream, function (req, res) {
  res.render('static/fokin.jade');
});

app.get('/history', photoStream, function (req, res) {
  res.render('static/history.jade');
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

app.get('*', function(req, res) {
  res.render('error');
});


app.listen(3000);
console.log('http://127.0.0.1:3000')