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
    orb = [];

    pos = [[Math.ceil(n / 2) + init_pos[0], Math.ceil(m / 2) + init_pos[1]]];
    x = pos[0][0], y = pos[0][1];
    dir = init_dir, last = dir;
    cur = init_cur;
    
    apos = [[Math.ceil(n / 2) + init_apos[0], Math.ceil(m / 2) + init_apos[1]]];
    ax = apos[0][0], ay = apos[0][1];
    adir = init_adir, alast = adir;
    acur = init_cur;
    
    for(let i = 1; i + 1 < acur; i++) move();
    document.getElementById("ins").textContent = "Use WASD / Arrow Keys to start Moving";
    update();
}

function init() {
    for(let i = 0; i <= n + 1; i++) {
        const row = document.createElement("div");
        row.setAttribute("class", "row");
        const temp = [0];
        for(let j = 0; j <= m + 1; j++) {
            const grid = document.createElement("div");
            grid.setAttribute("class", "grid");
            grid.setAttribute("id", i + "_" + j);
            let b = (1 - Math.abs(n / 2 - i) / n) * (1 - Math.abs(m / 2 - j) / n) * 1;
            if(i >= 1 && i <= n && j >= 1 && j <= m) {
                if((i + j) % 2 == 0) grid.style.backgroundColor = "rgb(" + g1 * b + ", " + g1 * b + ", " + g1 * b + ")";
                else grid.style.backgroundColor = "rgb(" + g2 * b + ", " + g2 * b + ", " + g2 * b + ")";
            }
            else grid.style.backgroundColor = "rgb(0, 0, 0)";
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
    document.getElementById("ins").textContent = "Press the spacebar to reset";
    document.getElementById("stats").innerHTML = win + "W / " + draw + "D / " + lose + "L (" + (Math.round((10000 * (win + 0.5 * draw)) / games) / 100).toFixed(2) + "%)";
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
    for(let i = 0; i <= n + 1; i++) {
        for(let j = 0; j <= m + 1; j++) {
            let img = document.getElementById(i + "." + j);
            img.src = empty_sprite;
            open[i][j] = 0;
            let grid = document.getElementById(i + "_" + j);
            if(i >= 1 && i <= n && j >= 1 && j <= m) {
                let b = (1 - Math.abs(n / 2 - i) / n) * (1 - Math.abs(m / 2 - j) / n) * 1;
                if((i + j) % 2 == 0) grid.style.backgroundColor = "rgb(" + g1 * b + ", " + g1 * b + ", " + g1 * b + ")";
                else grid.style.backgroundColor = "rgb(" + g2 * b + ", " + g2 * b + ", " + g2 * b + ")";
            }
            else grid.style.backgroundColor = "rgb(0, 0, 0)";
        }
    }
}

let targ = [0, [-1, 0], [0, 1], [1, 0], [0, -1]];
function checkOpen(openNext) {
    for(let i = 1; i <= n; i++) {
        for(let j = 1; j <= m; j++) {
            open[i][j] = 0;
        }
    }
    for(let i = 0; i < orb.length; i++) {
        open[orb[i][0]][orb[i][1]] = 2;
    }
    for(let i = 0; i < pos.length; i++) {
        if(pos[i][0] >= 1 && pos[i][0] <= n && pos[i][1] >= 1 && pos[i][1] <= m) {
            open[pos[i][0]][pos[i][1]] = 1;
        }
    }
    
    for(let i = 0; i < apos.length; i++) {
        if(apos[i][0] >= 1 && apos[i][0] <= n && apos[i][1] >= 1 && apos[i][1] <= m) {
            open[apos[i][0]][apos[i][1]] = 1;
        }
    }
    let nx = x + targ[dir][0], ny = y + targ[dir][1];
    if(openNext && nx >= 1 && nx <= n && ny >= 1 && ny <= m) open[nx][ny] = 1;
    while(nx >= 1 && nx <= n && ny >= 1 && ny <= m) {
        if(open[nx][ny] == 0 || open[nx][ny] == 2) open[nx][ny] = 3;
        nx += targ[dir][0], ny += targ[dir][1];
    }
    if(!openNext) return;
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

let win = 0, draw = 0, lose = 0, games = 0;
function checkHit() {
    if(pos.length > cur) pos.shift();
    if(apos.length > acur) apos.shift();
    let grid = document.getElementById(x + "_" + y);
    let agrid = document.getElementById(ax + "_" + ay);
    let b = (1 - Math.abs(n / 2 - x) / n) * (1 - Math.abs(m / 2 - y) / n) * 1;
    let ab = (1 - Math.abs(n / 2 - ax) / n) * (1 - Math.abs(m / 2 - ay) / n) * 1;
    if(grid == agrid) grid.style.backgroundColor = "rgb(" + b * 156 + ", " + b * 100 + ", " + b * 158 + ")";
    else {
        grid.style.backgroundColor = "rgb(" + b * 89 + ", " + b * 113 + ", " + b * 221 + ")";
        agrid.style.backgroundColor = "rgb(" + ab * 222 + ", " + ab * 86 + ", " + ab * 95 + ")";
    }
    let w = 0;
    if(x < 1 || x > n || y < 1 || y > m) {
        w = 2;
        console.log("Computer wins! Player went outside the map");
    }
    else if(ax < 1 || ax > n || ay < 1 || ay > m) {
        w = 1;
        console.log("Player wins! Computer went outside the map");
    }
    else {
        if(x == ax && y == ay) {
            w = 3;
            console.log("Draw! Player and computer bumped");
        }
        for(let i = 0; i + 1 < pos.length; i++) {
            if(pos[i][0] == x && pos[i][1] == y) {
                w = 2;
                console.log("Computer wins! Player hit themselves");
            }
            if(pos[i][0] == ax && pos[i][1] == ay) {
                w = 1;
                console.log("Player wins! Computer hit player");
            }
        }
        for(let i = 0; i + 1 < apos.length; i++) {
            if(apos[i][0] == x && apos[i][1] == y) {
                w = 2;
                console.log("Computer wins! Player hit computer");
            }
            if(apos[i][0] == ax && apos[i][1] == ay) {
                w = 1;
                console.log("Player wins! Computer hit themselves");
            }
        }
    }
    if(w !== 0) {
        if(mode == 1) {
            if(w == 1) win++;
            else if(w == 2) lose++;
            else draw++;
            games++;
        }
        die();
        return false;
    }
    return true;
}

function update() {
    checkOrb();
    checkOpen(true);
    if(playing == 1 && mode == 1) {
        if(!bfs(true)) {
            checkOpen(false);
            bfs(false);
        }
    }
    move();
    if(!checkHit()) return;
    resetGrid();
    drawOrb();
    drawSnake();
}


let moves = [[-1, 0], [0, 1], [1, 0], [0, -1]];
function floodFill(tx, ty, cond) {
    checkOpen(cond);
    let cx = x + targ[dir][0], cy = y + targ[dir][1];
    let temp = -1;
    if(cx >= 1 && cx <= n && cy >= 1 && cy <= m) {
        temp = open[cx][cy];
        open[cx][cy] = 1;
    }
    let i = 0;
    let queue = [[tx, ty]];
    let vis = [];
    for(let j = 0; j <= n; j++) {
        let atemp = [];
        for(let k = 0; k <= m; k++) {
            atemp.push(0);
        }
        vis.push(atemp);
    }
    vis[tx][ty] = 1;
    while(i < queue.length) {   
        for(let j = 0; j < 4; j++) {
            let nx = queue[i][0] + moves[j][0], ny = queue[i][1] + moves[j][1];
            if(nx >= 1 && nx <= n && ny >= 1 && ny <= m && vis[nx][ny] == 0 && (open[nx][ny] == 0 || open[nx][ny] == 2)) {
                vis[nx][ny] = 1;
                queue.push([nx, ny])
            }
        }
        i++;
    }
    if(temp != -1) open[cx][cy] = temp;
    if(!checkTail(tx, ty, cond)) return queue.length - (n * m);
    return queue.length;
}

function checkTail(tx, ty, cond) {
    checkOpen(cond);
    let cx = apos[0][0], cy = apos[0][1];
    let temp = open[cx][cy];
    open[cx][cy] = 4;
    let i = 0;
    let queue = [[tx, ty]];
    let vis = [];
    for(let j = 0; j <= n; j++) {
        let atemp = [];
        for(let k = 0; k <= m; k++) {
            atemp.push(0);
        }
        vis.push(atemp);
    }
    vis[tx][ty] = 1;
    while(i < queue.length) {   
        for(let j = 0; j < 4; j++) {
            let nx = queue[i][0] + moves[j][0], ny = queue[i][1] + moves[j][1];
            if(nx >= 1 && nx <= n && ny >= 1 && ny <= m && vis[nx][ny] == 0 && (open[nx][ny] == 0 || open[nx][ny] == 2)) {
                vis[nx][ny] = 1;
                queue.push([nx, ny])
            }
            if(nx >= 1 && nx <= n && ny >= 1 && ny <= m && open[nx][ny] == 4) {
                open[cx][cy] = temp;
                return true;
            }
        }
        i++;
    }
    open[cx][cy] = temp;
    return false;
}


function bfs(cond) {
    if(ax == 1 || ax == n || ay == 1 || ay == m) {
        let ma = -n * m - 1, f = -1;
        let start = Math.floor(Math.random() * 100);
        for(let i = 0; i < 4; i++) {
            let j = (i + start) % 4;
            if(j + 1 == (adir + 1) % 4 + 1) continue;
            let nx = ax + moves[j][0], ny = ay + moves[j][1];
            if(!(nx >= 1 && nx <= n && ny >= 1 && ny <= m) || open[nx][ny] == 1) continue;
            let cur = floodFill(nx, ny, cond);
            if(cur > ma) {
                ma = cur;
                f = j + 1;
            }
        }
        if(f == -1) {
            for(let i = 0; i < 4; i++) {
                let j = (i + start) % 4;
                let nx = ax + moves[j][0], ny = ay + moves[j][1];
                if(!(nx >= 1 && nx <= n && ny >= 1 && ny <= m)) continue;
                if(open[nx][ny] != 1) {
                    adir = j + 1;
                    return true;
                }
            }
            return false;
        }
        adir = f;
        return true;
    }
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
    while(i < queue.length) {
        let f = 0;
        for(let j = 0; j < 4; j++) {
            let nx = queue[i][0] + moves[j][0], ny = queue[i][1] + moves[j][1];
            if(nx >= 1 && nx <= n && ny >= 1 && ny <= m && vis[nx][ny] == 0) {
                let fill = floodFill(nx, ny, cond);
                let goOrb = ((acur < cur) || !(nx > 1 && nx < n && ny > 1 && ny < m));
                if(fill > acur * 2 && ((open[nx][ny] == 2 && goOrb) || (open[nx][ny] == 3 && !goOrb))) {
                    queue.push([nx, ny, i])
                    i = queue.length - 1;
                    f = 1;
                    break;
                }
                else if(open[nx][ny] != 1) {
                    vis[nx][ny] = 1;
                    queue.push([nx, ny, i])
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
    let nx = ax + targ[adir][0], ny = ay + targ[adir][1];
    let fill = 0;
    if(nx >= 1 && nx <= n && ny >= 1 && ny <= m) fill = floodFill(nx, ny, cond);
    if(queue.length == 1) return false;
    if(!(nx >= 1 && nx <= n && ny >= 1 && ny <= m) || fill < acur * 2) {
        let ma = -n * m - 1, f = -1;
        let start = Math.floor(Math.random() * 100);
        for(let i = 0; i < 4; i++) {
            let j = (i + start) % 4;
            if(j + 1 == (adir + 1) % 4 + 1) continue;
            let nx = ax + moves[j][0], ny = ay + moves[j][1];
            if(!(nx >= 1 && nx <= n && ny >= 1 && ny <= m) || open[nx][ny] == 1) continue;
            let cur = floodFill(nx, ny, cond);
            if(cur > ma) {
                ma = cur;
                f = j + 1;
            }
        }
        if(f == -1) {
            for(let i = 0; i < 4; i++) {
                let j = (i + start) % 4;
                let nx = ax + moves[j][0], ny = ay + moves[j][1];
                if(!(nx >= 1 && nx <= n && ny >= 1 && ny <= m)) continue;
                if(open[nx][ny] != 1) {
                    adir = j + 1;
                    return true;
                }
            }
            return false;
        }
        adir = f;
        return true;
    }
    return true;
}

let mode = 1;

document.addEventListener('keydown', function(event) {
    let press = event.key.toLowerCase();
    let cand = -1, acand = -1;
    if(mode == 1) {
        if(press == "w" || press == "arrowup") cand = 1;
        if(press == "d" || press == "arrowright") cand = 2;
        if(press == "s" || press == "arrowdown") cand = 3;
        if(press == "a" || press == "arrowleft") cand = 4;
    }
    else {
        if(press == "w") cand = 1;
        if(press == "d") cand = 2;
        if(press == "s") cand = 3;
        if(press == "a") cand = 4;
        if(press == "arrowup") acand = 1;
        if(press == "arrowright") acand = 2;
        if(press == "arrowdown") acand = 3;
        if(press == "arrowleft") acand = 4;
    }
    if((cand != -1 || acand != -1) && playing == 0) {
        playing = 1;
        interval = setInterval(update, cd);
        document.getElementById("ins").textContent = "";
    }
    if(press == " " && playing == 1) reset();
    if(cand != (last + 1) % 4 + 1 && cand != -1 && cand != dir) dir = cand;
    if(acand != (alast + 1) % 4 + 1 && acand != -1 && acand != adir) adir = acand;
    if(press == "p" && document.getElementById("ins").textContent != "") {
        if(mode == 1) {
            mode = 2;
            document.getElementById("mode").textContent = "2 Player Mode";
            document.getElementById("stats").style.opacity = "0%";
        }
        else {
            mode = 1;
            document.getElementById("mode").textContent = "Computer Mode";
            document.getElementById("stats").style.opacity = "100%";
        }
    }
});

init();
reset();