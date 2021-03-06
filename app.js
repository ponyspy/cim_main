var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });
var async = require('async');

var express = require('express')
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    multer = require('multer');
    var app = express();

var mongoose = require('mongoose');
  var models = require('./models/main.js');
mongoose.connect('localhost', 'main');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(multer({ dest: __dirname + '/uploads'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

if (process.env.NODE_ENV != 'production') {
  app.set('json spaces', 2);
  app.locals.pretty = true;
  app.use(express.static(__dirname + '/public'));
}

app.use(express.session({
  key: 'session',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use(function(req, res, next) {
  if (req.accepted[0].type == 'text') {
    var start = new Date();
        start.setDate(1);
    var time_zone = 3 * 60 * 60 * 1000;

    Schedule.aggregate()
      .match({
        'date': { $gte: start }
      })
      .group({
        '_id': {
          year: { $year: { $add: ['$date', time_zone] } },
          month: { $month: { $add: ['$date', time_zone] } }
        }
      })
      .sort('_id.year _id.month')
      .project({
        _id: 0,
        month: '$_id.month',
        year: '$_id.year'
      })
      .exec(function(err, items) {
        res.locals.afisha_items = items;
        next();
      });
  } else {
    res.locals.afisha_items = [];
    next();
  }
});

app.use(app.router);

app.use(function(req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('error', { url: req.url, status: 404 });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
      res.send({
      error: {
        status: 'Not found'
      }
    });
    return;
  }

  // default to plain-text
  res.type('txt').send('Not found');
});

app.use(function(err, req, res, next) {
  var status = err.status || 500;

  res.status(status);
  res.render('error', { error: err, status: status });
});


// -------------------
// *** Model Block ***
// -------------------


var User = models.User;
var Member = models.Member;
var Event = models.Event;
var News = models.News;
var Press = models.Press;
var Partner = models.Partner;
var Photo = models.Photo;
var Schedule = models.Schedule;
var Project = models.Project;
var Content = models.Content;


// ------------------------
// *** Midleware Block ***
// ------------------------


function checkAuth (req, res, next) {
  if (req.session.user_id)
    next();
  else
    res.redirect('/login');
}

function checkPartner (req, res, next) {
  var properties = req.params.path.split('&');
  var params = splitParams(properties);

  Partner.find({'secret': params.secret}).exec(function(err, partner) {
    if (!partner) {
      res.send({ error: { status: 'Key Not Found'} });
    }
    else if (partner.length != 0 && partner[0].services.api == true) {
      next();
    }
    else {
      res.send({ error: { status: 'Not Key Param'} });
    }
  });
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
      if(fs.statSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

function splitParams (properties) {
  var params = {};

  properties.forEach(function(property) {
    var tup = property.split('=');
    params[tup[0]] = tup[1];
  });

  return params;
}


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

app.post('/upload', function (req, res) {
  var files = req.files;
  var ext = req.files.photo.name.split('.')[1];
  var name = new Date();
  name = name.getTime();

  var newPath = __dirname + '/public/preview/' + name + '.' + ext;
  gm(files.photo.path).resize(1120, false).quality(60).noProfile().write(newPath, function() {
    res.send('/preview/' + name + '.' + ext);
  });
});

app.post('/new_member', function (req, res) {
  var post = req.body;
  var member = new Member();

  member.ru.name = post.ru.name;
  member.status = post.status;
  member.save(function(err, member) {
    res.send(member._id);
  });
});

app.post('/photo_remove', function (req, res) {
  fs.unlink(__dirname + '/public' + req.body.path, function() {
    res.send(req.body.path);
  });
});

app.post('/mlist', function (req, res) {
  var post = req.body;

  Member.find({'status': post.status}).sort('-date').exec(function(err, members) {
    res.send(members);
  });
});

app.post('/auth/edit/content/:id/content_edit', function (req, res) {
  var id = req.params.id;
  var post = req.body;

  Content.findById(id).exec(function(err, content) {
    content.ru.sections = post.sections;

    content.save(function(err, content) {
      res.send('ok');
    });
  });
});


// ------------------------
// *** API Block ***
// ------------------------


app.get('/api/v1/:path', checkPartner, function(req, res) {
  var properties = req.params.path.split('&');
  var params = splitParams(properties);

  if (params.location == 'events') {
    var query = params.id ? {'_id': params.id} : {}
    var exclude = params.fields ? params.fields.replace(/\,/g,' ') : '-__v -meta.columns.one -meta.columns.two -en -date -members._id';
    var populated = params.populate == 'true' ? 'members.m_id' : '';

    Event.find(query, exclude).populate(populated).sort(params.sort).skip(params.skip).limit(params.limit || 10).exec(function(err, events) {
      res.send(events);
    });
  }

  else if (params.location == 'schedule') {
    var exclude = params.fields ? params.fields.replace(/\,/g,' ') : '-__v';
    var populated = params.populate == 'true' ? 'event' : '';
    var def = new Date();

    var start = params.start ? new Date(+params.start) : new Date();
    var end = params.end ? new Date(+params.end) : new Date(def.setFullYear(def.getFullYear(), (def.getMonth()+1), 0));

    var time_zone = 3 * 60 * 60 * 1000;
    var Query = params.id
      ? Schedule.findById(params.id, exclude).populate(populated)
      : Schedule.aggregate()
          .match({
            'date': {
              $gte: start,
              $lte: end
            }
          })
          .group({
            '_id': {
              year: { $year: { $add: ['$date', time_zone] } },
              month: { $month: { $add: ['$date', time_zone] } },
              date: { $dayOfMonth: { $add: ['$date', time_zone] } }
            },
            'events': {
              $push: {
                _show_id: '$_id',
                _event_id: '$event',
                time: {
                  hours: { $hour: { $add: ['$date', time_zone] } },
                  minutes: { $minute: { $add: ['$date', time_zone] } }
                },
                meta: '$meta'
              }
            }
          })
          .sort('_id.date')
          .project({
            '_id': 0,
            'schedule': '$_id',
            'events': '$events'
          });

    Query.exec(function(err, schedule) {
      res.send(schedule);
    });
  }

  else res.send({ error: { status: 'Wrong Location'} });
});

app.get('/api/doc/:secret', photoStream, function (req, res, next) {
  var secret = req.params.secret;

  Partner.find({'secret': secret}).exec(function(err, partner) {
    if (partner.length != 0 && partner[0].services.api == true) {
      res.render('static/api.jade', {secret: secret});
    }
    else {
      next(err);
    }
  });
});


// ------------------------
// *** Main Block ***
// ------------------------


app.get('/', photoStream, function(req, res) {
  var now = new Date();
  var start = new Date();
  var end = new Date()
  start.setHours(0,0,0);
  end.setHours(23, 59, 0);

  start.setDate(start.getDate() - 1);
  end.setFullYear(end.getFullYear(), (end.getMonth() + 1), 0);

  Schedule.find().where('date').gte(start).lt(end).where('meta.banner').equals(true).populate('event').exec(function(err, schedule) {
    News.find().where('date').lte(now).sort('-date').limit(6).exec(function(err, news) {
      News.find().sort('-date').where('status').equals('pin').exec(function(err, pins) {
        res.render('index', {news: news, schedule: schedule, pins: pins});
      });
    });
  });
});

app.post('/', function (req, res) {
  var post = req.body;
  var query = post.tag != 'all' ? {'tag': post.tag} : {}
  var now = new Date();

  News.find(query).where('date').lte(now).skip(post.offset).limit(6).sort('-date').exec(function(err, news) {
    if (news.length == 0) return res.send('exit')
    res.send(news);
  });
});


// ------------------------
// *** News Block ***
// ------------------------


app.get('/news/:id', photoStream, function (req, res, next) {
  var id = req.params.id;

  News.find({'_id':id}).populate('events').exec(function(err, news) {
    if (!news) return next(err);
    res.render('news', {news: news[0]});
  });
});


// ------------------------
// *** Afisha Block ***
// ------------------------


app.get('/afisha/:year/:month', function (req, res) {
  var year = req.params.year;
  var month = req.params.month - 1;
  var start = new Date(year, month, 1);
  var end = new Date(year, (month + 1), 0);
  end.setHours(23, 59, 0);
  var time_zone = 3 * 60 * 60 * 1000;

  Schedule.aggregate()
    .match({
      'date': {
        $gte: start,
        $lte: end
      }
    })
    .sort({'date': 1})
    .group({
      '_id': {
        year: { $year: { $add: ['$date', time_zone] } },
        month: { $month: { $add: ['$date', time_zone] } },
        date: { $dayOfMonth: {$add: ['$date', time_zone]} },
        day: { $dayOfWeek: {$add: ['$date', time_zone]} }
      },
      'events': {
        $push: {
          _show_id: '$_id',
          time: {
            hours: { $hour: {$add: ['$date', time_zone]} },
            minutes: { $minute: {$add: ['$date', time_zone]} }
          },
          meta: '$meta',
          event: '$event'
        }
      }
    })
    .sort('_id.date')
    .project({
      '_id': 0,
      'show': '$_id',
      'events': '$events'
    })
    .exec(function(err, schedule) {
      Schedule.populate(schedule, {path:'events.event', model: 'Event'}, function(err, schedule) {
        Schedule.populate(schedule, {path:'events.event.members.m_id', model: 'Member'}, function(err, schedule) {
          Project.find().exec(function(err, projects) {
            res.render('afisha', {schedule: schedule, projects: projects, month: month, year: year});
          });
        });
      });
    });

});


// ------------------------
// *** Event Block ***
// ------------------------


app.get('/event/:id', photoStream, function (req, res, next) {
  var id = req.params.id;
  var start = new Date();
  var end = new Date();
  start.setDate(start.getDate() - 1);
  end.setFullYear(end.getFullYear(), (end.getMonth()+3), 0);

  Schedule.find({'date': {'$gte': start, '$lt': end}, 'event': id}).limit(10).sort('date').exec(function(err, schedule) {
    Press.find({'events': id}).sort('-date').exec(function(err, press) {
      Event.findById(id).populate('members.m_id partners').exec(function(err, event) {
         if (!event) return next(err);
        res.render('event', {event: event, schedule: schedule, press: press});
      });
    });
  });
});


// ------------------------
// *** Members Block ***
// ------------------------


app.get('/member', photoStream, function (req, res) {
  Member.find({}, '-ru.description -date -__v').sort('ru.name').lean().exec(function(err, members) {
    // members = members.sort(function(a, b) {var srt = a.ru.name.toLowerCase() > b.ru.name.toLowerCase() ? 1 : -1; return srt});
    res.render('members', {members: members});
  });
});


// ------------------------
// *** Member Block ***
// ------------------------


app.get('/member/:id', photoStream, function (req, res, next) {
  var id = req.params.id;

  Member.findById(id, function(err, member) {
    if (!member) return next(err);
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
    Partner.find(function(err, partners) {
      res.render('auth/add/event.jade', {members: members, partners: partners});
    });
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

  if (post.en) {
    event.en.title = post.en.title;
    event.en.s_title = post.en.s_title;
    event.en.body = post.en.body;
    event.en.ticket = post.en.ticket;
    event.en.comment = post.en.comment;
  };

  event.trailers = post.trailers;
  event.category = post.category;
  event.hall = post.hall;
  event.age = post.age;
  event.members = post.members;
  event.duration = post.duration;
  event.meta.columns = post.columns;
  event.partners = post.partners;


  if (post.images) {
    fs.mkdir(__dirname + '/public/images/events/' + event._id, function() {
      fs.mkdir(__dirname + '/public/images/events/' + event._id + '/photos', function() {
        async.forEach(post.images, function(image, callback) {
          var pubPath = __dirname + '/public';
          var newPath = '/images/events/' + event._id + '/photos/' + image.path.split('/')[2];

          gm(pubPath + image.path).write(pubPath + newPath, function() {
            image.path = newPath;
            callback();
          });

        }, function() {
          event.photos = post.images;
          event.save(function(err, event) {
            res.redirect('back');
          });
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
  var images_preview = [];

  Event.findById(id).populate('members.m_id partners').exec(function(err, event) {
    if (!event) return next(err);
    Member.find().exec(function(err, members) {
      Partner.find().where('_id').nin(event.partners.map(function(partner) {return partner._id})).exec(function(err, partners) {
        async.forEach(event.photos, function(photo, callback) {
          var name = photo.path.split('/')[5];
          fs.createReadStream(__dirname + '/public/' + photo.path).pipe(fs.createWriteStream(__dirname + '/public/preview/' + name));
          images_preview.push('/preview/' + name);
          callback();
        }, function() {
          res.render('auth/edit/events/event.jade', {event: event, images_preview: images_preview, members: members, partners: partners});
        });
      });
    });
  });
});

app.post('/rm_event', function (req, res) {
  var id = req.body.id;

  Project.update({'events.event':id}, { $pull: { 'events': { event: id } } }, { multi: true }).exec(function() {
    Schedule.remove({'event': id}).exec(function() {
      Event.findByIdAndRemove(id, function() {
        deleteFolderRecursive(__dirname + '/public/images/events/' + id);
        res.send('ok');
      });
    });
  });
});

app.post('/auth/edit/events/:id', function (req, res, next) {
  var id = req.params.id;
  var post = req.body;
  var files = req.files;

  Event.findById(id, function(err, event) {

    event.trailers = post.trailers;
    event.category = post.category;
    event.members = post.members;
    event.hall = post.hall;
    event.age = post.age;
    event.duration = post.duration;
    event.meta.columns = post.columns;
    event.partners = post.partners;

    if (post.ru) {
      event.ru.title = post.ru.title;
      event.ru.s_title = post.ru.s_title;
      event.ru.body = post.ru.body;
      event.ru.ticket = post.ru.ticket;
      event.ru.comment = post.ru.comment;
    }

    if (post.en) {
      event.en.title = post.en.title;
      event.en.s_title = post.en.s_title;
      event.en.body = post.en.body;
      event.en.ticket = post.en.ticket;
      event.en.comment = post.en.comment;
    }

    if (post.images) {
      fs.mkdir(__dirname + '/public/images/events/' + event._id, function() {
        fs.mkdir(__dirname + '/public/images/events/' + event._id + '/photos', function() {
          async.forEach(post.images, function(image, callback) {
            var pubPath = __dirname + '/public';
            var newPath = '/images/events/' + event._id + '/photos/' + image.path.split('/')[2];

            gm(pubPath + image.path).write(pubPath + newPath, function() {
              image.path = newPath;
              callback();
            });

          }, function() {
            event.photos = post.images;
            event.save(function(err, event) {
              res.redirect('back');
            });

          });
        });
      });
    }
    else {
      event.photos = [];
      event.save(function(err, event) {
        res.redirect('back');
      });
    }
  });
});


// ------------------------
// *** Add Project Block ***
// ------------------------


app.get('/auth/add/project', checkAuth, function (req, res) {
  Event.find().sort('-date').exec(function(err, events) {
    res.render('auth/add/project.jade', {events: events});
  });
});

app.post('/auth/add/project', function (req, res) {
  var post = req.body;
  var files = req.files;
  var project = new Project();

  project.ru.title = post.ru.title;
  project.ru.description = post.ru.description;

  if (post.en) {
    project.en.title = post.en.title;
    project.en.description = post.en.description;
  };

  if (post.events != '')
    project.events = post.events;
  else
    project.events = [];

  project.save(function(err) {
    res.redirect('back');
  });
});


// ------------------------
// *** Edit Project Block ***
// ------------------------


app.get('/auth/edit/projects', checkAuth, function (req, res) {
  Project.find().sort('-date').exec(function(err, projects) {
    res.render('auth/edit/projects', {projects: projects});
  });
});

app.get('/auth/edit/projects/:id', checkAuth, function (req, res, next) {
  var id = req.params.id;

  Project.find({'_id': id}).sort('-date').populate('events').exec(function(err, projects) {
    if (!projects) return next(err);
    Event.find().sort('-date').exec(function(err, events) {
      res.render('auth/edit/projects/e_project.jade', {project: projects[0], events: events});
    });
  });
});

app.post('/rm_project', function (req, res) {
  var id = req.body.id;

  Project.findByIdAndRemove(id, function() {
    res.send('ok');
  });
});

app.post('/auth/edit/projects/:id', function (req, res) {
  var post = req.body;
  var id = req.params.id;

  Project.findById(id, function(err, project) {
    project.ru.title = post.ru.title;
    project.ru.description = post.ru.description;

    if (post.en) {
      project.en.title = post.en.title;
      project.en.description = post.en.description;
    };

    if (post.events != '')
      project.events = post.events;
    else
      project.events = [];

    project.save(function(err) {
      res.redirect('back');
    });
  });
});


// ------------------------
// *** Add Content Block ***
// ------------------------


app.get('/auth/add/content', checkAuth, function (req, res) {
  res.render('auth/add/content.jade');
});

app.post('/auth/add/content', function (req, res) {
  var post = req.body;
  var files = req.files;
  var content = new Content();

  content.ru.title = post.ru.title;
  content.ru.meta.title = post.ru.meta.title;
  content.ru.meta.menu = post.ru.meta.menu;
  content.alias = post.alias;

  if (post.en) {
    content.en.title = post.en.title;
  };

  content.save(function(err) {
    res.redirect('back');
  });
});


// ------------------------
// *** Edit Content Block ***
// ------------------------


app.get('/auth/edit/content', checkAuth, function (req, res) {
  Content.find().sort('-date').exec(function(err, content) {
    res.render('auth/edit/content', {content: content});
  });
});

app.get('/auth/edit/content/:id', checkAuth, function (req, res, next) {
  var id = req.params.id;

  Content.findById(id).exec(function(err, content) {
    if (!content) return next(err);
    res.render('auth/edit/content/e_content.jade', {content: content});
  });
});

app.post('/rm_content', function (req, res) {
  var id = req.body.id;

  Content.findByIdAndRemove(id, function() {
    res.send('ok');
  });
});

app.post('/auth/edit/content/:id', function (req, res) {
  var post = req.body;
  var id = req.params.id;

  Content.findById(id, function(err, content) {
    content.ru.title = post.ru.title;
    content.ru.meta.title = post.ru.meta.title;
    content.ru.meta.menu = post.ru.meta.menu;
    content.alias = post.alias;

    if (post.en) {
      content.en.title = post.en.title;
    };

    content.save(function(err) {
      res.redirect('back');
    });
  });
});

app.get('/auth/edit/content/:id/content_edit', checkAuth, photoStream, function (req, res, next) {
  var id = req.params.id;

  Content.findById(id).exec(function(err, content) {
    if (!content) return next(err);
    res.render('auth/edit/content/c_editor.jade', {content: content});
  });
});


// ------------------------
// *** Add Schedule Block ***
// ------------------------


app.get('/auth/schedule', checkAuth, function (req, res) {
  var start = new Date();
  start = start.setHours(0, 0, 0);
  var end = new Date();
  end = end.setHours(23, 59, 0);

  Schedule.find({'date': {'$gte': start, '$lte': end}}).sort('-date').populate('event').exec(function(err, schedule) {
    Event.find().sort('-date').exec(function(err, events) {
      res.render('auth/schedule.jade', {schedule: schedule, events: events});
    });
  });
});


app.post('/auth/schedule/get', checkAuth, function (req, res) {
  var post = req.body;

  var start = new Date(+post.date);
  start = start.setHours(0, 0, 0);
  var end = new Date(+post.date);
  end = end.setHours(23, 59, 0);

  Schedule.find({'date': {'$gte': start, '$lte': end}}).sort('-date').populate('event').exec(function(err, schedule) {
    res.send(schedule);
  });
});


app.post('/auth/schedule/add', checkAuth, function (req, res) {
  var post = req.body;
  var item = new Schedule();

  item.date = new Date(+post.date);
  item.event = post.event;
  item.meta = post.meta;

  item.save(function(err, item) {
    Event.populate(item, {path:'event', model: 'Event'}, function(err, item) {
      res.send(item);
    });
  });
});


app.post('/auth/schedule/remove', checkAuth, function (req, res) {
  var post = req.body;

  Schedule.remove().where('_id').in(post.items).exec(function(err, items) {
    res.send('ok');
  });
});

app.post('/auth/schedule/edit', checkAuth, function (req, res) {
  var post = req.body;

  async.forEachSeries(post.items, function(item, callback) {
    Schedule.findById(item.id).exec(function(err, sh) {

      sh.date = new Date(sh.date.getFullYear(), sh.date.getMonth(), sh.date.getDate(), item.hours, item.minutes);
      sh.meta = item.meta;

      sh.save(function(err, sh) {
        callback();
      });
    });
  }, function() {
    res.send('ok');
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

  news.date = new Date(post.date.year, post.date.month, post.date.date)
  news.tag = post.tag;
  news.status = post.status;
  news.events = post.events != '' ? post.events : []

  async.parallel({
    photo: function(callback) {
      if (files.photo) {
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
      }
    },
    poster: function(callback) {
      if (files.poster) {
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

  News.find({'_id': id}).populate('events').exec(function(err, news) {
    if (!news) return next(err);
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

    news.date = new Date(post.date.year, post.date.month, post.date.date)
    news.tag = post.tag;
    news.status = post.status;
    news.events = post.events != '' ? post.events : []

    async.parallel({
      photo: function(callback) {
        if (files.photo) {
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
        }
      },
      poster: function(callback) {
        if (files.poster) {
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

  if (post.en) {
    press.en.author = post.en.author;
    press.en.body = post.en.body;
  };

  press.link = post.link;
  press.events = post.events != '' ? post.events : []

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
    if (!press) return next(err);
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

    if (post.en) {
      press.en.author = post.en.author;
      press.en.body = post.en.body;
    };

    press.link = post.link;
    press.events = post.events != '' ? post.events : []

    press.save(function(err) {
      res.redirect('back');
    });
  });
});


// ------------------------
// *** Add Partner Block ***
// ------------------------


app.get('/auth/add/partner', checkAuth, function (req, res) {
  res.render('auth/add/partner.jade');
});

app.post('/auth/add/partner', function (req, res) {
  var post = req.body;
  var files = req.files;
  var partner = new Partner();

  partner.ru.name = post.ru.name;
  partner.ru.description = post.ru.description;
  partner.link = post.link;
  partner.services = post.services;
  partner.meta = post.meta;

  if (post.en) {
    partner.en.name = post.en.name;
    partner.en.description = post.en.description;
  };

  if (files.logo) {
    var newPath = __dirname + '/public/images/partners/' + partner._id + '.jpg';
    gm(files.logo.path).resize(220, false).noProfile().command('convert', 'JPG').write(newPath, function() {
      partner.logo = '/images/partners/' + partner._id + '.jpg';
      fs.unlink(files.logo.path);
      partner.save(function(err) {
        res.redirect('back');
      });
    });
  }
  else {
    partner.save(function(err) {
      res.redirect('back');
    });
  }
});


// ------------------------
// *** Edit Partners Block ***
// ------------------------


app.get('/auth/edit/partners', checkAuth, function (req, res) {
  Partner.find().sort('-date').exec(function(err, partners) {
    res.render('auth/edit/partners', {partners: partners});
  });
});

app.get('/auth/edit/partners/:id', checkAuth, function (req, res) {
  var id = req.params.id;

  Partner.find({'_id': id}).exec(function(err, partner) {
    if (!partner) return next(err);
    res.render('auth/edit/partners/partner.jade', {partner: partner[0]});
  });
});

app.post('/rm_partner', function (req, res) {
  var id = req.body.id;

  Event.update({'partners':id}, { $pull: { 'partners': id } }, { multi: true }).exec(function() {
    Partner.findByIdAndRemove(id, function() {
      fs.unlink(__dirname + '/public/images/partners/' + id + '.jpg', function() {
        res.send('ok');
      });
    });
  });
});

app.post('/auth/edit/partners/:id', function (req, res) {
  var id = req.params.id;
  var post = req.body;
  var files = req.files;

  Partner.findById(id, function(err, partner) {

    partner.ru.name = post.ru.name;
    partner.ru.description = post.ru.description;
    partner.link = post.link;
    partner.services = post.services;
    partner.meta = post.meta;

    if (post.en) {
      partner.en.name = post.en.name;
      partner.en.description = post.en.description;
    };

    if (files.logo) {
      var newPath = __dirname + '/public/images/partners/' + partner._id + '.jpg';
      gm(files.logo.path).resize(220, false).noProfile().command('convert', 'JPG').write(newPath, function() {
        partner.logo = '/images/partners/' + partner._id + '.jpg';
        fs.unlink(files.logo.path);
        partner.save(function(err) {
          res.redirect('back');
        });
      });
    }
    else {
      partner.save(function(err) {
        res.redirect('back');
      });
    }
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

  if (files.img) {
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
    member.status = post.status;

    if (post.en) {
      member.en.name = post.en.name;
      member.en.description = post.en.description;
    }

    if (files.img) {
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

  if (files.img) {
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
    if (!photo) return next(err);
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

      if (files.img) {
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
  req.session.destroy();
  res.clearCookie('session');
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

// app.get('/now', photoStream, function (req, res) {
//   res.render('static/now.jade');
// });

app.get('/now', photoStream, function (req, res) {
  var id = '5450eed389a6c5f3350027f3';
  Content.findById(id).exec(function(err, content) {
    if (!content) return next(err);
    res.render('content', {content: content});
  });
});

app.get('/fokin', photoStream, function (req, res) {
  res.render('static/fokin.jade');
});

app.get('/history', photoStream, function (req, res) {
  res.render('static/history.jade');
});


// ------------------------
// *** Content Block ***
// ------------------------


app.get('/content/:alias', photoStream, function (req, res) {
  var alias = req.params.alias;

  Content.findOne({alias: alias}).exec(function(err, content) {
    res.render('content/index.jade', {content: content});
  });
});


// ------------------------
// *** Other Block ***
// ------------------------


app.listen(3000);
console.log('http://127.0.0.1:3000')