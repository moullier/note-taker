// Dependencies
// =============================================================
let express = require("express");
let path = require("path");
let fs = require("fs");

// Sets up the Express App
// =============================================================
let app = express();

// use port 3000 unless there exists a preconfigured port
let PORT = process.env.port || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// set up variables
let notes;
let uniqueID = 1;


// get routes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });

// Returns all notes
app.get("/api/notes", function(req, res) {
    
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }

        data = JSON.parse(data);

        console.log(data);

        res.send(data);
    });
});

// add a new note to the data file
app.post("/api/notes", function(req, res) {
    // req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
  
    let newNote = req.body;

    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }

        notes = JSON.parse(data);

        for(let i = 0; i < notes.length; i++) {
            let note1 = notes[i];
            console.log(note1);

        }

        console.log("notes prior to adding new note: ");
        console.log(notes);
        console.log("newNote before adding ID: ");
        console.log(newNote);
        newNote.id = uniqueID;
        uniqueID++;
        notes.push(newNote);
        console.log(notes);

        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(notes), function(err) {

            if (err) {
              return console.log(err);
            }
          
            console.log("Success!");
          
          });
          




    });



  
    res.json(newNote);
  });


app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});


// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
  
