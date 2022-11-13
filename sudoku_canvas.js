// Anthony Tung, 2022 Nov
"use strict";
// === canvas object ===========================
const canvasID = document.getElementById("myCanvas");	// drawing surface for main square
const ctx = canvasID.getContext("2d");

const _w = canvasID.width;	// get canvas parameters, used in clear display
const _h = canvasID.height;
console.log("sudoku_canvas W:" + _w + " H:" + _h);

const elMessage0 = document.querySelector("#messageID0");
const elErrorMsg = document.querySelector("#messageID1");
// === event listeners mouse ===========================
canvasID.addEventListener("mousedown", mouseDown);
// canvasID.addEventListener("mouseup", mouseUp);
document.addEventListener("mousemove", mouseMove);
// window.addEventListener("resize", resize);
//canvasID.addEventListener("click", canvasClick);
function mouseDown(event) { mouseDown(event); }
// function mouseUp() { mouseUp(); }
// function mouseMove(event) { mouseMove(event); }
// function resize() { resize(); }
// === event listeners buttons ===============================================
const elBt0 = document.querySelector("#btnID0");		// Clear Board
const elBt1 = document.querySelector("#btnID1");		// Run
const elBt2 = document.querySelector("#btnID2");		// All Hints

const elG0 = document.querySelector("#btnG_ID0");
const elG1 = document.querySelector("#btnG_ID1");
const elG2 = document.querySelector("#btnG_ID2");
const elG3 = document.querySelector("#btnG_ID3");

const runA1 = document.querySelector("#btn_A0");
const runA2 = document.querySelector("#btn_A1");
const runA3 = document.querySelector("#btn_A2");

elBt0.addEventListener("click", function () {		// Clear Board
	//console.log("Clear board event");
	clearBoard();
});
elBt1.addEventListener("click", function () {		// Run
	console.log("addEventListener run");
	_state = 1;
	a1_Naked_Single();
	a2_Hidden_Single();
	a3_Naked_Pair();
	displayRefresh();
});
elBt2.addEventListener("click", function () {
	_showHints = !_showHints;
	displayRefresh();
	//console.log("hints");
});
// Game load
elG0.addEventListener("click", function () {
	_gameLoad(STR_GAME0);
});
elG1.addEventListener("click", function () {
	_gameLoad(STR_GAME1);
});
elG2.addEventListener("click", function () {
	_gameLoad(STR_GAME2);
});
elG3.addEventListener("click", function () {
	_gameLoad(STR_GAME3);
});
function _gameLoad(str) {
	init(str);
	hints_delete();		// required
	displayRefresh();
}
runA1.addEventListener("click", function () { a1_Naked_Single(); displayRefresh(); });
runA2.addEventListener("click", function () { a2_Hidden_Single(); displayRefresh(); });
runA3.addEventListener("click", function () { a3_Naked_Pair(); displayRefresh(); });
// === board parameters ======================================================
const BORDER = 2;
const SIZE = _w/9 | 0; //32;				// tile size
const FONT_STD = "25px Arial";
const FONT_SML = "9px Arial";
const FONT_STD_X_OFFSET = SIZE / 4;
const FONT_STD_Y_OFFSET = SIZE / 1.3;
const FONT_SML_X_OFFSET = SIZE / 6;
const FONT_SML_Y_OFFSET = SIZE / 3;

const N_BORDER_LEFT = (0.12 * SIZE) | 0;
const N_BOX_WIDTH = (0.75 * SIZE) |0;
const N_BOX_SPACE = SIZE - N_BOX_WIDTH;
const N_BOX = N_BOX_WIDTH + N_BOX_SPACE;
const N_Y = (9.25 * SIZE) |0 ;
const N_Y_STD_FONT = N_Y + 20;
const N_Y_SML_FONT = N_Y_STD_FONT + 10;
const N_FONT_STD_X = 6;
const N_FONT_SML_X = 10;

const HINTS_Y_SPACING = (SIZE / 3.5) | 0;

let _showHints = true;
let _errorMsg = "";
// === event actions, mouse =========================================================
function mouseDown(event) {
	//console.log("mouseDown", event.offsetX, event.offsetY);

	// add number to tile
	_errorMsg = "";
	if (click_in_tile_area(event.offsetX, event.offsetY)) {
		if (_numberFocus) {
			let r = click_to_rc(event.offsetX, event.offsetY)[0];
			let c = click_to_rc(event.offsetX, event.offsetY)[1];
			let cell = a[r][c];
			//console.log("click_in_tile_area", cell);
			if (cell[0]) {
				_errorMsg = "You can't change an existing number.";
			}
			else if (cell[_numberFocus]) {
				if (_state == 0) {
					a[r][c] = [_numberFocus, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
				}
				else
					a[r][c] = [_numberFocus, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			}
			else {
				_errorMsg = "Not allowed location to add a number.";
			}
			hints_delete();		// required
			displayRefresh();

		}
	}
	if (click_in_number_area(event.offsetX, event.offsetY)) {
		let n = click_to_number(event.offsetX);	// 0 is out of bounds
		if (n) {
			_numberFocus = n;
			displayNumberCounts();
		}
	}
}
function mouseMove(event) {
	//console.log("mouseMove", event.offsetX, event.offsetY);
}
// === helpers ===============================================================
function click_to_number(mouseX) {
	// returns:0 or 1-9, 0:not on box

	//x in area?
	let x = mouseX - N_BORDER_LEFT;
	let n = x / N_BOX | 0;
	if (x > N_BOX_WIDTH + n * N_BOX) return 0;
	return n + 1;
}
function click_to_rc(mouseX, mouseY) {
	// returns cell true if valid number inserted into a array
	let x = mouseX - BORDER;
	let y = mouseY - BORDER;
	let r = y / SIZE | 0;
	let c = x / SIZE | 0;
	return [r, c];
	// if (a[r][c][0]) return false;		// has a number in it already
	// a[r][c] = [_numberFocus, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	// return true;
}
function click_in_tile_area(mouseX, mouseY) {
	// returns true if mouse is in inbounds
	if (mouseX <= BORDER) return false;
	if (mouseX >= SIZE * 9 + BORDER) return false;
	if (mouseY <= BORDER) return false;
	if (mouseY >= SIZE * 9 + BORDER) return false;
	return true;
}
function click_in_number_area(mouseX, mouseY) {
	// returns true if mouse is in inbounds
	// does not test space
	if (mouseX <= N_BORDER_LEFT) return false;
	if (mouseX >= N_BOX * 9 + N_BORDER_LEFT - N_BOX_SPACE) return false;
	if (mouseY <= N_Y) return false;
	if (mouseY >= N_Y + SIZE) return false;
	return true;
}
// ===========================================================================
function displayRefresh() {
	//console.log("displayRefresh", _numberFocus)
	elErrorMsg.innerHTML = _errorMsg;
	if (_state == 9) throw new Error("stop!");
	numberCount();			// update numbersSum array with counts of all numbers
	ctx.clearRect(0, 0, _w, _h);
	drawNumbers();
	if (_showHints) drawHints();
	drawGrid();
	displayNumberCounts();
	displayNumberCount();

	// ===
	function drawNumbers() {
		//console.log("drawNumbers");
		ctx.lineWidth = 3;
		ctx.font = FONT_STD;
		const X = FONT_STD_X_OFFSET + BORDER;
		const Y = FONT_STD_Y_OFFSET + BORDER;
		for (let r = 0; r < 9; r++) {
			for (let c = 0; c < 9; c++) {
				let cell = a[r][c];
				let n = a[r][c][0];
				if (n == 0) continue;		// skip if empty cell
				if (cell[10] == 1) {		// is an original number
					// grey cell box
					ctx.fillStyle = "lightgrey";
					ctx.fillRect(c * SIZE + BORDER, r * SIZE + BORDER, SIZE, SIZE);
					ctx.fillStyle = "black";
				}
				else if (cell[10] == 2) { ctx.fillStyle = "red"; }	// invalid number
				else ctx.fillStyle = "blue";
				ctx.fillText(n, c * SIZE + X, r * SIZE + Y);	// draw std numbers

			}
		}
	}
	function drawHints() {
		//console.log("drawHints");
		ctx.lineWidth = 1;
		ctx.fillStyle = "red";
		ctx.font = FONT_SML;
		for (let r = 0; r < 9; r++) {
			for (let c = 0; c < 9; c++) {
				let cell = a[r][c];
				//if (cell[0] > 0) continue;	// skip if number exist
				const X = c * SIZE + FONT_SML_X_OFFSET + BORDER;
				const Y = r * SIZE + FONT_SML_Y_OFFSET + BORDER;
				for (let i = 0; i < 9; i++) {	// look at hints
					let p = cell[i + 1];
					let x = i % 3 * SIZE / 4	// x inter-cell spacing
					let y = (i / 3 | 0) * HINTS_Y_SPACING;	// y inter-cell spacing
					if (p) ctx.fillText(i + 1, x + X, y + Y);
				}
			}
		}
	}
	function drawGrid() {
		const LINE_THIN = 1;
		const LINE_THICK = 6;
		ctx.strokeStyle = "black";
		for (let i = 0; i < 10; i++) {					// hor lines
			if (i % 3 == 0) ctx.lineWidth = LINE_THICK;	// every 3rd line thick
			else ctx.lineWidth = LINE_THIN;
			ctx.beginPath();
			ctx.moveTo(BORDER, i * SIZE + BORDER);
			ctx.lineTo(9 * SIZE + BORDER, i * SIZE + BORDER);
			ctx.stroke();
		}
		for (let i = 0; i < 10; i++) {					// vertical lines
			if (i % 3 == 0) ctx.lineWidth = LINE_THICK;	// every 3rd line thick
			else ctx.lineWidth = LINE_THIN;
			ctx.beginPath();
			ctx.moveTo(i * SIZE + BORDER, BORDER);
			ctx.lineTo(i * SIZE + BORDER, 9 * SIZE + BORDER);
			ctx.stroke();
		}
	}
	function displayNumberCount() {
		// returns the number of numbers in HTML format
		let sum = 0;
		for (let r = 0; r < 9; r++) {
			for (let c = 0; c < 9; c++) {
				if (a[r][c][0]) sum++;
			}
		}
		elMessage0.innerHTML = "Total numbers:" + sum;
	}
}
function displayNumberCounts() {
	//console.log("displayNumberCounts");
	for (let i = 0; i < 9; i++) {
		let x = i * (N_BOX_WIDTH + N_BOX_SPACE) + N_BORDER_LEFT;
		if (i == _numberFocus - 1) ctx.fillStyle = "gray";
		else ctx.fillStyle = "lightgray";
		ctx.fillRect(x, N_Y, N_BOX_WIDTH, SIZE);					// draw box
		ctx.fillStyle = "blue";
		ctx.font = FONT_STD;
		ctx.fillText(i + 1, x + N_FONT_STD_X, N_Y_STD_FONT);	// draw std number
		ctx.font = FONT_SML;
		ctx.fillStyle = "black";
		ctx.fillText(_numbersSum[i], x + N_FONT_SML_X, N_Y_SML_FONT);	// draw sml number
	}
}