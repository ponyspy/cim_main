  var post = req.body;
  var files = req.files;  

  var event = new Event({
    ru: {
      title: post.ru.title,
      s_title: post.ru.s_title,
      body: post.ru.body
    },
    tag: post.tag,
  });

  if (post.en) {
    event.en.title = post.en.title;
    event.en.s_title = post.en.s_title;
    event.en.body = post.en.body;
  };

  if (post.event) {
    event.members = memberSplit(post.event.members);
    event.hall = post.event.hall;
    if (post.event.cal)
      event.date = new Date(post.event.cal.year, post.event.cal.month, post.event.cal.date);
  };

  if (files) {
    fs.readFile(files.poster.path, function (err, data) {
      fs.mkdir(__dirname + '/public/images/events/' + event._id, function() {
        var newPath = __dirname + '/public/images/events/' + event._id + '/poster.jpg';
        fs.writeFile(newPath, data, function (err) {
          event.img.path = '/public/images/events/' + event._id + '/poster.jpg';
        });
      });
    });
  }  

  if (post.children) {
    for (var i in post.children) {
      var child = new Child({
        ru: {
          title: post.children[i].ru.title,
          s_title: post.children[i].ru.s_title,
          body: post.children[i].ru.body
        },
        date: ch_date,
        hall: post.children[i].hall,
        members: memberSplit(post.children[i].members),
        img: {
          path: '',
          author: ''
        }
      });

      if (post.children[i].cal)
        var ch_date = new Date(post.children[i].cal.year, post.children[i].cal.month, post.children[i].cal.date);

      if (post.children[i].en) {
        child.en.title = post.children[i].en.title;
        child.en.s_title = post.children[i].en.s_title;
        child.en.body = post.children[i].en.body;
      }

      child.save(function(err, result) {
        if (files.children[i].poster.size != 0) {
          Child.findById(result._id, function(err, child) {
            fs.readFile(files.children[i].poster.path, function (err, data) {
              var newPath = __dirname + '/public/images/events/children/' + child._id + '.jpg';
              fs.writeFile(newPath, data, function(err) {
                child.img.path = '/public/images/events/children/' + child._id + '.jpg';
              });              
            });
          });
        }

      });
    }
  }

  event.save(function(err, result) {
    if (files) {
      Event.findById(result._id, function(err, event) {      
        fs.readFile(files.poster.path, function (err, data) {
          fs.mkdir(__dirname + '/public/images/events/' + event._id, function() {
            var newPath = __dirname + '/public/images/events/' + event._id + '/poster.jpg';
            fs.writeFile(newPath, data, function (err) {
              event.img.path = '/public/images/events/' + event._id + '/poster.jpg';
              res.redirect('back');
            });
          });
        });
      });
    }     
  });