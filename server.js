require('dotenv').config();
const express = require('express');
const app = express();
const { events} = require("./utils/zombieEvents");

app.use(express.json());
app.set('json spaces', 2);

const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;

let survivors = [
    {
        id: 1,
        name: "Emil",
        health: 100,
        food: 50,
        weapon: "baseball bat",
        location: "Næstved",
        score: 0,
        isAlive: true
    },
    {
        id: 2,
        name: "Sofie",
        health: 80,
        food: 70,
        weapon: "kitchen knife",
        location: "Roskilde",
        score: 20,
        isAlive: true
    }
];
let scores = {};

app.get('/', (req, res) => {
    res.send(  "message: Zombie survival backend is running");
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})

app.get('/survivors', (req, res) => {

    res.json({
        title: "Survivors",
        survivors: survivors
    })
})

app.get('/survivors/:id', (req, res) => {
    const survivorId = parseInt(req.params.id);
    const survivor =  survivors.find(s => s.id === survivorId);
    if(!survivor){
        res.status(404).json({
            error: "No such survivor"
        });
    }
    res.json(survivor)
})

app.post('/survivors', (req, res) => {
    const newSurvivorName = req.body.name;
    const newSurvivorWeapon = req.body.weapon;
    const newLocation = req.body.location;

    if(!newSurvivorName || !newSurvivorWeapon){
       return res.status(400).json({
            error: "Du mangler noget"
        });
    }

    const newId = survivors[survivors.length - 1].id + 1;

    const newSurvivor = {
        id: newId,
        name: newSurvivorName,
        health: 100,
        food: 50,
        weapon: newSurvivorWeapon,
        location: newLocation,
        score: 0,
        isAlive: true
    };

    survivors.push(newSurvivor);

    res.status(201).json({
        message: "Survivor saved successfully",
        survivor: newSurvivor
    });
});

app.get('/event/random', (req, res) => {
    const randomEvent = events[Math.floor(Math.random()* events.length)];
    res.json(randomEvent);
})

app.get('/survivors/:id/scavenge', (req, res) => {
    const survivorId = parseInt(req.params.id);
    const survivor =  survivors.find(s => s.id === survivorId);

    if(!survivor){
        res.status(404).json({
            error: "No such survivor"
        });
    }


    const randomEvent = events[Math.floor(Math.random()* events.length)];
    survivor.health += randomEvent.healthChange;
    survivor.food += randomEvent.foodChange;
    survivor.score += randomEvent.scoreChange;

    if (survivor.health <= 0){
        survivor.isAlive = false;
        return res.send("You are dead...")
    }
    res.json({
        message: randomEvent.event,
        survivor: survivor
    })
})

app.get('/leaderboard', (req, res) => {
    const scoreArray = [];

    for (const playerName in survivors){
        scoreArray.push({
            name: survivors[playerName].name,
            score: survivors[playerName].score,
        });
    }
    scoreArray.sort((a, b) => b.score - a.score);

    res.json({
        title: "Leaderboard",
        leaderboard: scoreArray
    });
});



