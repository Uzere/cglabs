var pow = Math.pow
var sqrt = Math.sqrt

function transform(triangle) {
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

function drawLine(ctx, x0, y0, x1, y1, color) {
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

function drawTriangle(ctx, triangle, color) {
	drawLine(ctx, triangle[0], triangle[1], triangle[3], triangle[4], color)
	drawLine(ctx, triangle[3], triangle[4], triangle[6], triangle[7], color)
	drawLine(ctx, triangle[6], triangle[7], triangle[0], triangle[1], color)
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

function fillPixels(triangle, N, light) {
	var cur = [0, 0, 0]
	var x0, x1
	for (i = triangle[1]; i < triangle[4]; i++) {
		x0 = dLine(ctx, triangle[0], triangle[1], triangle[6], triangle[7], i) + 1
		x1 = dLine(ctx, triangle[0], triangle[1], triangle[3], triangle[4], i)
		for (j = x0; j < x1; j++) {
			cur = [j, i, j - 1]
			var kos = ((light[0] - cur[0]) * (cur[0] - N[0]) + (light[1] - cur[1]) * (cur[1] - N[1]) + (light[2] - cur[2]) * (cur[2] - N[2])) /
				(sqrt(pow(light[0] - cur[0], 2) + pow(light[1] - cur[1], 2) + pow(light[2] - cur[2], 2)) *
					sqrt(pow(N[0] - cur[0], 2) + pow(N[1] - cur[1], 2) + pow(N[2] - cur[2], 2)))
			kos = kos * sqrt(pow(N[0] - cur[0], 2) + pow(N[1] - cur[1], 2) + pow(N[2] - cur[2], 2))
			var s = '#' + rgbToHex(255, 165 + 1.5 * kos, 0)
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
			kos = kos * sqrt(pow(N[0] - cur[0], 2) + pow(N[1] - cur[1], 2) + pow(N[2] - cur[2], 2))
			var s = '#' + rgbToHex(255, 165 + 1.5 * kos, 0)
			ctx.fillStyle = s
			ctx.fillRect(cur[0], cur[1], 1, 1)
		}
	}
}

var canvas = document.querySelector('#canvas')
var ctx = canvas.getContext('2d')
var triangle = [10, 10, 0, 160, 20, 50, 20, 170, 0]
var light = [90, 50, 40]
//drawTriangle(ctx, triangle, '#0000ff')
ctx.fillStyle = '#ffa500'
ctx.fillRect(light[0], light[1], 2, 2);
var N = transform(triangle)
var z = []
for (i = 10; i < 70; i++)
	for (j = 10; j < 90; j++)
		z[j] = (-1) * (N[3] + N[1] * i + N[0] * j) / N[2]
fillPixels(triangle, N, light)
//drawTriangle(ctx, triangle, '#0000ff');