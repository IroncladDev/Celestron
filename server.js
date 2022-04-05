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
  res.send(await db.get("lead"));
});

app.post('/api/highscore', async (req, res) => {
  if (!res.locals.isAuth) return res.send("Unauthorized");
  if (blacklisted.includes(res.locals.username)) return res.send("Go away");
  let lead = await db.get("lead");
  let me = await lead.findIndex(x => x[0] === req.headers["x-replit-user-name"])
  if (parseInt(req.body.score) > 500) return res.send("too big")
  try {
    if (
      (req.body.score && req.body.generations && req.body.segmentLength) &&
      req.body.score < req.body.generations &&
      req.body.segmentLength == (req.body.score + 5)
    ) {
      if(req.headers['x-replit-user-name']){
        if(req.body.score > lead[me][1]){
          await db.set("lead",  [...lead.filter(x => x[0] !== req.headers["x-replit-user-name"]), [req.headers["x-replit-user-name"], req.body.score]]);
        }
          res.json({success: true});
      } else res.json({success: false});}else{
      await db.set("lead",  [...lead.filter(x => x[0] !== req.headers["x-replit-user-name"]), [req.headers["x-replit-user-name"], req.body.score]]);
        res.json({success: true});
    }
  } catch (e) {
    res.json({success: false})
  }
});

app.get('/user-data', async (req, res) => {
  let score = 0;
  try{score=(await db.get("lead")).filter(x => x[0] === req.headers['x-replit-user-name'])[0][1];}catch(e){}
  res.json({
    name: req.headers['x-replit-user-name'] ? req.headers['x-replit-user-name'] : 'Anonymous',
    score
  });
});

// Listen To App
app.listen(8080, () => console.log('server up'));