const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();
const CLIENT_URL = "http://localhost:3000";

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate(
    "google",

    { failureRedirect: "/login", successRedirect: CLIENT_URL },
  ),
  (req, res) => {
    res
      .cookie("accessToken", token, {
        httpOnly: false,
      })
      .status(200)
      .send(info);
  }
);
router.get("/github", passport.authenticate("github", { scope: ["profile"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  }),
  (req, res) => {
    res
      .cookie("accessToken", token, {
        httpOnly: false,
      })
      .status(200)
      .send(info);
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["profile","email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  }),
  (req, res) => {
    res
      .cookie("accessToken", token, {
        httpOnly: false,
      })
      .status(200)
      .send(info);
  }
);

module.exports = router;
