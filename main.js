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

var blocks = [];

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
            ctxBack.drawImage(blocks[0],
                GAP_SIZE * (i+1) + SIZE * i,
                GAP_SIZE * (j+1) + SIZE * j);
        }
    }
}

function drawBlock (x, y, n) {
    ctx.drawImage(blocks[n],
        GAP_SIZE * (x+1) + SIZE * x,
        GAP_SIZE * (y+1) + SIZE * y);
}
function newBlock() {
    drawBlock(getRand4(), getRand4(), getRandN());
    drawBlock(getRand4(), getRand4(), getRandN());
}
function getRand4() {
    return ~~(Math.random() * 4);
}
function getRandN() {
    return ~~(Math.random() * blocks.length-1) + 1;
}

for (var i = 0; i < 3; i++) {
    preloadBlock(i);
}
drawBack();
newBlock();