var fs = require('fs');
var express = require('express');
    var app = express();

// var mongoose = require('mongoose');
  // var Schema = mongoose.Schema;
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


// mongoose.connect('localhost', 'main');

// var orderSchema = new Schema({
//   user_id: String,
//   course_id: String,
//   course_date: String,
//   status: {type: String, default: 'Process'},
//   date: {type: Date, default: Date.now},
// });

// var courseSchema = new Schema({
//   title: String,
//   description: String,
//   price: Number,
//   cathegory: String,
//   schedule: [String],
//   date: {type: Date, default: Date.now},
// });

// var UserSchema = new Schema({
//   name: String,
//   login: String,
//   pass: String,
//   email: String,
//   skype: String,
//   status: {type: String, default: 'User'},
//   date: {type: Date, default: Date.now},
//   items: [courseSchema]
// });

// var Order = mongoose.model('Order', orderSchema);
// var User = mongoose.model('User', UserSchema);
// var Course = mongoose.model('Item', courseSchema);


// ------------------------
// *** Main Block ***
// ------------------------

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/', function (req, res) {
  var post = req.body;

  var arr = [
  {'name':'1','tag':'dada'},
  {'name':'2','tag':'VOVO'},
  {'name':'3', 'tag':'Lom'},
  {'name':'4','tag':'dada'},
  {'name':'5','tag':'VOVO'},
  {'name':'6', 'tag':'Lom'},
  {'name':'7','tag':'dada'},
  {'name':'8','tag':'VOVO'},
  {'name':'9', 'tag':'Lom'},
  {'name':'10','tag':'dada'},
  {'name':'11','tag':'VOVO'},
  {'name':'12', 'tag':'Lom'},
  {'name':'13','tag':'dada'},
  {'name':'14','tag':'VOVO'},
  {'name':'15', 'tag':'Lom'},
  {'name':'16','tag':'dada'},
  {'name':'17','tag':'VOVO'},
  {'name':'18', 'tag':'Lom'},
  {'name':'19','tag':'dada'},
  {'name':'20','tag':'VOVO'},
  {'name':'21', 'tag':'Lom'},
  {'name':'22','tag':'dada'},
  {'name':'23','tag':'VOVO'},
  {'name':'24', 'tag':'Lom'}  
  ]

  if (post.offset == 18)
    res.send('exit');
  else
    res.send(arr.slice(post.offset, post.offset*2));  
});

app.get('/error', function (req, res) {
  res.render('error');
});


app.get('*', function(req, res){
  res.render('error');
});


app.listen(3000);
console.log('http://127.0.0.1:3000')