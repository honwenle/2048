var WRAP_SIZE = 500;
var SIZE = WRAP_SIZE / 5;
var GAP_SIZE = SIZE / 5;
var COLOR = ['CDC1B4','EEE4DA','EDE0C8']

var back = document.getElementById('back'),
    cvs = document.getElementById('main');
var ctxBack = back.getContext('2d'),
    ctx = cvs.getContext('2d');
back.width = WRAP_SIZE;
back.height = WRAP_SIZE;
cvs.width = WRAP_SIZE;
cvs.height = WRAP_SIZE;
var ani;

var blocks = [];
var list = {};

function roundRect (x, y, w, h, r, context) {
    context = context || ctx;
    context.beginPath();
    context.moveTo(x+r, y);
    context.lineTo(x+w-r, y);
    context.arcTo(x+w, y, x+w, y+r, r);
    context.lineTo(x+w, y+h-r);
    context.arcTo(x+w, y+h, x+w-r, y+h, r);
    context.lineTo(x+r, y+h);
    context.arcTo(x, y+h, x, y+h-r, r);
    context.lineTo(x, y+r);
    context.arcTo(x, y, x+r, y, r);
    context.closePath();
    context.fill();
}

function preloadBlock(n) {
    var cvsBlcok = document.createElement('canvas');
    var ctxBlock = cvsBlcok.getContext('2d');
    cvsBlcok.width = SIZE;
    cvsBlcok.height = SIZE;
    ctxBlock.fillStyle = '#' + COLOR[n];
    roundRect(0, 0, SIZE, SIZE, GAP_SIZE/2, ctxBlock);
    ctxBlock.fillStyle = '#716A63';
    ctxBlock.font = SIZE/2 + 'px 微软雅黑';
    if (n > 0) {
        ctxBlock.textAlign = 'center';
        ctxBlock.textBaseline = 'middle';
        ctxBlock.fillText(Math.pow(2, n), SIZE/2, SIZE/2);
    }
    blocks.push(cvsBlcok);
}

function drawBack () {
    ctxBack.fillStyle = '#BBADA0';
    roundRect(0, 0, WRAP_SIZE, WRAP_SIZE, GAP_SIZE/2, ctxBack);
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var x = GAP_SIZE * (i+1) + SIZE * i,
                y = GAP_SIZE * (j+1) + SIZE * j
            ctxBack.drawImage(blocks[0], x, y);
            list[getID(i,j)] = {
                n: null,
                size: 0
            };
        }
    }
}

function zoomInBlock () {
    ctx.clearRect(0, 0, WRAP_SIZE, WRAP_SIZE);
    for (var i in list) {
        var obj = list[i];
        if (obj.n) {
            var xy = getXY(i);
            if (obj.size < SIZE) {
                obj.size += 10;
            }
            ctx.drawImage(blocks[obj.n],
                GAP_SIZE * (xy.x+1) + SIZE * xy.x + (SIZE-obj.size)/2,
                GAP_SIZE * (xy.y+1) + SIZE * xy.y + (SIZE-obj.size)/2,
                obj.size,
                obj.size
            );
        }
    }
    ani = requestAnimationFrame(zoomInBlock);
}
function drawBlock (x, y, n) {
    ctx.drawImage(blocks[n],
        GAP_SIZE * (x+1) + SIZE * x,
        GAP_SIZE * (y+1) + SIZE * y
    );
}
function newBlock() {
    var arr = [];
    for (var i in list) {
        if (list[i].n == null) {
            arr.push(i);
        }
    }
    if (arr.length > 0) {
        var id = arr[~~(Math.random() * arr.length)];
        list[id].n = getRandN();
    } else {
        console.log('nonono')
    }
}
function getRandN() {
    return ~~(Math.random() * blocks.length-1) + 1;
}
function getID (x, y) {
    return y*10 + x;
}
function getXY (id) {
    return {
        x: id%10,
        y: ~~(id/10)
    }
}

function init () {
    for (var i = 0; i < 3; i++) {
        preloadBlock(i);
    }
    drawBack();
    newBlock();
    newBlock();
    zoomInBlock();
}

init();