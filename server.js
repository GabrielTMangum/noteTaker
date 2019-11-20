const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;
const notes = require("./db/db.json")


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});
app.get("/api/notes", (req, res) => {
    fs.readFile('./db/db.json','utf8',(err, data)=>{
        res.json(JSON.parse(data))
    })

});
app.post("/api/notes", (req, res) => {
    const newNote = req.body;
    console.log(newNote);
        newNote.id = notes.length + 1;
        console.log(newNote)
        notes.push(newNote)
        fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
            if (err) throw err;
           res.sendStatus(200)

    })
})

app.delete('/api/notes/:id', (req, res) => {
    let deleteId = parseInt(req.params.id);
    // console.log(deleteId)
    let deleteObj = notes.find(note => note.id === deleteId);
    console.log(deleteObj)
    let deleteIndex = notes.indexOf(deleteObj);
    // console.log(deleteIndex)
    notes.splice(deleteIndex,1); 
    fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
        if (err) throw err;
    });
    console.log(notes)
    
   res.send(notes); 
})

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});