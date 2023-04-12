const express = require("express");
const app = express();
const { connection } = require("./config/db");
const { UserModel } = require("./models/users_model");
const jwt = require("jsonwebtoken");
const { uuid } = require("uuidv4");
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "1023529029465-dsrlbr57hi82leb00b81e9mjadlbp8o5.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "https://long-erin-hummingbird-garb.cyclic.app/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      var { name, email } = profile._json;
      let user;
      try {
        user = await UserModel.findOne({ email });
        if (user) {
          return cb(null, user);
        }
        user = new UserModel({ name, email, password: uuid() });
        await user.save();
        return cb(null, user);
      } catch (error) {
        console.log(error);
      }
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  function (req, res) {
    let user = req.user;
    console.log(user);
    var userEmail = user.email;
    var token = jwt.sign({ email: user.email }, "Secret", {
      expiresIn: "1d",
    });
    console.log(token);
    res.redirect(
      `https://qrbot.netlify.app/index.html?email=${userEmail}&id=${token}&name=${user.name}`
    );
  }
);

app.listen(4500, async () => {
  try {
    await connection;
    console.log("Connected to DB");
    console.log(`http://localhost:4500/`);
  } catch (error) {
    console.log("Error in Connecting to DB");
  }
});
