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



line(20, 10, 20+3, 100)

var array = [10, 11, 12, 14, 15, 20, 25]

var i = 0
while(true) {
	var start = i
	var end = i + 1
	while(array[end]-array[end-1]<=1) {
		end++
		if(end==array.length) {
			break
		}
	}
	while(array[end+1]-array[end]<=1) {
		end++
		if(end==array.length) {
			break
		}
	}

	line(array[start], 110, array[end], 110)

	i = end+1
	if(i>=array.length) {
		break
	}
}

line(10, 111, 15, 111) // для сравнения
line(20, 111, 25, 111)