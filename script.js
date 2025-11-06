const cd = 100;
const orb_sprite = "assets/orb.png";
const empty_sprite = "assets/-.png";
const game = document.getElementById("game");
const g1 = 95, g2 = 58;
let n = 17, m = 17;
let pos = [[Math.ceil(n / 2), Math.ceil(m / 2) - 6]];
let x = pos[0][0], y = pos[0][1];
let dir = 2, last = 2;
let cur = 5, spawn = 3;
let orb = [];
let open = [0];
let playing = 0;
let interval;

function reset() {
    clearInterval(interval);
    playing = 0;
    n = 17, m = 17;
    pos = [[Math.ceil(n / 2), Math.ceil(m / 2) - 6]];
    x = pos[0][0], y = pos[0][1];
    dir = 2, last = 2;
    cur = 5, spawn = 3;
    orb = [];
    for(let i = 1; i + 1 < cur; i++) move();
    update();
}

function init() {
    for(i = 1; i <= n; i++) {
        const row = document.createElement("div");
        row.setAttribute("class", "row");
        const temp = [0];
        for(let j = 1; j <= m; j++) {
            const grid = document.createElement("div");
            grid.setAttribute("class", "grid");
            grid.setAttribute("id", i.toString() + "_" + j.toString());
            let b = (1 - Math.abs(n / 2 - i) / n) * (1 - Math.abs(m / 2 - j) / n) * 1;
            if((i + j) % 2 == 0) grid.style.backgroundColor = "rgb(" + g1 * b + ", " + g1 * b + ", " + g1 * b + ")";
            else grid.style.backgroundColor = "rgb(" + g2 * b + ", " + g2 * b + ", " + g2 * b + ")";
            const img = document.createElement("img");
            img.setAttribute("class", "gimg");
            img.setAttribute("id", i.toString() + "." + j.toString());
            grid.append(img);
            row.append(grid);
            temp.push(0);
        }
        open.push(temp);
        game.append(row);
    }
}

function spawnOrb() {
    const cand = [];
    for(let i = 1; i <= n; i++) {
        for(let j = 1; j <= m; j++) {
            if(open[i][j] == 0) cand.push([i, j]);
        }
    }
    if(cand.length == 0) return false;
    orb.push(cand[Math.floor(Math.random() * (cand.length))]);
    open[orb[orb.length - 1][0]][orb[orb.length - 1][1]] = 1;
    return true;
}

function die() {
    clearInterval(interval);
    playing = 0;
}

function move() {
    x = pos[pos.length - 1][0];
    y = pos[pos.length - 1][1];
    last = dir;
    if(dir == 1) pos.push([x - 1, y]);
    if(dir == 2) pos.push([x, y + 1]);
    if(dir == 3) pos.push([x + 1, y]);
    if(dir == 4) pos.push([x, y - 1]);
    x = pos[pos.length - 1][0];
    y = pos[pos.length - 1][1];
}

function resetGrid() {
    for(let i = 1; i <= n; i++) {
        for(let j = 1; j <= m; j++) {
            const img = document.getElementById(i.toString() + "." + j.toString());
            img.src = empty_sprite;
            open[i][j] = 0;
        }
    }
}

function checkOpen() {
    for(let i = 0; i + 1 < pos.length; i++) {
        if(pos[i][0] >= 1 && pos[i][0] <= n && pos[i][1] >= 1 && pos[i][1] <= m) open[pos[i][0]][pos[i][1]] = 1;
    }
    for(let i = 0; i < orb.length; i++) {
        open[orb[i][0]][orb[i][1]] = 1;
    }
}

function checkOrb() {
    while(orb.length < spawn && spawnOrb()) {}
    const neworb = [];
    for(let i = 0; i < orb.length; i++) {
        if(orb[i][0] == x && orb[i][1] == y) {
            cur++;
            spawnOrb();
            continue;
        }
        neworb.push([orb[i][0], orb[i][1]]);
    }
    orb = neworb;
}

function drawOrb() {
    for(let i = 0; i < orb.length; i++) {
        const img = document.getElementById(orb[i][0].toString() + "." + orb[i][1].toString());
        img.src = orb_sprite;
        img.style.filter = "brightness(1)";
    }
}

function drawSnake() {
    let a = 0, b = 0;
    for(let i = 0; i + 1 < pos.length; i++) {
        if(pos[i + 1][0] == pos[i][0] + 1) b = 3;
        if(pos[i + 1][0] == pos[i][0] - 1) b = 1;
        if(pos[i + 1][1] == pos[i][1] + 1) b = 2;
        if(pos[i + 1][1] == pos[i][1] - 1) b = 4;
        if(pos[i][0] >= 1 && pos[i][0] <= n && pos[i][1] >= 1 && pos[i][1] <= m) {
            open[pos[i][0]][pos[i][1]] = 1;
            const img = document.getElementById(pos[i][0].toString() + "." + pos[i][1].toString());
            img.src = "assets/" + Math.min(a, b).toString() + Math.max(a, b).toString() + ".png";
            const fade = Math.min(1, pos.length * 0.1) * i / (pos.length - 1);
            img.style.filter = "brightness(" + (Math.max(0.5, 1 - pos.length * 0.05) + fade * 0.5).toString() + ")";
        }
        a = ((b + 1) % 4 + 1);
    }
    if(x >= 1 && x <= n && y >= 1 && y <= m) {
        const temp = document.getElementById(x.toString() + "." + y.toString());
        temp.src = "assets/0" + a.toString() + ".png";
        temp.style.filter = "brightness(1)";
    }
}

function checkHit() {
    if(pos.length > cur) pos.shift();
    if(x < 1 || x > n || y < 1 || y > m) {
        die();
        return false;
    }
    else {
        for(let i = 0; i + 1 < pos.length; i++) {
            if(pos[i][0] == x && pos[i][1] == y) {
                die();
                return false;
            }
        }
    }
    return true;
}

function update() {
    move()
    checkOpen();
    checkOrb();
    if(!checkHit()) return;
    resetGrid();
    drawOrb();
    drawSnake();
}

document.addEventListener('keydown', function(event) {
    let press = event.key.toLowerCase();
    let cand = -1;
    if(press == "w" || press == "arrowup") cand = 1;
    if(press == "d" || press == "arrowright") cand = 2;
    if(press == "s" || press == "arrowdown") cand = 3;
    if(press == "a" || press == "arrowleft") cand = 4;
    if(cand != -1 && playing == 0) {
        playing = 1;
        interval = setInterval(update, cd);
    }
    if(press == " ") reset();
    if(cand != (last + 1) % 4 + 1 && cand != -1 && cand != dir) dir = cand;
});

init();
for(let i = 1; i + 1 < cur; i++) move();
update();