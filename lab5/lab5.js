var ctx = document.querySelectorAll('#canvas')[0].getContext('2d')

var scale = 3

var abs = Math.abs

var color = '#000'

var animate = false

var Point = (x, y) => ({x: x, y: y})
var Point3 = (x, y, z) => ({x: x, y: y, z: z})
var SubPoint3 = (a, b) => ({x: a.x-b.x, y: a.y-b.y, z: a.z-b.z}) // вычитание векторов
var AddPoint3 = (a, b) => ({x: a.x+b.x, y: a.y+b.y, z: a.z+b.z})
var MulPoint3 = (a, f) => ({x: a.x*f, y: a.y*f, z: a.z*f})
var IntPoint3 = (a) => ({x: a.x|0, y: a.y|0, z: a.z|0}) // округление

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

    prev = coords[coords.length-1]

    for(var i=0; i<coords.length; i++) {
        line(prev.x, prev.y, coords[i].x, coords[i].y)
        prev = coords[i]
    }
}

var canvasW = 1000
var canvasH = 500
var zBuffer = []

function paint() {
    for(var i=0; i<canvasW*canvasH; i++) {
        zBuffer[i] = -1/0
    }
    ctx.fillStyle = '#FFF'
    ctx.fillRect(0, 0, 1000, 500)
    scale = document.querySelectorAll('#scale')[0].value

    var tr1 = [
        Point3(10, 10, 0),
        Point3(60, 20, 50),
        Point3(20, 70, 0)
    ]

    var tr2 = [
        Point3(90, 10, 0),
        Point3(40, 20, 50),
        Point3(80, 70, 0)
    ]

    var tr3 = [
        Point3(20, 20, 25),
        Point3(80, 20, 25),
        Point3(40, 70, 25)
    ]

    color='#0F0'
    triangle(tr1[0], tr1[1], tr1[2])
    color='#F00'
    triangle(tr2[0], tr2[1], tr2[2])
    color='#00F'
    triangle(tr3[0], tr3[1], tr3[2])

    color='#0F0'
    //polygon(tr1)
    color='#F00'
    //polygon(tr2)
    color='#00F'
    //polygon(tr3)
}

document.querySelectorAll('#scale')[0].onchange = paint

paint()

function triangle(p0, p1, p2) {
    if (p0.y==p1.y && p0.y==p2.y) return; // i dont care about degenerate triangles
    if (p0.y>p1.y) {
        var t = p0
        p0 = p1
        p1 = t
    }
    if (p0.y>p2.y) {
        var t = p0
        p0 = p2
        p2 = t
    }
    if (p1.y>p2.y) {
        var t = p2
        p2 = p1
        p1 = t
    }

    var totalHeight = p2.y-p0.y
    for (var i=0; i<totalHeight; i++) {
        var isSecondHalf = i>p1.y-p0.y || p1.y==p0.y
        var segmentHeight = isSecondHalf ? p2.y-p1.y : p1.y-p0.y
        var alpha = i/totalHeight
        var beta = (i-(isSecondHalf ? p1.y-p0.y : 0))/segmentHeight
        var A = IntPoint3(AddPoint3(p0, MulPoint3(SubPoint3(p2, p0), alpha)))
        var B = isSecondHalf ? 
            IntPoint3(AddPoint3(p1, MulPoint3(SubPoint3(p2, p1), beta))) : 
            IntPoint3(AddPoint3(p0, MulPoint3(SubPoint3(p1, p0), beta)))
        if (A.x>B.x) {
            var t = A
            A = B
            B = t
        }
        for (var j=A.x; j<=B.x; j++) {
            var phi = B.x==A.x ? 1 : (j-A.x)/(B.x-A.x)
            var P = IntPoint3(AddPoint3(A, MulPoint3(SubPoint3(B, A), phi)))
            var idx = P.x+P.y*canvasW
            //console.log(P)
            if (zBuffer[idx]<P.z) {
                zBuffer[idx] = P.z
                dot(P.x, P.y)
            }
        }
    }
}