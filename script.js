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

function DoublePendulum(centerX, centerY, startAngle1, startAngle2, radius1, radius2, rodColor="white", pointColor="blue") {
    this.origin = { x: centerX, y: centerY };
    this.angle1 = startAngle1;
    this.angle2 = startAngle2;
    this.angleVelocity1 = 0;
    this.angleVelocity2 = 0;
    this.radius1 = radius1;
    this.radius2 = radius2;
    this.mass1 = 1;
    this.mass2 = 1;
    this.rodColor = rodColor;
    this.pointColor = pointColor;
}

DoublePendulum.prototype.getEnergy = function() {
    var rx2 = this.radius1 * Math.sin(this.angle1) + this.radius2 * Math.sin(this.angle2);
    var ry2 = this.radius1 * Math.cos(this.angle1) + this.radius2 * Math.cos(this.angle2);
    var r2 = rx2 * rx2 + ry2 * ry2;
    var a2 = this.angleVelocity1 + this.angleVelocity2;

    var h1 = this.radius1 - this.radius1 * Math.cos(this.angle1);
    var h2 = this.radius1 + this.radius2 - this.ry2;
    var gpe = this.mass1 * h1 * g + this.mass2 * h2 * g;

    var ke = 0.5 * this.mass1 * this.angleVelocity1 * this.angleVelocity1 * this.radius1 * this.radius1 + 0.5 * this.mass2 * a2 * a2 * r2;

    return ke;
}

DoublePendulum.prototype.update = function(dt) {
    this.angle1 += dt * this.angleVelocity1;
    this.angle2 += dt * this.angleVelocity2;
    
    var angleAcceleration1 = (-g * (2 * this.mass1 + this.mass2) * Math.sin(this.angle1) - this.mass2 * g * Math.sin(this.angle1 - 2 * this.angle2) - 2 * Math.sin(this.angle1 - this.angle2) * this.mass2 * (this.angleVelocity2 * this.angleVelocity2 * this.radius2 + this.angleVelocity1 * this.angleVelocity1 * this.radius1 * Math.cos(this.angle1 - this.angle2))) / (this.radius1 * (2 * this.mass1 + this.mass2 - this.mass2 * Math.cos(2 * this.angle1 - 2 * this.angle2)));
    var angleAcceleration2 = (2 * Math.sin(this.angle1 - this.angle2) * (this.angleVelocity1 * this.angleVelocity1 * this.radius1 * (this.mass1 + this.mass2) + g * (this.mass1 + this.mass2) * Math.cos(this.angle1) + this.angleVelocity2 * this.angleVelocity2 * this.radius2 * this.mass2 * Math.cos(this.angle1 - this.angle2))) / (this.radius2 * (2 * this.mass1 + this.mass2 - this.mass2 * Math.cos(2 * this.angle1 - 2 * this.angle2)));

    this.angleVelocity1 += angleAcceleration1 * dt;
    this.angleVelocity2 += angleAcceleration2 * dt;
    
}

DoublePendulum.prototype.draw = function() {
    ctx.strokeStyle = this.rodColor;
    ctx.lineWidth = 0.01;
    let secondPoint = { 
        x: this.origin.x + this.radius1 * Math.sin(this.angle1), 
        y: this.origin.y + this.radius1 * Math.cos(this.angle1)
    }
    let thirdPoint = {
        x: secondPoint.x + this.radius2 * Math.sin(this.angle2),
        y: secondPoint.y + this.radius2 * Math.cos(this.angle2)
    }
    ctx.beginPath();
    ctx.lineTo(this.origin.x, this.origin.y);
    ctx.lineTo(secondPoint.x, secondPoint.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineTo(secondPoint.x, secondPoint.y);
    ctx.lineTo(thirdPoint.x, thirdPoint.y);
    ctx.stroke();
    ctx.fillStyle = this.pointColor;
    ctx.beginPath();
    ctx.arc(this.origin.x, this.origin.y, 0.02, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(secondPoint.x, secondPoint.y, 0.02, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(thirdPoint.x, thirdPoint.y, 0.02, 0, Math.PI * 2);
    ctx.fill();
}

function Color(red, green, blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;
}

Color.prototype.getString = function() {
    return "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")";
}

function lerp(a, b, t) {
    return (b - a) * t + a;
}

function lerpColor(color1, color2, t) {
    var color = new Color(
        lerp(color1.red, color2.red, t),
        lerp(color1.green, color2.green, t),
        lerp(color1.blue, color2.blue, t)
    );
    return color;
}

const colors = [
    new Color(255, 0, 0),
    new Color(255, 125, 0),
    new Color(255, 255, 0),
    new Color(0, 255, 0),
    new Color(0, 0, 255),
    new Color(255, 0, 255)
]

const colorFrequency = 1;
const numberOfPendulums = 5000;
const degreeRange = 0.1;

var pendulums = []
for (let i = 0; i < numberOfPendulums; i++) {
    let t = i / numberOfPendulums;
    let color1Index = Math.floor(t * (colors.length - 1));
    let color1 = colors[color1Index]
    let color2 = colors[color1Index + 1];
    let ct = t % (1 / (colors.length - 1)) / (1 / (colors.length - 1));
    let color = lerpColor(color1, color2, ct);
    pendulums.push(
        new DoublePendulum(
            0, 0, // center
            Math.PI / 2, // angle 1
            Math.PI / 2 + t * degreeRange, // angle 2
            0.4, 0.4, // radii
            color.getString(), // rod color
            "white" // point color
        )
    );
}

var last = time();
function update() {
    var now = time();
    var dt = now - last;
    last = now;

    dt /= 5;
    
    for (p of pendulums)
        p.update(dt);
    
    //document.getElementById("energy").innerHTML = "Energy: " + Math.round(100 * pend1.getEnergy()) / 100 + "J";

    // drawing
    ctx.fillStyle = "black";
    ctx.fillRect(-1, -1, 2, 2);
    for (p of pendulums)
        p.draw();
}

setInterval(update, 50);