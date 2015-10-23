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

function rgbToHex(r, g, b) {
	if (r > 255 || g > 255 || b > 255)
		throw "Invalid color component";
	return ((r << 16) | (g << 8) | b).toString(16);
}

function getPixelColor(fx, fy) {
	var p = ctx.getImageData(fx*scale, fy*scale, 1, 1).data;
	var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
	return hex;
}

function findBorders() {
	var xmax = coords[0]; var ymax = coords[1];
	var xmin = coords[0]; var ymin = coords[1];
	for (var i=2; i<coords.length; i+=2) {
		if (coords[i] > xmax) {xmax = coords[i]}
		if (coords[i] < xmin) {xmin = coords[i]}
		if (coords[i+1] > ymax) {ymax = coords[i+1]}
		if (coords[i+1] < ymin) {ymin = coords[i+1]}
	}
	return {
		xmax: xmax,
		xmin: xmin,
		ymin: ymin,
		ymax: ymax
	}
}

function betterFillPolygon() {
	var borders = findBorders()

	var points=[]
	for(var y=borders.ymin; y<=borders.ymax; y++) {
		points[y] = []
	}

	var prevX = coords[coords.length-2]
	var prevY = coords[coords.length-1]

	for(var i=0; i<coords.length; i+=2) {
		if(prevX < coords[i]) {
			var lx = prevX
			var ly = prevY
			var rx = coords[i] 
			var ry = coords[i+1] 
		} else {
			var lx = coords[i]
			var ly = coords[i+1]
			var rx = prevX
			var ry = prevY
		}

		for(var fy = Math.min(prevY, coords[i+1]); fy<=Math.max(prevY, coords[i+1]); fy++) {
			var dy = ry - ly
			var tan = dy / Math.abs(prevX - coords[i])

			var x = lx + ((fy - ly) / tan)|0
			//console.log(x, fy)
			//ctx.fillStyle = '#00F'
			//ctx.fillRect(x, fy, 1, 1);
			if(points[fy].indexOf(x)==-1) {
				points[fy].push(x)
			} else {
				points[fy].splice(points[fy].indexOf(x), 1)
			}

		}

		prevX = coords[i]
		prevY = coords[i+1]
	}

	for(var y=borders.ymin; y<borders.ymax; y++) {
		points[y] = points[y].sort()
		console.log(points[y])

		for(var i=0; i<points[y].length; i+=2) {
			line(points[y][i]+1, y, points[y][i+1]-1, y)
		}
	}

}


function bestFillPolygon() {
	var borders = findBorders()
	var nodes, nodeX = [], pixelX, pixelY, i, j, swap;
	var logData = []

	for (pixelY = borders.ymin; pixelY < borders.ymax; pixelY++) {

		nodes = 0;
		j = coords.length - 2;
		for (i = 0; i < coords.length; i+=2) {
			if (coords[i+1] < pixelY && coords[j+1] >= pixelY || coords[j+1] < pixelY && coords[i+1] >= pixelY) {
				nodeX[nodes++] = (coords[i] + (pixelY - coords[i+1]) / (coords[j+1] - coords[i+1]) * (coords[j] - coords[i]))|0;
				logData.push([coords[i], coords[i+1],coords[j], coords[j+1]])
			}
			j = i;
		}

		i = 0;
		while (i < nodes - 1) {
			if (nodeX[i] > nodeX[i + 1]) {
				swap = nodeX[i];
				nodeX[i] = nodeX[i + 1];
				nodeX[i + 1] = swap;
				if (i) i--;
			} else {
				i++;
			}
		}//*/
		//console.log(1, nodeX)
		//nodeX = nodeX.sort()
		/*var s1 = nodeX.toString()
		nodeX.sort(function(a, b) {
			return a - b;
		})//*/
		/*var s2 = nodeX.toString()
		if(s1!=s2) {
			console.log(pixelY, s1, s2)
			color = '#00F'
		}*/


		for (i = 0; i < nodes; i += 2) {
			for (pixelX = nodeX[i]; pixelX < nodeX[i + 1]; pixelX++) dot(pixelX+1, pixelY);
		}
		color = '#F00'
	}
}




var animFrame = 0
var coords = []

function paint() {
	ctx.fillStyle = '#FFF'
	ctx.fillRect(0, 0, 1000, 500)
	scale = document.querySelectorAll('#scale')[0].value

	//color = '#000'

	/*for(var i=0; i<10; i++) {
		line(0, 0, 100, 11.1111*i+animFrame)
	}

	circle(200, 70, 53)
	circle(200, 70, 43)
	circle(200, 70, 33+animFrame)*/
	color='#F00'
	//betterFillPolygon()
	bestFillPolygon()
	color='#0F0'
	polygon(coords)
	//color = '#F00'
	//circle(200, 70, 34)
}

document.querySelectorAll('#scale')[0].onchange = paint
document.querySelectorAll('#anim')[0].onchange = ()=>{animate=!animate}

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