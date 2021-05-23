const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

const g = 10;

ctx.translate(width / 2, height / 2);
ctx.scale(width / 2, height / 2);

// returns the current time of the computer in seconds
function time() {
    return (new Date()).getTime() / 1000;
}

var origin = { x: 0, y: 0.0 };

var angle1 = Math.PI / 2;
var angle2 = Math.PI / 2;
var angleVelocity1 = 0;
var angleVelocity2 = 0;

var mass1 = 1;
var mass2 = 1;
var radius1 = 0.4;
var radius2 = 0.4;

function getEnergy() {
    var h1 = radius1 - radius1 * Math.cos(angle1);
    var h2 = radius1 + radius2 - (radius1 * Math.cos(angle1) + radius2 * Math.cos(angle2));
    var gpe = mass1 * h1 * g + mass2 * h2 * g;
    console.log(h2);

    var ke = 0.5 * mass1 * angleVelocity1 * angleVelocity1 * radius1 * radius1 + 0.5 * mass2 * angleVelocity2 * angleVelocity2 * radius2 * radius2;

    return gpe + ke;
}

var last = time();
function update() {
    var now = time();
    var dt = now - last;
    last = now;
    
    angle1 += dt * angleVelocity1;
    angle2 += dt * angleVelocity2;
    
    steps = 300;
    let h = dt / steps;
    for (let i = 0; i < steps; i++) {
        var angleAcceleration1 = (-g * (2 * mass1 + mass2) * Math.sin(angle1) - mass2 * g * Math.sin(angle1 - 2 * angle2) - 2 * Math.sin(angle1 - angle2) * mass2 * (angleVelocity2 * angleVelocity2 * radius2 + angleVelocity1 * angleVelocity1 * radius1 * Math.cos(angle1 - angle2))) / (radius1 * (2 * mass1 + mass2 - mass2 * Math.cos(2 * angle1 - 2 * angle2)));
        var angleAcceleration2 = (2 * Math.sin(angle1 - angle2) * (angleVelocity1 * angleVelocity1 * radius1 * (mass1 + mass2) + g * (mass1 + mass2) * Math.cos(angle1) + angleVelocity2 * angleVelocity2 * radius2 * mass2 * Math.cos(angle1 - angle2))) / (radius2 * (2 * mass1 + mass2 - mass2 * Math.cos(2 * angle1 - 2 * angle2)));

        angleVelocity1 += angleAcceleration1 * h;
        angleVelocity2 += angleAcceleration2 * h;
    }
    
    document.getElementById("energy").innerHTML = "Energy: " + Math.round(100 * getEnergy()) / 100 + "J";

    // drawing
    ctx.fillStyle = "black";
    ctx.fillRect(-1, -1, 2, 2);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.01;
    let secondPoint = { 
        x: origin.x + radius1 * Math.sin(angle1), 
        y: origin.y + radius1 * Math.cos(angle1)
    }
    let thirdPoint = {
        x: secondPoint.x + radius2 * Math.sin(angle2),
        y: secondPoint.y + radius2 * Math.cos(angle2)
    }
    ctx.beginPath();
    ctx.lineTo(origin.x, origin.y);
    ctx.lineTo(secondPoint.x, secondPoint.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineTo(secondPoint.x, secondPoint.y);
    ctx.lineTo(thirdPoint.x, thirdPoint.y);
    ctx.stroke();
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, 0.025, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(secondPoint.x, secondPoint.y, 0.025, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(thirdPoint.x, thirdPoint.y, 0.025, 0, Math.PI * 2);
    ctx.fill();
}

setInterval(update, 50);