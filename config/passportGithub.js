const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const User = require("../models/UserModel");
const {
  github
} = require("./config")


passport.use(new GitHubStrategy({
  clientID: github.clientId,
  clientSecret: github.clientSecret,
  callbackURL: github.cb,
  scope: ['user:email']
},
async function (accessToken, refreshToken, profile, done) {
  try {
    let currentUser = await User.findOne({ githubId: profile.id });
    if (currentUser) {
      return done(null, currentUser);
    }

    let email = profile._json.email;

    if (!email && profile.emails && profile.emails.length > 0) {
      const primary = profile.emails.find(e => e.primary && e.verified);
      email = primary ? primary.value : profile.emails[0].value;
    }

    const user = new User({
      username: profile.username,
      githubId: profile.id,
      email: email || '',
      profilePic: profile.photos?.[0]?.value || ''
    });

    await user.save();
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}
));


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  done(null, id);
});