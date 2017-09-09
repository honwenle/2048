var WRAP_SIZE = 500; // 整个尺寸
var SIZE = WRAP_SIZE / 5; // 格子尺寸
var GAP_SIZE = SIZE / 5; // 间隙尺寸
var COLOR = ['CDC1B4','EEE4DA','EDE0C8','F2B179','F59563','F57C5F','F65E3B']

var back = document.getElementById('back'),
    cvs = document.getElementById('main');
var ctxBack = back.getContext('2d'),
    ctx = cvs.getContext('2d');
back.width = WRAP_SIZE;
back.height = WRAP_SIZE;
cvs.width = WRAP_SIZE;
cvs.height = WRAP_SIZE;
var ani; // 动画对象
var sX, sY; // 触摸起点

var blocks = []; // 格子类型列表
var list = {}; // 格子列表
var highN;
// 画圆角矩形
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
// 小方格素材(n决定颜色和数字)
function preloadBlock(n) {
    highN = n;
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
// 画背景
function drawBack () {
    ctxBack.fillStyle = '#BBADA0';
    roundRect(0, 0, WRAP_SIZE, WRAP_SIZE, GAP_SIZE/2, ctxBack);
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var x = getPos(i),
                y = getPos(j)
            ctxBack.drawImage(blocks[0], x, y);
            list[getID(i,j)] = {
                n: null,
                size: 0
            };
        }
    }
}
var isAni, needNew;
// 遍历每个格子的目标值，进行动画
function moveBlock () {
    ctx.clearRect(0, 0, WRAP_SIZE, WRAP_SIZE);
    isAni = false, needNew = false;
    for (var i = 0; i < 4; i++) {
        for (var j = (inv==1 ? 0 : 3); j <= 3 && j >= 0; j += inv) {
            var id = dir == 'x' ? getID(j, i) : getID(i, j);
            var obj = list[id];
            if (obj.n) {
                if (obj.size < SIZE) {
                    isAni = true;
                    obj.size += 10;
                }
                if (obj.pos) {
                    var _pos = dir == 'x' ? getPos(obj.col) : getPos(obj.row);
                    if (obj.pos != _pos) {
                        isAni = true;
                        obj.pos = obj.dt < 0 ? Math.max(obj.pos + obj.dt, _pos) : Math.min(obj.pos + obj.dt, _pos);
                    } else {
                        setBlock(getID(obj.col, obj.row), obj.col, obj.row, obj.n);
                        setBlock(id);
                        obj.pos = undefined;
                        needNew = true;
                    }
                }
                ctx.drawImage(blocks[obj.n],
                    (dir=='x' && obj.pos) || getPos(obj.col) + (SIZE-obj.size)/2,
                    (dir=='y' && obj.pos) || getPos(obj.row) + (SIZE-obj.size)/2,
                    obj.size,
                    obj.size
                );
            }
        }
    }
    if (isAni) {
        ani = requestAnimationFrame(moveBlock);
    } else {
        if (needNew) {
            newBlock();
            newBlock();
            ani = requestAnimationFrame(moveBlock);
        }
    }
}
// 计算并设置新坐标
var dir = 'x', inv = 1;
function calcBlock (direction, inverse) {
    dir = direction;
    inv = inverse;
    for (var i = 0; i < 4; i++) {
        var ct = 0,
            last = undefined;
        for (var j = (inv==1 ? 0 : 3); j <= 3 && j >= 0; j += inv) {
            var id = dir == 'x' ? getID(j, i) : getID(i, j);
            var obj = list[id];
            if (!obj.n) {
                ct ++;
            } else {
                if (last && last.n == obj.n) {
                    ct ++;
                    obj.n ++;
                    if (obj.n > highN) {
                        preloadBlock(obj.n);
                    }
                } else {
                    last = obj;
                }
                if (ct != 0) {
                    var _col = dir == 'x' ? j-ct*inv : i;
                    var _row = dir == 'x' ? i : j-ct*inv;
                    setBlock(id, _col, _row, obj.n,
                        getPos(j),
                        (getPos(j-ct*inv) - getPos(j))/10
                    );
                }
            }
        }
    }
    moveBlock();
}
// 新增一个随机格子
function newBlock() {
    var arr = [];
    for (var i in list) {
        if (list[i].n == null) {
            arr.push(i);
        }
    }
    if (arr.length > 0) {
        var id = arr[~~(Math.random() * arr.length)];
        setBlock(id, id%10, ~~(id/10), getRandN(), undefined, undefined, 0);
    } else {
        console.log('没地加了')
    }
}
function setBlock (id, col, row, n = null, pos, dt, size = SIZE) {
    list[id] = {
        col,row,n,pos,dt,size
    };
}
function getRandN() {
    return Math.random() > .8 ? 2 : 1;
}
function getPos (n) {
    return GAP_SIZE * (n+1) + SIZE * n;
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
// 监听用户输入方向
function userPlay() {
    cvs.addEventListener('touchstart', function (e) {
        e.preventDefault();
        sX = e.touches[0].pageX;
        sY = e.touches[0].pageY;
    }, false);
    cvs.addEventListener('touchend', function (e) {
        if (isAni) {
            return false;
        }
        var eX = e.changedTouches[0].pageX,
            eY = e.changedTouches[0].pageY;
        var dtX = eX - sX,
            dtY = eY - sY;
        if (dtX > 20 && dtX > Math.abs(dtY)) {
            calcBlock('x', -1);
        } else if (dtX < -20 && dtX < -Math.abs(dtY)) {
            calcBlock('x', 1);
        } else if (dtY > 20) {
            calcBlock('y', -1);
        } else if (dtY < -20) {
            calcBlock('y', 1);
        }
    }, false);
    document.onkeyup = function (e) {
        if (isAni) {
            return false;
        }
        switch (e.keyCode) {
            case 37:
                calcBlock('x', 1);
                break;
            case 38:
                calcBlock('y', 1);
                break;
            case 39:
                calcBlock('x', -1);
                break;
            case 40:
                calcBlock('y', -1);
                break;
            default:
                break;
        }
    }
}
// 初始化
function init () {
    for (var i = 0; i < 3; i++) {
        preloadBlock(i);
    }
    drawBack();
    newBlock();
    newBlock();
    moveBlock();
    userPlay();
}
init();