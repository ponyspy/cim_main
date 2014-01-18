var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

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

var presSchema = new Schema({
      ru: {
        author: String,
        body: String
      },
      en: {
        author: String,
        body: String
      },
      link: String,
      events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
      date: {type: Date, default: Date.now}
});

var photoSchema = new Schema({
      ru: {
        description: String,
        author: String
      },
      en: {
        description: String,
        author: String
      },
      image: String,
      style: String,
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
      age: Number,
      duration: String,
      meta: {
        columns: {
          one: [String],
          two: [String]
        }
      },
       tag: String,
      _parent: { type: Schema.Types.ObjectId, ref: 'Event' },
      date: {type: Date, default: Date.now},
   members: [{
    c_status: String,
    m_id: { type: Schema.Types.ObjectId, ref: 'Member' },
    comment: {
      ru: String,
      en: String
    }
   }]
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

module.exports.User = mongoose.model('User', userSchema);
module.exports.Member = mongoose.model('Member', memberSchema);
module.exports.Event = mongoose.model('Event', eventSchema);
module.exports.News = mongoose.model('News', newsSchema);
module.exports.Press = mongoose.model('Press', presSchema);
module.exports.Photo = mongoose.model('Photo', photoSchema);
module.exports.Schedule = mongoose.model('Schedule', scheduleSchema);