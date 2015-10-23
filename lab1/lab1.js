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

function circle2(cx, cy, r) { // не совсем круглое, шире на 2px
	var x = 0
	var y = r

	var delta = 1 - 2*r
	var error = 0

	while(y>=0) {
		dot(cx+x, cy+y)
		dot(cx+x, cy-y)
		dot(cx-x, cy+y)
		dot(cx-x, cy-y)

		error = 2 * (delta + y) - 1
		if(delta<0 && error<=0) {
			delta +=2 * ++x + 1
			continue
		}
		error = 2 * (delta - x) - 1
		if(delta>0 && error>0) {
			delta += 1 -2* --y
			continue
		}
		x++
		delta += 2* (x-y)
		y--
	}
}

function circle(cx, cy, r) {
	var dfs = 6, dfd = 4*(-r)+10;
	var F = -2 * r +3 // ??? //+ (r-1)*(r-1) + 1//-103; // 53^2 + 1^2 + 52^2 + 1^2 - 2*53^2
	var x = -r, y = 0;
	var x0=cx, y0=cy;
	while (x+y<=0) {
		dot(x0+x, y0+y)
		dot(x0-x, y0+y)
		dot(x0+x, y0-y)
		dot(x0-x, y0-y)
		dot(x0+y, y0+x)
		dot(x0-y, y0+x)
		dot(x0+y, y0-x)
		dot(x0-y, y0-x)
		if (F>0) {
			x++;
			F+=dfd;
			dfd+=4;
		} else {
			F+=dfs;
		}
		dfd+=4;
		dfs+=4;
		y++;
	}
}

var animFrame = 0

function paint() {
	ctx.fillStyle = '#FFF'
	ctx.fillRect(0, 0, 1000, 500)
	scale = document.querySelectorAll('#scale')[0].value

	//color = '#000'

	for(var i=0; i<10; i++) {
		line(0, 0, 100, 11.1111*i+animFrame)
	}

	circle(200, 70, 53)
	circle(200, 70, 43)
	circle(200, 70, 33+animFrame)

	//color = '#F00'
	//circle(200, 70, 34)
}

document.querySelectorAll('#scale')[0].onchange = paint
document.querySelectorAll('#anim')[0].onchange = ()=>{animate=!animate}

setInterval(function() {
	if(animate) {
		animFrame++
		if(animFrame==11) {
			animFrame=0
		}
		color = '#'+((Math.random()*1000000/2+100000)|0)
	} else {
		animFrame = 0
	}
	paint()
}, 100)

paint()