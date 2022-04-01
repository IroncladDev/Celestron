import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import Database from '@replit/database';
// Express Setup
const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database();
const app = express();
import cookieParser from "cookie-parser";
const blacklisted = ["bramley", "bruhmley", "unnospid", "sharting", "kaskie", "og8hvo"];

app.use(cookieParser());
app.use(express.static('./dist/'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// General Serving
app.get('/', async (req, res) => {
  res.sendFile('./dist.index.html', { root: __dirname });
});

// Api
app.use(async (req, res, next) => {
  if (req.headers["x-replit-user-name"]) {
    res.locals.isAuth = true;
    res.locals.username = req.headers["x-replit-user-name"];
  } else {
    res.locals.isAuth = false;
  }
  next();
})

app.get('/api/leaderboard', async (req, res) => {
  const lb = await db.list();
  let users = []
  for (let i = 0; i < lb.length; i++) {
    users.push([lb[i], await db.get(lb[i])])
  }
  res.send(users);
});

app.post('/api/highscore', async (req, res) => {
  if (!res.locals.isAuth) return res.send("Unauthorized");
  if (blacklisted.includes(res.locals.username)) return res.send("Go away");
  if (parseInt(req.body.score) > 500) return res.send("too big")
  try {
    if (
      (req.body.score && req.body.generations && req.body.segmentLength) &&
      req.body.score < req.body.generations &&
      req.body.segmentLength == (req.body.score + 5)
    ) {
      if(req.headers['x-replit-user-name']){
        if(req.body.score > (await db.get(req.headers["x-replit-user-name"])))
          await db.set(req.headers["x-replit-user-name"],  req.body.score);
          res.json({success: true});
      } else res.json({success: false});}else{
      await db.set(req.headers["x-replit-user-name"],  req.body.score);
        res.json({success: true});
    }
  } catch (e) {
    res.json({success: false})
  }
});

app.get('/user-data', async (req, res) => {
  res.json({
    name: req.headers['x-replit-user-name'] ? req.headers['x-replit-user-name'] : 'Anonymous',
    score: await db.get(req.headers["x-replit-user-name"]) ?? 0
  });
})

// Listen To App
app.listen(8080, () => console.log('server up'));