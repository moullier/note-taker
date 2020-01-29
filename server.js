// Dependencies
// =============================================================
let express = require("express");
let path = require("path");
let fs = require("fs");

// Sets up the Express App
// =============================================================
let app = express();

// use port 3000 unless there exists a preconfigured port
let PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// set up variables
let notes;
let uniqueID = 1;


// get the notes.html page when the /notes route is requested
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
    // req.body is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
  
    let newNote = req.body;

    // read db.json file
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }

        // parse the data from a json object
        notes = JSON.parse(data);

        // iterate through existing note in order to set uniqueID to be larger than any existing note ids
        for(let i = 0; i < notes.length; i++) {
            if(notes[i].id > uniqueID) {
                uniqueID = notes[i].id + 1;
            }
        }

        // console.log("notes prior to adding new note: ");
        // console.log(notes);
        // console.log("newNote before adding ID: ");
        // console.log(newNote);
        newNote.id = uniqueID;
        uniqueID++;
        notes.push(newNote);
        // console.log(notes);

        // write db.json file with new note included
        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(notes), function(err) {

            if (err) {
              return console.log(err);
            }
          
            console.log("Success!");
          
          });
    });
    
    res.json(newNote);
  });

// DELETE route to delete a note with a specified id
app.delete("/api/notes/:id", function(req, res) {
    let deleteID = req.params.id;

    // read the existing database file
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }

        notes = JSON.parse(data);
        let newNotes = [];

        // iterate through the existing notes, and push them to the newNotes unless they match the id of the note to be deleted
        for(let i = 0; i < notes.length; i++) {
            if(notes[i].id != deleteID) {
                newNotes.push(notes[i]);
            }
        }

        // write newNotes to db.json file, overwriting previous file
        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(newNotes), function(err) {

            if (err) {
              return console.log(err);
            }
          
            console.log("Successfully wrote db.json");
          
        });

    return res.json(newNotes);

    });
});

// on all other GET routes, send index.html
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});


// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
  
