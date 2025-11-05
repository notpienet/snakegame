const game = document.getElementById("game");
let n = 9, m = 9;
let g1 = "gray", g2 = "lightgray";
for(let i = 1; i <= n; i++) {
    const row = document.createElement("div");
    row.setAttribute("class", "row");
    for(let j = 1; j <= m; j++) {
        const grid = document.createElement("div");
        grid.setAttribute("class", "grid");
        grid.setAttribute("id", i.toString() + "_" + j.toString());
        if((i + j) % 2 == 0) grid.style.backgroundColor = g1;
        else grid.style.backgroundColor = g2;
        const img = document.createElement("img");
        img.setAttribute("class", "gimg");
        img.setAttribute("id", i.toString() + "." + j.toString());
        grid.append(img);
        row.append(grid);
    }
    game.append(row);
}

const pos = [[Math.ceil(n / 2), Math.ceil(m / 2)]];
let x = pos[0][0], y = pos[0][1];
let dir = 2, last = 2;
let cur = 5;

function update() {
    x = pos[pos.length - 1][0];
    y = pos[pos.length - 1][1];
    last = dir;
    if(dir == 1) pos.push([x - 1, y]);
    if(dir == 2) pos.push([x, y + 1]);
    if(dir == 3) pos.push([x + 1, y]);
    if(dir == 4) pos.push([x, y - 1]);
    if(pos.length > cur) pos.shift();
    x = pos[pos.length - 1][0];
    y = pos[pos.length - 1][1];
    for(let i = 1; i <= n; i++) {
        for(let j = 1; j <= m; j++) {
            const img = document.getElementById(i.toString() + "." + j.toString());
            img.src = "assets/-.png";
        }
    }
    let a = 0, b = 0;
    for(let i = 0; i + 1 < pos.length; i++) {
        if(pos[i + 1][0] == pos[i][0] + 1) b = 3;
        if(pos[i + 1][0] == pos[i][0] - 1) b = 1;
        if(pos[i + 1][1] == pos[i][1] + 1) b = 2;
        if(pos[i + 1][1] == pos[i][1] - 1) b = 4;
        console.log(pos[i][0].toString() + "_" + pos[i][1].toString());
        const img = document.getElementById(pos[i][0].toString() + "." + pos[i][1].toString());
        img.src = "assets/" + Math.min(a, b).toString() + Math.max(a, b).toString() + ".png";
        const fade = Math.min(1, pos.length * 0.1) * i / (pos.length - 1);
        img.style.filter = "brightness(" + (Math.min(2, 1 + pos.length * 0.1) - fade).toString() + ")";
        a = ((b + 1) % 4 + 1);
    }
    const temp = document.getElementById(x.toString() + "." + y.toString());
    temp.src = "assets/0" + a.toString() + ".png";
    temp.style.filter = "brightness(1)";
}

document.addEventListener('keydown', function(event) {
    let press = event.key;
    let cand = -1;
    if(press == "w") cand = 1;
    if(press == "d") cand = 2;
    if(press == "s") cand = 3;
    if(press == "a") cand = 4;
    if(cand != (last + 1) % 4 + 1 && cand != -1 && cand != dir) {
        dir = cand;
        console.log(dir);
    }
});

let interval = setInterval(update, 500);