var ctx = document.querySelectorAll('#canvas')[0].getContext('2d')

var scale = 3

var abs = Math.abs

var dot = (x, y) => { ctx.fillStyle='#000000'; ctx.fillRect(x*scale, y*scale, 1*scale, 1*scale) }

function line(ax, ay, bx, by) {
	var steep = false
	if(abs(ax-bx)<abs(ay-bx)) {
		ax = ay + (ay=ax, 0) // swap swap swap
		bx = by + (by=bx, 0)
		steep = true
	}
	if(ax>ay) {
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

function circle(x, y, r) {
	
}




function paint() {
	ctx.fillStyle = '#FFF'
	ctx.fillRect(0, 0, 1000, 500)
	scale = document.querySelectorAll('#scale')[0].value

	for(var i=0; i<10; i++) {
		line(0, 0, 100, 11.1111*i)
	}
}

scale = document.querySelectorAll('#scale')[0].onchange = paint

paint()