const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

var idx = 20;

const fs = require("fs");

// Aplicatia
const app = express();

// Middleware
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());


app.use("/", express.static('frontend'));


// Create
app.post("/gists", (req, res) => {
  const gistsList = readJSONFile();
  const newGist = req.body;
  newGist.id = idx;
  const newGistList = [...gistsList, newGist];
  writeJSONFile(newGistList);
  res.json(newGist);
  idx++;
});

// Read One
app.get("/gists/:id", (req, res) => {
  const gistsList = readJSONFile();
  const id = req.params.id;
  let idFound = false;
  let foundGist;

  gistsList.forEach(gist => {
    if (id === gist.id) {
      idFound = true;
      foundGist = gist
    }
  });

  if (idFound) {
    res.json(foundGist);
  } else {
    res.status(404).send(`gist ${id} was not found`);
  }
});

// Read All
app.get("/gists", (req, res) => {
  const gistsList = readJSONFile();
  res.json(gistsList);
});

// Update
app.put("/gists/:id", (req, res) => {
  const gistsList = readJSONFile();
  const id = req.params.id;
  const newGist = req.body;
  newGist.id = id;
  idFound = false;

  const newGistsList = gistsList.map((gist) => {
     if (gist.id === id) {
       idFound = true;
       return newGist
     }
    return gist
  })
  
  writeJSONFile(newGistsList);

  if (idFound) {
    res.json(newGist);
  } else {
    res.status(404).send(`gist ${id} was not found`);
  }

});

// Functia de citire din fisierul db.json
function readJSONFile() {
  return JSON.parse(fs.readFileSync("db.json"))["gists"];
}

// Functia de scriere in fisierul db.json
function writeJSONFile(content) {
  fs.writeFileSync(
    "db.json",
    JSON.stringify({ gists: content }),
    "utf8",
    err => {
      if (err) {
        console.log(err);
      }
    }
  );
}

// Pornim server-ul
app.listen("3000", () =>
  console.log("Server started at: http://localhost:3000")
);