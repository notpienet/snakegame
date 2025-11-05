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
        row.append(grid);
    }
    game.append(row);
}

const pos = [[Math.ceil(n / 2), Math.ceil(m / 2)]];
let x = pos[0][0], y = pos[0][1];
let dir = 2, last = 2;

function update() {
    for(let i = 1; i <= n; i++) {
        for(let j = 1; j <= m; j++) {
            const grid = document.getElementById(i.toString() + "_" + j.toString());
            grid.style.backgroundImage = 'url("assets/-.png")';
        }
    }
    let a = 0, b = 0;
    for(let i = 0; i + 1 < pos.length; i++) {
        if(pos[i + 1][0] == pos[i][0] + 1) b = 3;
        if(pos[i + 1][0] == pos[i][0] - 1) b = 1;
        if(pos[i + 1][1] == pos[i][1] + 1) b = 2;
        if(pos[i + 1][1] == pos[i][1] - 1) b = 4;
        console.log(pos[i][0].toString() + "_" + pos[i][1].toString());
        const grid = document.getElementById(pos[i][0].toString() + "_" + pos[i][1].toString());
        grid.style.backgroundImage = "url(assets/" + Math.min(a, b).toString() + Math.max(a, b).toString() + ".png)";
        a = ((b + 1) % 4 + 1);
    }
    x = pos[pos.length - 1][0].toString();
    y = pos[pos.length - 1][1].toString();
    const temp = document.getElementById(x + "_" + y);
    temp.style.backgroundImage = "url(assets/0" + a.toString() + ".png)";
    last = dir;
    if(dir == 1) pos.push([x - 1][y]);
}