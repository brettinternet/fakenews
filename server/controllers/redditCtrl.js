const winston = require('../services/winston'),
      request = require('request'),
      schedule = require('node-schedule'),
      picProcessor = require('./picProcessor'),
      articleProcessor = require('./articleProcessor');

let front = new schedule.RecurrenceRule(),
    business = new schedule.RecurrenceRule(),
    tech = new schedule.RecurrenceRule(),
    economy = new schedule.RecurrenceRule(),
    politics = new schedule.RecurrenceRule(),
    science = new schedule.RecurrenceRule(),
    health = new schedule.RecurrenceRule(),
    sports = new schedule.RecurrenceRule(),
    lifestyle = new schedule.RecurrenceRule(),
    entertainment = new schedule.RecurrenceRule(),
    world = new schedule.RecurrenceRule(),
    opinion = new schedule.RecurrenceRule(),
    secondary = new schedule.RecurrenceRule(),
    pic = new schedule.RecurrenceRule();

front.minute = 1;
business.minute = 5;
tech.minute = 10;
economy.minute = 15;
politics.minute = 20;
science.minute = 25;
health.minute = 30;
sports.minute = 35;
lifestyle.minute = 40;
entertainment.minute = 45;
world.minute = 50;
opinion.minute = 55;

pic.minute = 0;
secondary.hour = 17;
secondary.minute = 0;

schedule.scheduleJob(front, () => {
  request('https://www.reddit.com/r/news/top/.json', (err, res, raw) => {
    let category = 'front';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      articleProcessor.findPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob(pic, () => {
  request('https://www.reddit.com/r/pics/top/.json', (err, res, raw) => {
    let category = 'front';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      picProcessor.findPicPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob(pic, () => {
  request('https://www.reddit.com/r/aww/top/.json', (err, res, raw) => {
    let category = 'front';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      picProcessor.findPicPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob(pic, () => {
  request('https://www.reddit.com/r/funny/top/.json', (err, res, raw) => {
    let category = 'front';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      picProcessor.findPicPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob(pic, () => {
  request('https://www.reddit.com/r/adviceanimals/top/.json', (err, res, raw) => {
    let category = 'front';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      picProcessor.findPicPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob(pic, () => {
  request('https://www.reddit.com/r/wholesomememes/top/.json', (err, res, raw) => {
    let category = 'front';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      picProcessor.findPicPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob(business, () => {
  request('https://www.reddit.com/r/business/top/.json', (err, res, raw) => {
    let category = 'business';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      articleProcessor.findPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob(economy, () => {
  request('https://www.reddit.com/r/economy/top/.json', (err, res, raw) => {
    let category = 'economy';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      articleProcessor.findPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob(politics, () => {
  request('https://www.reddit.com/r/politics/top/.json', (err, res, raw) => {
    let category = 'politics';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      articleProcessor.findPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob(science, () => {
  request('https://www.reddit.com/r/science/top/.json', (err, res, raw) => {
    let category = 'science';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      articleProcessor.findPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob(health, () => {
  request('https://www.reddit.com/r/health/top/.json', (err, res, raw) => {
    let category = 'health';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      articleProcessor.findPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob('* 0/2 * * *', () => {
  request('https://www.reddit.com/r/mealprepsunday/top/.json', (err, res, raw) => {
    let category = 'health';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      picProcessor.findPicPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob('* 0/2 * * *', () => {
  request('https://www.reddit.com/r/food/top/.json', (err, res, raw) => {
    let category = 'health';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      picProcessor.findPicPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob(tech, () => {
  request('https://www.reddit.com/r/futurology/top/.json', (err, res, raw) => {
    let category = 'tech';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      articleProcessor.findPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob(secondary, () => {
  request('https://www.reddit.com/r/gadgets/top/.json', (err, res, raw) => {
    let category = 'tech';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      articleProcessor.findPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob(sports, () => {
  request('https://www.reddit.com/r/sports/top/.json', (err, res, raw) => {
    let category = 'sports';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      articleProcessor.findPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob(lifestyle, () => {
  request('https://www.reddit.com/r/upliftingnews/top/.json', (err, res, raw) => {
    let category = 'lifestyle';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      articleProcessor.findPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob(entertainment, () => {
  request('https://www.reddit.com/r/entertainment/top/.json', (err, res, raw) => {
    let category = 'entertainment';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      articleProcessor.findPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob(world, () => {
  request('https://www.reddit.com/r/worldnews/top/.json', (err, res, raw) => {
    let category = 'world';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      articleProcessor.findPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob(secondary, () => {
  request('https://www.reddit.com/r/philosophy/top/.json', (err, res, raw) => {
    let category = 'opinion';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      articleProcessor.findPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob(opinion, () => {
  request('https://www.reddit.com/r/inthenews/top/.json', (err, res, raw) => {
    let category = 'opinion';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      articleProcessor.findPost(body, category);
    } else {
      winston.get.error(err);
    }
  });
});
