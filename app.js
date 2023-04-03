// needed to run node
// npm init -y
// npm install express body-parser sqlite3 ejs

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const exp = require('constants');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static('public'));



// Initialize SQLite database
const db = new sqlite3.Database('./songs.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the songs database.');
});

//create db
db.run(`CREATE TABLE IF NOT EXISTS songs (
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  song TEXT NOT NULL, 
  artist TEXT NOT NULL, 
  streams INTEGER NOT NULL, 
  location TEXT NOT NULL)`
  );

//populate db
//uncomment only for first time running app
// let list=[
//   ["Blinding Lights", "The Weeknd", 3493527432, "Toronto, Canada"],
//   ["Shape of You", "Ed Sheeran", 3425580587, "Halifax, United Kingdom"],
//   ["Dance Monkey", "Tones and I", 2786060954, "Victoria, Australia"],
//   ["Someone You Loved", "Lewis Capaldi", 2713868023, "Glasglow, United Kingdom"],
//   ["rockstar", "Post Malone",2637602339 , "New York, United States"],
//   ["Sunflower - Spider-Man: Into the Spider-Verse", "Post Malone", 2600703305, "New York, United States"],
//   ["One Dance", "Drake", 2584594384, "Toronto, Canada"],
//   ["Closer", "The Chainsmokers", 2502307098, "New York, United States"],
//   ["STAY", "The Kid LAROI", 2482871175, "Waterloo, Australia"],
//   ["Believer", "Imagine Dragons", 2446050182, "Nevada, United States"],
//   ["Senorita", "Shawn Mendes", 2389262360, "Pickering, Canada"],
//   ["Perfect", "Ed Sheeran", 2401526776, "Halifax, United Kingdom"],
//   ["Heat Waves", "Glass Animals", 3493527432, "Oxford, England"],
//   ["Say You Won't Go", "James Arthur", 3493527432, "Middlesbrough, United Kingdom"],
//   ["Starboy", "The Weeknd", 3493527432, "Toronto, Canada"],
//   ["bad guy", "Billie Eilish", 3493527432, "california, United States"],
//   ["But Anyways", "The Hourglass Effect", 3493527432, "North Carolina, United States"],
//   ["Thinking Out Loud", "Ed Sheeran", 2197370899, "Halifax, United Kingdom"],
//   ["Lucid Dreams", "Juice WRLD", 2200010148, "Illinois, United States"],
//   ["Don't Start Now", "Dua Lipa", 2196631473, "London, United Kingdom"],
//   ["lovely", "Billie Eilish", 2197019569, "California, United States"],
//   ["85 & Sunny", "Brockwell", 66010, "unknown"],
//   ["Watermelon Sugar", " Harry Styles", 2175507056, "Redditch, United Kingdom"],
//   ["God's Plan", "Drake", 2151721316, "Toronto, Canada"],
//   ["Don't fall in love with me", "Ana Shine", 35843, "London, United Kingdom"],
//   ["Bohemian Rhapsody", "Queen", 2093914306, "London, United Kingdom"],
//   ["Something just Like This", "The Chainsmokers", 2086971663, "New York, United States"],
//   ["Dolce Vita", "Shab", 427798, "Tehran, Iran"],
//   ["Sweater Weather", "The Neighbourhood", 2090931859, "California, United States"],
//   ["Shallow", "Lady Gaga", 2061455178, "New York, United States"],
//   ["As It Was", "Harry Styles", 2121786072, "Redditch, United Kingdom"],
//   ["Love Yourself", "Justin Bieber", 2026998287, "London, Canada"],
//   ["Kickback", "Mcubed", 97251, "Oklahoma, United States"],
//   ["Circles", "Post Malone", 2015362125, "New York, United States"],
//   ["SAD!", "XXXTENTACION", 2001156024, "Florida, United States"],
//   ["Take Me To Church", "Hozier", 2014074448, "Bray, Ireland"],
//   ["All of Me", "John Legend", 1995612402, "Ohio, United States"],
//   ["Icy Icy", "Manuel Garay", 93752, "Munich, Germany"],
//   ["Thunder", "Imagine Dragons", 1950566839, "Nevada, United States"],
//   ["7 Rings", "Ariana Grande", 1947880333, "Florida, United States"],
//   ["goosebumps", "Travis Scott", 1931930036, "Texas, United States"],
//   ["Jocelyn Flores", "XXXTENTACION", 1922301295, "Florida, United States"],
//   ["Shatta Twist", "HURRICAN X", 174803, "London, United Kingdom"],
//   ["Havana", "Camila Cabello", 1872597115, "Cojimar, Cuba"],
//   ["Stressed Out", "Twenty One Pilots", 1884520365, "Ohio, United States"],
//   ["XO Tour Llif3", "Lil Uzi Vert", 1863070543, "Pennsylvania, United States"],
//   ["Counting Stars", "One Republic", 1876653974, "Colorado, United States"],
//   ["6 Ft Away", "Star 2", 162696, "California, United States"],
//   ["New Rules", "Dua Lipa", 1839713076, "London, United Kingdom"]
//   ];

//   for(i=0;i<list.length;i++){
//     db.run(`INSERT INTO songs VALUES (${i},"${list[i][0]}","${list[i][1]}","${list[i][2]}","${list[i][3]}")`, function (err) {
//       if (err) {
//         return console.error(err.message);
//       }
//     });
// }


//render webpage
app.get('/', (req, res) => {
  res.render('mainpage');
});

//creates query statement
function makeSQL(req){
  let sql="SELECT * FROM songs";
  if(req.body.location != '' && req.body.min != '' && req.body.max != ''){
    sql += " WHERE location='" + req.body.location + "' AND streams >= " + req.body.min + " AND streams <= " + req.body.max;
    return sql;
  }else if(req.body.location != '' && req.body.min != ''){
    sql += " WHERE location='" + req.body.location + "' AND streams >= " + req.body.min;
    return sql;
  }else if(req.body.location != '' && req.body.max != ''){
    sql += " WHERE location='" + req.body.location + "' AND streams <= " + req.body.max;
    return sql;
  }else if(req.body.min != '' && req.body.max != ''){
    sql += " WHERE streams>=" + req.body.min + " AND streams >= " + req.body.max;
    return sql;
  }else if(req.body.location != ''){
    sql += " WHERE location='" + req.body.location + "'";
    return sql;
  }else if(req.body.min != ''){
    sql += " WHERE streams >=" + req.body.min;
    return sql;
  }else if(req.body.max != ''){
    sql += " WHERE streams <=" + req.body.max;
    return sql;
  }
  return sql;
}

//query db and render data
app.post('/songs', (req, res) => {
  let sql = makeSQL(req);
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.render('songs', { songs: rows });
  });
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
