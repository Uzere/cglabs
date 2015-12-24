var sqrt = Math.sqrt
var pow = Math.pow

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

function doge_line(ctx, x0, y0, x1, y1, yc) {
	if (Math.abs(x1 - x0) >= Math.abs(y1 - y0)) {
		if (x1 >= x0) return lineR(ctx, x0, y0, x1, y1, 1, yc)
		else return lineR(ctx, x1, y1, x0, y0, 1, yc)
	} else {
		if (y1 >= y0) return lineR(ctx, y0, x0, y1, x1, 0, yc)
		else return lineR(ctx, y1, x1, y0, x0, 0, yc)
	}
}

function drawTriangle(ctx, triangle, color) {
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

function GetPixelColor(fx, fy) {
	var p = ctx.getImageData(fx, fy, 1, 1).data
	var hex = p[0] * 65536 + p[1] * 256 + p[2]
	return hex
}

function decimall(num) {
	while (num > 1) num -= 1
	return num
}

function fillPixels(triangle1, triangle2, N1, N2, O) {
	var cur = [0, 0, 0]
	var x0, x1, s
	var dx, dy, dz, x2, y2, z2
	var mat, atm, amt
	for (i = triangle1[1]; i < triangle1[4]; i++) {
		x0 = doge_line(ctx, triangle1[0], triangle1[1], triangle1[6], triangle1[7], i) + 1
		x1 = doge_line(ctx, triangle1[0], triangle1[1], triangle1[3], triangle1[4], i)
		for (j = x0; j < x1; j++) {
			cur = [j, i, j - 1]
			var kos = ((O[0] - cur[0]) * (cur[0] - N1[0]) + (O[1] - cur[1]) * (cur[1] - N1[1]) + (O[2] - cur[2]) * (cur[2] - N1[2])) /
				(sqrt(pow(O[0] - cur[0], 2) + pow(O[1] - cur[1], 2) + pow(O[2] - cur[2], 2)) *
					sqrt(pow(N1[0] - cur[0], 2) + pow(N1[1] - cur[1], 2) + pow(N1[2] - cur[2], 2)))
			kos = kos * sqrt(pow(N1[0] - cur[0], 2) + pow(N1[1] - cur[1], 2) + pow(N1[2] - cur[2], 2))
			dx = O[0] - cur[0]
			dy = O[1] - cur[1]
			dz = O[2] - cur[2]
			x2 = (N2[0] * triangle2[0] * dx + N2[1] * dx * (cur[1] - triangle2[1]) + N2[1] * cur[0] * dy + N2[2] * dx * (cur[2] - triangle2[2]) +
				N2[2] * cur[0] * dz) / (N2[0] * dx + N2[1] * dy + N2[2] * dz)
			y2 = cur[1] + (x2 - cur[0]) * dy / dx
			z2 = cur[2] + (x2 - cur[0]) * dz / dx
			mat = sqrt(pow(dx, 2) + pow(dy, 2) + pow(dz, 2))
			atm = sqrt(pow(x2 - cur[0], 2) + pow(y2 - cur[1], 2) + pow(z2 - cur[2], 2))
			amt = sqrt(pow(x2 - O[0], 2) + pow(y2 - O[1], 2) + pow(z2 - O[2], 2))
			if (decimall(mat) < 0.5)
				mat = mat | 0
			else mat = Math.ceil(mat)
			if (decimall(atm) < 0.5)
				atm = atm | 0
			else atm = Math.ceil(atm)
			if (decimall(amt) < 0.5)
				amt = amt | 0
			else amt = Math.ceil(amt)
			if (mat == atm + amt || mat == atm + amt - 1 || mat == atm + amt + 1)
				s = '#' + rgbToHex(255, 165 + 1.5 * kos, 4 * kos)
			else s = '#' + rgbToHex(255, 165 - kos, kos)
			ctx.fillStyle = s
			ctx.fillRect(cur[0], cur[1], 1, 1)
		}
	}
	for (i = triangle1[4]; i < triangle1[7]; i++) {
		x0 = doge_line(ctx, triangle1[0], triangle1[1], triangle1[6], triangle1[7], i) + 1
		x1 = doge_line(ctx, triangle1[6], triangle1[7], triangle1[3], triangle1[4], i)
		for (j = x0; j < x1; j++) {
			cur = [j, i, j - 1]
			var kos = ((O[0] - cur[0]) * (cur[0] - N1[0]) + (O[1] - cur[1]) * (cur[1] - N1[1]) + (O[2] - cur[2]) * (cur[2] - N1[2])) /
				(sqrt(pow(O[0] - cur[0], 2) + pow(O[1] - cur[1], 2) + pow(O[2] - cur[2], 2)) *
					sqrt(pow(N1[0] - cur[0], 2) + pow(N1[1] - cur[1], 2) + pow(N1[2] - cur[2], 2)))
			kos = kos * sqrt(pow(N1[0] - cur[0], 2) + pow(N1[1] - cur[1], 2) + pow(N1[2] - cur[2], 2))
			dx = O[0] - cur[0]
			dy = O[1] - cur[1]
			dz = O[2] - cur[2]
			x2 = (N2[0] * triangle2[0] * dx + N2[1] * dx * (cur[1] - triangle2[1]) + N2[1] * cur[0] * dy + N2[2] * dx * (cur[2] - triangle2[2]) +
				N2[2] * cur[0] * dz) / (N2[0] * dx + N2[1] * dy + N2[2] * dz)
			y2 = cur[1] + (x2 - cur[0]) * dy / dx
			z2 = cur[2] + (x2 - cur[0]) * dz / dx
			mat = sqrt(pow(dx, 2) + pow(dy, 2) + pow(dz, 2))
			atm = sqrt(pow(x2 - cur[0], 2) + pow(y2 - cur[1], 2) + pow(z2 - cur[2], 2))
			amt = sqrt(pow(x2 - O[0], 2) + pow(y2 - O[1], 2) + pow(z2 - O[2], 2))
			if (decimall(mat) < 0.5)
				mat = mat | 0
			else mat = Math.ceil(mat)
			if (decimall(atm) < 0.5)
				atm = atm | 0
			else atm = Math.ceil(atm)
			if (decimall(amt) < 0.5)
				amt = amt | 0
			else amt = Math.ceil(amt)
			if (mat == atm + amt || mat == atm + amt - 1 || mat == atm + amt + 1)
				s = '#' + rgbToHex(255, 165 + 1.5 * kos, 4 * kos)
			else s = '#' + rgbToHex(255, 165 - kos, kos)
			ctx.fillStyle = s
			ctx.fillRect(cur[0], cur[1], 1, 1)
		}
	}
}

function forwPixels(triangle, N, O) {
	var cur = [0, 0, 0]
	var x0, x1
	for (i = triangle[1]; i < triangle[4]; i++) {
		x0 = doge_line(ctx, triangle[0], triangle[1], triangle[6], triangle[7], i) + 1
		x1 = doge_line(ctx, triangle[0], triangle[1], triangle[3], triangle[4], i)
		for (j = x0; j < x1; j++) {
			cur = [j, i, j - 1]
			var kos = ((O[0] - cur[0]) * (cur[0] - N[0]) + (O[1] - cur[1]) * (cur[1] - N[1]) + (O[2] - cur[2]) * (cur[2] - N[2])) /
				(sqrt(pow(O[0] - cur[0], 2) + pow(O[1] - cur[1], 2) + pow(O[2] - cur[2], 2)) *
					sqrt(pow(N[0] - cur[0], 2) + pow(N[1] - cur[1], 2) + pow(N[2] - cur[2], 2)))
			kos = kos * sqrt(pow(N[0] - cur[0], 2) + pow(N[1] - cur[1], 2) + pow(N[2] - cur[2], 2))
			var s = '#' + rgbToHex(255, 165 + 1.5 * kos, 4 * kos)
			ctx.fillStyle = s
			ctx.fillRect(cur[0], cur[1], 1, 1)
		}
	}
	for (i = triangle[4]; i < triangle[7]; i++) {
		x0 = doge_line(ctx, triangle[0], triangle[1], triangle[6], triangle[7], i) + 1
		x1 = doge_line(ctx, triangle[6], triangle[7], triangle[3], triangle[4], i)
		for (j = x0; j < x1; j++) {
			cur = [j, i, j - 1]
			var kos = ((O[0] - cur[0]) * (cur[0] - N[0]) + (O[1] - cur[1]) * (cur[1] - N[1]) + (O[2] - cur[2]) * (cur[2] - N[2])) /
				(sqrt(pow(O[0] - cur[0], 2) + pow(O[1] - cur[1], 2) + pow(O[2] - cur[2], 2)) *
					sqrt(pow(N[0] - cur[0], 2) + pow(N[1] - cur[1], 2) + pow(N[2] - cur[2], 2)))
			kos = kos * sqrt(pow(N[0] - cur[0], 2) + pow(N[1] - cur[1], 2) + pow(N[2] - cur[2], 2))
			var s = '#' + rgbToHex(255, 165 + 1.5 * kos, 4 * kos)
			ctx.fillStyle = s
			ctx.fillRect(cur[0], cur[1], 1, 1)
		}
	}
}


var canvas = document.querySelector('#canvas')
var ctx = canvas.getContext('2d')
var triangle1 = [10, 10, 0, 60, 20, 50, 20, 70, 0]
var triangle2 = [70, 10, 0, 130, 20, 50, 180, 70, 0]
var O = [150, 60, 40]
drawTriangle(ctx, triangle1, '#0000ff')
drawTriangle(ctx, triangle2, '#0000ff')
ctx.fillStyle = '#ffa500'
ctx.fillRect(O[0], O[1], 2, 2); //255, 165,0
var N1 = transform(triangle1),
	N2 = transform(triangle2)
fillPixels(triangle1, triangle2, N1, N2, O)
forwPixels(triangle2, N2, O)
drawTriangle(ctx, triangle1, '#0000ff')
drawTriangle(ctx, triangle2, '#0000ff')

if (GetPixelColor(26, 20) - 16753920 > 0) {
	alert('Point in the light')
} else {
	alert('Point in the shade')
}

if (GetPixelColor(43, 22) - 16753920 > 0) {
	alert('Point in the light')
} else {
	alert('Point in the shade')
}