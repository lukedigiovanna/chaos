const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

const g = 0;

ctx.translate(width / 2, height / 2);
ctx.scale(width / 2, height / 2);

function update() {
    ctx.fillStyle = "black";
    ctx.fillRect(-1, -1, 2, 2);
}

setInterval(update, 250);