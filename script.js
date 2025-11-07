const orb_sprite = "assets/orb.png";
const empty_sprite = "assets/-.png";
const game = document.getElementById("game");
const g1 = 95, g2 = 58;

let n = 17, m = 17;
let orb = [];
let spawn = 3;
let open = [0];
const cd = 100;
let playing = 0;
let interval;
let init_cur = 5;
let rot = 115;

let init_pos = [-6, -6];
let init_dir = 2;
let pos;
let x, y;
let dir, last;
let cur;

let init_apos = [6, 6];
let init_adir = 4;
let apos;
let ax, ay;
let adir, alast;
let acur;

function reset() {
    clearInterval(interval);
    playing = 0;

    pos = [[Math.ceil(n / 2) + init_pos[0], Math.ceil(m / 2) + init_pos[1]]];
    x = pos[0][0], y = pos[0][1];
    dir = init_dir, last = dir;
    cur = init_cur;
    orb = [];
    
    apos = [[Math.ceil(n / 2) + init_apos[0], Math.ceil(m / 2) + init_apos[1]]];
    ax = apos[0][0], ay = apos[0][1];
    adir = init_adir, alast = adir;
    acur = init_cur;
    orb = [];
    
    for(let i = 1; i + 1 < acur; i++) move();
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
            grid.setAttribute("id", i + "_" + j);
            let b = (1 - Math.abs(n / 2 - i) / n) * (1 - Math.abs(m / 2 - j) / n) * 1;
            if((i + j) % 2 == 0) grid.style.backgroundColor = "rgb(" + g1 * b + ", " + g1 * b + ", " + g1 * b + ")";
            else grid.style.backgroundColor = "rgb(" + g2 * b + ", " + g2 * b + ", " + g2 * b + ")";
            const img = document.createElement("img");
            img.setAttribute("class", "gimg");
            img.setAttribute("id", i + "." + j);
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
    for(let i = 2; i < n; i++) {
        for(let j = 2; j < m; j++) {
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
    
    ax = apos[apos.length - 1][0];
    ay = apos[apos.length - 1][1];
    alast = adir;
    if(adir == 1) apos.push([ax - 1, ay]);
    if(adir == 2) apos.push([ax, ay + 1]);
    if(adir == 3) apos.push([ax + 1, ay]);
    if(adir == 4) apos.push([ax, ay - 1]);
    ax = apos[apos.length - 1][0];
    ay = apos[apos.length - 1][1];
}

function resetGrid() {
    for(let i = 1; i <= n; i++) {
        for(let j = 1; j <= m; j++) {
            const img = document.getElementById(i + "." + j);
            img.src = empty_sprite;
            open[i][j] = 0;
        }
    }
}

let targ = [0, [-1, 0], [0, 1], [1, 0], [0, -1]];
function checkOpen(openNext) {
    for(let i = 0; i < orb.length; i++) {
        open[orb[i][0]][orb[i][1]] = 2;
    }

    for(let i = 0; i + 1 < pos.length; i++) {
        if(pos[i][0] >= 1 && pos[i][0] <= n && pos[i][1] >= 1 && pos[i][1] <= m) {
            open[pos[i][0]][pos[i][1]] = 1;
        }
    }
    
    for(let i = 0; i + 1 < apos.length; i++) {
        if(apos[i][0] >= 1 && apos[i][0] <= n && apos[i][1] >= 1 && apos[i][1] <= m) {
            open[apos[i][0]][apos[i][1]] = 1;
        }
    }
    let nx = x + targ[dir][0], ny = y + targ[dir][1];
    if(openNext && nx >= 1 && nx <= n && ny >= 1 && ny <= m) open[nx][ny] = 1;
    nx += targ[dir][0], ny += targ[dir][1];
    while(nx >= 1 && nx <= n && ny >= 1 && ny <= m && open[nx][ny] == 0) open[nx][ny] = 3;
    if(!openNext) return;
    for(let i = 1; i <= n; i++) {
        for(let j = 1; j <= m; j++) {
            if(i == 1 || j == 1 || i == n || j == m) open[i][j] = 1;
        }
    }
}

function checkOrb() {
    while(orb.length < spawn && spawnOrb()) {}
    let neworb = [];
    for(let i = 0; i < orb.length; i++) {
        if(orb[i][0] == x && orb[i][1] == y) {
            cur++;
            spawnOrb();
            continue;
        }
        neworb.push([orb[i][0], orb[i][1]]);
    }
    orb = neworb;

    neworb = [];
    while(orb.length < spawn && spawnOrb()) {}
    for(let i = 0; i < orb.length; i++) {
        if(orb[i][0] == ax && orb[i][1] == ay) {
            acur++;
            spawnOrb();
            continue;
        }
        neworb.push([orb[i][0], orb[i][1]]);
    }
    orb = neworb;
}

function drawOrb() {
    for(let i = 0; i < orb.length; i++) {
        const img = document.getElementById(orb[i][0] + "." + orb[i][1]);
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
            const img = document.getElementById(pos[i][0] + "." + pos[i][1]);
            img.src = "assets/" + Math.min(a, b) + Math.max(a, b) + ".png";
            const fade = Math.min(1, pos.length * 0.1) * i / (pos.length - 1);
            img.style.filter = "brightness(" + (Math.max(0.5, 1 - pos.length * 0.05) + fade * 0.5) + ") hue-rotate(0deg)";
        }
        a = ((b + 1) % 4 + 1);
    }
    if(x >= 1 && x <= n && y >= 1 && y <= m) {
        const temp = document.getElementById(x + "." + y);
        temp.src = "assets/0" + a + ".png";
        temp.style.filter = "brightness(1) hue-rotate(0deg)";
    }

    
    a = 0, b = 0;
    for(let i = 0; i + 1 < apos.length; i++) {
        if(apos[i + 1][0] == apos[i][0] + 1) b = 3;
        if(apos[i + 1][0] == apos[i][0] - 1) b = 1;
        if(apos[i + 1][1] == apos[i][1] + 1) b = 2;
        if(apos[i + 1][1] == apos[i][1] - 1) b = 4;
        if(apos[i][0] >= 1 && apos[i][0] <= n && apos[i][1] >= 1 && apos[i][1] <= m) {
            open[apos[i][0]][apos[i][1]] = 1;
            const img = document.getElementById(apos[i][0] + "." + apos[i][1]);
            img.src = "assets/" + Math.min(a, b) + Math.max(a, b) + ".png";
            const fade = Math.min(1, apos.length * 0.1) * i / (apos.length - 1);
            img.style.filter = "brightness(" + (Math.max(0.5, 1 - apos.length * 0.05) + fade * 0.5) + ") hue-rotate(" + rot + "deg)";
        }
        a = ((b + 1) % 4 + 1);
    }
    if(ax >= 1 && ax <= n && ay >= 1 && ay <= m) {
        const temp = document.getElementById(ax + "." + ay);
        temp.src = "assets/0" + a + ".png";
        temp.style.filter = "brightness(1) hue-rotate(" + rot + "deg)";
    }
}

function checkHit() {
    if(pos.length > cur) pos.shift();
    if(apos.length > acur) apos.shift();
    if(x < 1 || x > n || y < 1 || y > m) {
        die();
        console.log("Player went outside the map");
        return false;
    }
    else if(ax < 1 || ax > n || ay < 1 || ay > m) {
        die();
        console.log("Computer went outside the map");
        return false;
    }
    else {
        let w = 0;
        if(x == ax && y == ay) { //dua2ny mati
            if(cur > acur) w = 1;
            else w = 2;
            die();
            console.log("Bump");
        }
        for(let i = 0; i + 1 < pos.length; i++) {
            if(pos[i][0] == x && pos[i][1] == y) { //p1 tabrak diri sendiri
                w = 2;
                die();
                console.log("Player hit themselves");
                break;
            }
            if(pos[i][0] == ax && pos[i][1] == ay) { //p2 tabrak p1
                w = 1;
                die();
                console.log("Computer hit player");
                break;
            }
        }
        for(let i = 0; i + 1 < apos.length; i++) {
            if(apos[i][0] == x && apos[i][1] == y) { //p1 tabrak p2
                w = 2;
                die();
                console.log("Player hit computer");
                break;
            }
            if(apos[i][0] == ax && apos[i][1] == ay) { //p2 tabrak diri sendiri
                w = 1;
                die();
                console.log("Computer hit themselves");
                break;
            }
        }
        if(w !== 0) {
            die();
            return false;
        }
    }
    return true;
}

function update() {
    checkOrb();
    checkOpen(true);
    if(playing == 1) {
        if(!bfs()) {
            resetGrid();
            drawOrb();
            drawSnake();
            checkOpen(false);
            bfs();
        }
    }
    move();
    if(!checkHit()) return;
    resetGrid();
    drawOrb();
    drawSnake();
}


let moves = [[-1, 0], [0, 1], [1, 0], [0, -1]];

function bfs() {
    let i = 0;
    let queue = [[ax, ay, -1]];
    let vis = [];
    for(let j = 0; j <= n; j++) {
        let temp = [];
        for(let k = 0; k <= m; k++) {
            temp.push(0);
        }
        vis.push(temp);
    }
    vis[queue[0][0]][queue[0][1]] = 1;
    let turn = 0;
    while(i < queue.length) {
        let f = 0;
        for(let j = 0; j < 4; j++) {
            let nx = queue[i][0] + moves[j][0], ny = queue[i][1] + moves[j][1];
            if(nx >= 1 && nx <= n && ny >= 1 && ny <= m && vis[nx][ny] == 0) {
                if(open[nx][ny] == 0) {
                    vis[nx][ny] = 1;
                    queue.push([nx, ny, i])
                }
                let goOrb = (acur <= cur) || !(nx > 1 && nx < n && ny > 1 && ny < m);
                if((open[nx][ny] == 2 && goOrb) || (open[nx][ny] == 3 && !goOrb)) {
                    queue.push([nx, ny, i])
                    i = queue.length - 1;
                    f = 1;
                    break;
                }
            }
        }
        if(f == 1) break;
        i++;
    }
    i = Math.min(queue.length - 1, i);
    while(queue[i][2] != 0 && i > 0) {
        i = queue[i][2];
    }
    if(queue[i][0] == ax + 1) adir = 3;
    if(queue[i][0] == ax - 1) adir = 1;
    if(queue[i][1] == ay + 1) adir = 2;
    if(queue[i][1] == ay - 1) adir = 4;
    if(queue.length == 1) return false;
    return true;
}

document.addEventListener('keydown', function(event) {
    let press = event.key.toLowerCase();
    let cand = -1, acand = -1;
    if(press == "w" || press == "arrowup") cand = 1;
    if(press == "d" || press == "arrowright") cand = 2;
    if(press == "s" || press == "arrowdown") cand = 3;
    if(press == "a" || press == "arrowleft") cand = 4;
    // if(press == "arrowup") acand = 1;
    // if(press == "arrowright") acand = 2;
    // if(press == "arrowdown") acand = 3;
    // if(press == "arrowleft") acand = 4;
    if(cand != -1 && playing == 0) {
        playing = 1;
        interval = setInterval(update, cd);
    }
    if(press == " ") reset();
    if(cand != (last + 1) % 4 + 1 && cand != -1 && cand != dir) dir = cand;
    // if(acand != (alast + 1) % 4 + 1 && acand != -1 && acand != adir) adir = acand;
});

init();
reset();