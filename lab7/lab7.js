var pow = Math.pow
var sqrt = Math.sqrt

function method(triangle) {
	var N = []
	var M = []
	var M1 = []
	for (i = 0; i < 3; i++) {
		for (j = 0; j < 3; j++) {
			M[i * 4 + j] = triangle[i * 3 + j]
		}
		M[i * 4 + 3] = 1
	}
	for (i = 0; i < 12; i++) M1[i] = M[i]
	for (k = 0; k < 2; k++) {
		for (i = k + 1; i < 3; i++) {
			for (j = 0; j < 4; j++) {
				M1[i * 4 + j] = M[i * 4 + j] * M[k * 4 + k] - M[k * 4 + j] * M[i * 4 + k]
			}
		}
		for (i = 0; i < 12; i++) M[i] = M1[i]
	}
	N[3] = 1
	N[2] = (-1) * M[11] / M[10]
	N[1] = ((-1) * M[7] - N[2] * M[6]) / M[5]
	N[0] = ((-1) * M[3] - N[2] * M[2] - N[1] * M[1]) / M[0]
	return N
}


function line(ctx, x0, y0, x1, y1, mode) {
	var delta = 0
	var or = 1
	if (y1 < y0) or = -1
	var y = 0
	for (x = 0; x < (x1 - x0); x++) {
		if (delta >= (x1 - x0)) {
			y++
			delta -= 2 * (x1 - x0)
		}
		delta += 2 * or * (y1 - y0)
		if (mode) ctx.fillRect(x + x0, y * or + y0, 1, 1)
		else ctx.fillRect(y * or + y0, x + x0, 1, 1)
	}
}

function draw_line(ctx, x0, y0, x1, y1, color) {
	ctx.fillStyle = color
	if (Math.abs(x1 - x0) >= Math.abs(y1 - y0)) {
		if (x1 >= x0) line(ctx, x0, y0, x1, y1, 1)
		else line(ctx, x1, y1, x0, y0, 1)
	} else {
		if (y1 >= y0) line(ctx, y0, x0, y1, x1, 0)
		else line(ctx, y1, x1, y0, x0, 0)
	}
	ctx.fillStyle = '#000000'
}

function lineR(ctx, x0, y0, x1, y1, mode, yc) {
	var delta = 0
	var or = 1
	if (y1 < y0) or = -1
	var y = 0
	for (x = 0; x < (x1 - x0); x++) {
		if (delta >= (x1 - x0)) {
			y++
			delta -= 2 * (x1 - x0)
		}
		delta += 2 * or * (y1 - y0)
		if (mode) {
			if (yc == y * or + y0) return x + x0
		} else if (yc == x + x0) return y * or + y0
	}
}

function dLine(ctx, x0, y0, x1, y1, yc) {
	if (Math.abs(x1 - x0) >= Math.abs(y1 - y0)) {
		if (x1 >= x0) return lineR(ctx, x0, y0, x1, y1, 1, yc)
		else return lineR(ctx, x1, y1, x0, y0, 1, yc)
	} else {
		if (y1 >= y0) return lineR(ctx, y0, x0, y1, x1, 0, yc)
		else return lineR(ctx, y1, x1, y0, x0, 0, yc)
	}
}

function draw_triangle(ctx, triangle, color) {
	draw_line(ctx, triangle[0], triangle[1], triangle[3], triangle[4], color)
	draw_line(ctx, triangle[3], triangle[4], triangle[6], triangle[7], color)
	draw_line(ctx, triangle[6], triangle[7], triangle[0], triangle[1], color)
}

function rgbToHex(r, g, b) {
	if (r > 255 || g > 255 || b > 255)
		throw "Invalid color component"
	return ((r << 16) | (g << 8) | b).toString(16)
}

function getPixelColor(fx, fy) {
	var p = ctx.getImageData(fx, fy, 1, 1).data
	var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6)
	return hex
}

function icosahedron(ctx, xx, yy, zz) {
	var triangle = []
	var i
	for (i = 1; i < 4; i++) {
		triangle = [xx[0], yy[0], zz[0], xx[i], yy[i], zz[i], xx[i + 1], yy[i + 1], zz[i + 1]]
		draw_triangle(ctx, triangle, '#0000ff')
		N = method(triangle)
		fillPixels(triangle, N, light)
		draw_triangle(ctx, triangle, '#0000ff')
	}
	for (i = 2; i < 4; i++) {
		triangle = [xx[i], yy[i], zz[i], xx[i + 4], yy[i + 4], zz[i + 4], xx[i + 5], yy[i + 5], zz[i + 5]]
		draw_triangle(ctx, triangle, '#0000ff')
		N = method(triangle)
		fillPixels(triangle, N, light)
		draw_triangle(ctx, triangle, '#0000ff')
	}
	for (i = 1; i < 4; i++) {
		triangle = [xx[i], yy[i], zz[i], xx[i + 1], yy[i + 1], zz[i + 1], xx[i + 5], yy[i + 5], zz[i + 5]]
		draw_triangle(ctx, triangle, '#0000ff')
		N = method(triangle)
		fillPixels(triangle, N, light)
		draw_triangle(ctx, triangle, '#0000ff')
	}
	for (i = 6; i < 8; i++) {
		triangle = [xx[11], yy[11], zz[11], xx[i], yy[i], zz[i], xx[i + 1], yy[i + 1], zz[i + 1]]
		draw_triangle(ctx, triangle, '#0000ff')
		N = method(triangle)
		fillPixels(triangle, N, light)
		draw_triangle(ctx, triangle, '#0000ff')
	}
}

function fillPixels(triangle, N, light) {
	var cur = [0, 0, 0]
	var x0, x1, xx
	if (triangle[1] > triangle[4]) {
		x0 = triangle[0]
		triangle[0] = triangle[3]
		triangle[3] = x0
		x0 = triangle[1]
		triangle[1] = triangle[4]
		triangle[4] = x0
		x0 = triangle[2]
		triangle[2] = triangle[5]
		triangle[5] = x0
	} else if (triangle[1] > triangle[7]) {
		x0 = triangle[0]
		triangle[0] = triangle[6]
		triangle[6] = x0
		x0 = triangle[1]
		triangle[1] = triangle[7]
		triangle[7] = x0
		x0 = triangle[2]
		triangle[2] = triangle[8]
		triangle[8] = x0
	}
	for (i = triangle[1]; i < triangle[4]; i++) {
		x0 = dLine(ctx, triangle[0], triangle[1], triangle[6], triangle[7], i) + 1
		if (triangle[1] == triangle[7]) x0 = dLine(ctx, triangle[3], triangle[4], triangle[6], triangle[7], i) + 1
		x1 = dLine(ctx, triangle[0], triangle[1], triangle[3], triangle[4], i)
		if (x0 > x1) {
			xx = x0
			x0 = x1
			x1 = xx
		}
		for (j = x0; j < x1; j++) {
			cur = [j, i, j - 1]
			var kos = ((light[0] - cur[0]) * (cur[0] - N[0]) + (light[1] - cur[1]) * (cur[1] - N[1]) + (light[2] - cur[2]) * (cur[2] - N[2])) /
				(sqrt(pow(light[0] - cur[0], 2) + pow(light[1] - cur[1], 2) + pow(light[2] - cur[2], 2)) *
					sqrt(pow(N[0] - cur[0], 2) + pow(N[1] - cur[1], 2) + pow(N[2] - cur[2], 2)))
			kos = kos / sqrt(pow(N[0] - cur[0], 2) + pow(N[1] - cur[1], 2) + pow(N[2] - cur[2], 2))
			kos = 5000 * Math.abs(kos)
			var s = '#' + rgbToHex(255, 165 + 5 * kos - 40, 11 * kos - 50)
			ctx.fillStyle = s
			ctx.fillRect(cur[0], cur[1], 1, 1)
		}
	}
	for (i = triangle[4]; i < triangle[7]; i++) {
		x0 = dLine(ctx, triangle[0], triangle[1], triangle[6], triangle[7], i) + 1
		x1 = dLine(ctx, triangle[6], triangle[7], triangle[3], triangle[4], i)
		for (j = x0; j < x1; j++) {
			cur = [j, i, j - 1]
			var kos = ((light[0] - cur[0]) * (cur[0] - N[0]) + (light[1] - cur[1]) * (cur[1] - N[1]) + (light[2] - cur[2]) * (cur[2] - N[2])) /
				(sqrt(pow(light[0] - cur[0], 2) + pow(light[1] - cur[1], 2) + pow(light[2] - cur[2], 2)) *
					sqrt(pow(N[0] - cur[0], 2) + pow(N[1] - cur[1], 2) + pow(N[2] - cur[2], 2)))
			kos = kos / sqrt(pow(N[0] - cur[0], 2) + pow(N[1] - cur[1], 2) + pow(N[2] - cur[2], 2))
			kos = 5000 * Math.abs(kos)
			var s = '#' + rgbToHex(255, 165 + 5 * kos - 40, 11 * kos - 50)
			ctx.fillStyle = s
			ctx.fillRect(cur[0], cur[1], 1, 1)
		}
	}
}


var canvas = document.querySelector('#canvas')
var ctx = canvas.getContext('2d')
var light = [100, 80, 40]
var N
ctx.fillStyle = '#ffa500'
ctx.fillRect(light[0], light[1], 2, 2); //255, 165,0
var xx = [200, 295, 258, 142, 105, 200, 295, 200, 105, 142, 258, 200]
var yy = [300, 250, 250, 250, 250, 250, 150, 150, 150, 150, 150, 100]
var zz = [200, 170, 280, 280, 170, 100, 230, 300, 230, 120, 120, 200]
icosahedron(ctx, xx, yy, zz);