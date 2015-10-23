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

function clipLine(ax, ay, bx, by, bounds) {
	var codeA = bitCode(ax, ay, bounds)
	var codeB = bitCode(bx, by, bounds)
	var codeOut, p, px, py, newCode

	while (true) {
		if (!(codeA | codeB)) {
			return [ax, ay, bx, by]
		} else if (codeA & codeB) {
			return false
		} else {
			codeOut = codeA || codeB
			p = getEdgeIntersection(ax, ay, bx, by, codeOut, bounds)
			px = p[0], py = p[1]
			newCode = bitCode(p[0], p[1], bounds)

			if (codeOut === codeA) {
				ax = px
				ay = py
				codeA = newCode
			} else {
				bx = px
				by = py
				codeB = newCode
			}
		}
	}
}

function getEdgeIntersection(ax, ay, bx, by, code, bounds) {
	var dx = bx - ax
	var dy = by - ay

	if (code & 8) { // bottom
		return [ax + dx * (bounds.bottom - ay) / dy, bounds.bottom]
	} else if (code & 4) { // top
		return [ax + dx * (bounds.top - ay) / dy, bounds.top]
	} else if (code & 2) { // right
		return [bounds.right, ay + dy * (bounds.right - ax) / dx]
	} else if (code & 1) { // left
		return [bounds.left, ay + dy * (bounds.left - ax) / dx]
	}
}

function bitCode(x, y, bounds) {
	var code = 0

	if (x < bounds.left) { // left
		code |= 1
	} else if (x > bounds.right) { // right
		code |= 2
	}
	if (y < bounds.top) { // top
		code |= 4
	} else if (y > bounds.bottom) { // bottom
		code |= 8
	}

	return code
}


var animFrame = 0
var coords = []

var bounds = {
	top: 10,
	bottom: 150,
	left: 10,
	right: 150
}

function paint() {
	ctx.fillStyle = '#FFF'
	ctx.fillRect(0, 0, 1000, 500)
	scale = document.querySelectorAll('#scale')[0].value

	color='#0F0'
	polygon(coords)

	color = '#000'
	line(bounds.left, bounds.top, bounds.left, bounds.bottom)
	line(bounds.left, bounds.top, bounds.right, bounds.top)
	line(bounds.left, bounds.bottom, bounds.right, bounds.bottom)
	line(bounds.right, bounds.top, bounds.right, bounds.bottom)

	color = '#F00'
	if(coords.length==0) {
		return
	}
	prevX = coords[coords.length-2]
	prevY = coords[coords.length-1]

	for(var i=0; i<coords.length; i=i+2) {
		var clipped = clipLine(prevX, prevY, coords[i], coords[i+1], bounds)
		if(clipped) {
			line(clipped[0], clipped[1], clipped[2], clipped[3])
		}

		prevX = coords[i]
		prevY = coords[i+1]
	}
}

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
	if(animate) {
		animFrame++
		if(animFrame==11) {
			animFrame=0
		}
		//color = '#'+((Math.random()*1000000/2+100000)|0)
	} else {
		animFrame = 0
	}
	paint()
}, 100)

paint()