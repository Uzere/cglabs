var ctx = document.querySelectorAll('#canvas')[0].getContext('2d')

var scale = 3

var abs = Math.abs

var color = '#000'

var animate = false

var dot = (x, y) => { ctx.fillStyle=color; ctx.fillRect((x|0)*scale, (y|0)*scale, 1*scale, 1*scale) }

function line(ax, ay, bx, by) {
    var steep = false
    if(abs(ax-bx)<abs(ay-by)) {
        ax = ay + (ay=ax, 0) // swap swap swap
        bx = by + (by=bx, 0)
        steep = true
    }
    if(ax>bx) {
        ax = bx + (bx=ax, 0)
        ay = by + (by=ay, 0)
    }
    var dx = bx-ax
    var dy = by-ay

    var derror2 = abs(dy)*2
    var error2 = 0

    var y = ay
    for(var x=ax; x<=bx; x++) {
        if(steep) {
            dot(y, x)
        } else {
            dot(x, y)
        }
        error2 += derror2
        if(error2 > dx) {
            y += (by>ay? 1:-1)
            error2 -= dx*2
        }

    }
}

function polygon(coords) {
    if(coords.length==0) {
        return
    }
    prevX = coords[coords.length-2]
    prevY = coords[coords.length-1]

    for(var i=0; i<=coords.length; i=i+2) {
        line(prevX, prevY, coords[i], coords[i+1])
        prevX = coords[i]
        prevY = coords[i+1]
    }
}


var coords = []

function mult(m, v) {
    var u=[0, 0, 0]
    for(var i=0; i<3;i++)
        for(var j=0; j<3; j++)
            u[i]+=m[i+j*3]*v[j]
    return u
}

function transform(m) {
    for(var i=0; i<coords.length; i=i+2) {
        var v = mult(m, [coords[i], coords[i+1], 1])
        coords[i] = v[0]
        coords[i+1] = v[1]
    } 
}

function move(dx, dy) {
    m = [
        1, 0, 0, 
        0, 1, 0, 
        dx, dy, 1
    ]
    return transform(m)
}

function rotate(angle) {
    m = [
        Math.cos(angle), Math.sin(angle), 0,
        (-1)*Math.sin(angle), Math.cos(angle), 0,
        0, 0, 1
    ]
    return transform(m)
}

function mscale(factor) {
    m = [
        factor, 0, 0,
        0, factor, 0,
        0, 0, 1
    ];
    return transform(m)
}

function paint() {
    ctx.fillStyle = '#FFF'
    ctx.fillRect(0, 0, 1000, 500)
    scale = document.querySelectorAll('#scale')[0].value

    color='#0F0'
    polygon(coords)
}

var $ = document.querySelector.bind(document) // such jQuery
$('#scaleBtn').addEventListener('click', function(e) {
    var factor = $('#mscale').value || 1
    mscale(factor)
})

$('#moveBtn').addEventListener('click', function(e) {
    var dx = $('#moveX').value || 0
    var dy = $('#moveY').value || 0
    move(dx, dy)
})

$('#rotateBtn').addEventListener('click', function(e) {
    var angle = $('#rotate').value || 0
    rotate(angle)
})

document.querySelectorAll('#scale')[0].onchange = paint
//document.querySelectorAll('#anim')[0].onchange = ()=>{animate=!animate}

document.querySelectorAll('#canvas')[0].addEventListener('click', e=>{
    //e.preventDefault()
    console.log(e.which)
    if(e.which==1) {
        coords.push(e.offsetX/scale|0)
        coords.push(e.offsetY/scale|0)
    } else if(e.which==2) {
        coords = []
    }
    paint()
})

document.querySelectorAll('#canvas')[0].addEventListener('contextmenu', e=>{
    coords.pop()
    coords.pop()
})

setInterval(function() {
    paint()
}, 100)

paint()