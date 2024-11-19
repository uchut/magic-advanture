var score = document.getElementById("score");
var time = document.getElementById("time");

let key1 = localStorage.key(0);
score = localStorage.getItem(key1);
let key2 = localStorage.key(1);
time = localStorage.getItem(key2);

document.write("score: " + score + " time: " + time);