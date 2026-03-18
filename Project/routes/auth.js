const express = require("express");
const bcrypt = require("bcrypt"); 
const router = express.Router();
const User = require("../models/User"); 

function alreadyLoggedIn(req, res, next) {
  if (req.session.userId) {
    return res.redirect("/home");
  }
  next();
}

router.get("/signup", alreadyLoggedIn, (req, res) => { 
  res.render("signup", {error: null}); 
}); 

router.post("/signup", async(req, res) => { 
  try { 
    const {username, email, password, confirmPassword} = req.body; 

    if (!username || !email || !password || !confirmPassword) {
      return res.render("signup", { error: "Please fill in all fields." });
    }

    if (password !== confirmPassword) {
      return res.render("signup", { error: "Passwords do not match." });
    }

    if (password.length < 6) {
      return res.render("signup", { error: "Password must be at least 6 characters." });
    }

    const existingUser = await User.findOne({ email }); 

    if(existingUser){ 
      return res.render("signup", {error: "Email is already registered."}); 
    }

    const hashedPassword = await bcrypt.hash(password, 10); 

    const newUser = new User({ 
      username, email, password: hashedPassword, role:"user"
    })

    await newUser.save(); 
    req.session.userId = newUser._id;
    req.session.username = newUser.username;
    req.session.role = newUser.role;
    res.redirect("/profile"); 

  } catch(err){ 
    console.error(err);
    res.render("signup", { error: "Something went wrong during signup." });
  }
})

router.get("/login", alreadyLoggedIn, (req, res) => { 
  res.render("login", {error: null}); 
}); 

router.post("/login", async(req, res) => { 
  try { 
    const {email , password} = req.body; 

    if(!email || !password){ 
      return res.render("login", {error: "Please enter both email and password."})
    }

    const user = await User.findOne({email}); 

    if(!user){ 
      return res.render("login", {error: "Invalid email or password."})
    }

    const isMatch = await bcrypt.compare(password, user.password); 

    if(!isMatch) { 
      return res.render("login", {error: "Invalid email or password"}); 
    }

    req.session.userId = user._id; 
    req.session.username = user.username; 
    req.session.role = user.role; 

    res.redirect('/home'); 
  }
  catch(err) { 
    console.error(err); 
    res.render("login", {error: "Something went wrong during login."})
  }
})

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Error logging out.");
    }

    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

module.exports = router;
