let events = [{
    "event": "You found canned food",
    "foodChange": 20,
    "healthChange": 0,
    "scoreChange": 10
},
{
    "event": "A zombie attacked you",
    "foodChange": 0,
    "healthChange": -25,
    "scoreChange": 5
}];

module.exports = {
    events: events,
}