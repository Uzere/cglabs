var ctx = document.querySelectorAll('#canvas')[0].getContext('2d')

var scale = 3

var abs = Math.abs

var dot = (x, y) => { ctx.fillStyle='#000000'; ctx.fillRect(x*scale, y*scale, 1*scale, 1*scale) }

function line(ax, ay, bx, by) {
	/*var delta = 3
	var y = 0

	dot(10, 10)

	for(var i=0; i<50; i++) {
		if(delta>=5) {
			y += 1
			delta -= 10
		}
		delta += i
		dot(ax+i, y)
	}*/
	//
}

function circle(x, y, r) {

}




function paint() {
	ctx.fillStyle = '#FFF'
	ctx.fillRect(0, 0, 500, 500)
	scale = document.querySelectorAll('#scale')[0].value

	for(var i=0; i<10; i++) {
		line(0, 0, 100, 11.1111*i)
	}
}

scale = document.querySelectorAll('#scale')[0].onchange = paint

paint()