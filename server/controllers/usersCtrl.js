
/*
 * Local Auth
 */
passport.use('local', new LocalStrategy(
  function(username, password, done) {
    db.users.findOne({username: username}, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password != password) { return done(null, false); }
      return done(null, user);
    })
  }
))

// Facebook Strategy
passport.use('facebook', new FacebookStrategy({
  clientID: config.facebookClientID,
  clientSecret: config.facebookClientSecret,
  callbackURL: "http://localhost:3000/auth/facebook/callback",
  profileFields: ['id', 'displayName']
},
function(accessToken, refreshToken, profile, done) {
  db.getUserByFacebookId([profile.id], function(err, user) {
    user = user[0];
    if (!user) {
      console.log('CREATING USER');
      db.createUserFacebook([profile.displayName, profile.id], function(err, user) {
        return done(err, user, {scope: 'all'});
      })
    } else {
      return done(err, user);
    }
  })
}));

passport.serializeUser(function(user, done) {
  return done(null, user);
})
passport.deserializeUser(function(user, done) {
  return done(null, user);
})

app.post('/auth/local', passport.authenticate('local'), function(req, res) {
  res.status(200).redirect('/#/');
});

app.get('/auth/me', function(req, res) {
  if (req.user) {
    console.log(req.user);
    res.status(200).send(req.user);
  } else {
    console.log('NO user!')
    res.status(200).send();
  }
})

app.get('/auth/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})

app.get('/auth/facebook', passport.authenticate('facebook'))

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {session: false}), function(req, res) {
    res.status(200).redirect('/#/');
  })
