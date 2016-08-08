// ==UserScript==
// @name         Popup HTML Info
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Floating popup to allow for UI information
// @author       Cody Uhlrich
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser-polyfill.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser.min.js
// @match        http://localhost:9868/tdweb/*
// ==/UserScript== 

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
/* jshint esnext: true */

NodeList.prototype[Symbol.iterator] = [][Symbol.iterator];
/*
  Create the popup, for now it'll be automatically displayed. Set the display to 'none' if you want it
    hidden until you actually hit the key sequence defined in settings.keyStatus.
*/
const myQueryString = "table.tableinfo";
const popup = createElement("div", {
	display: "block",
	backgroundColor: "rgba(217, 217, 217, 0.8)",
	position: "fixed",
	top: "4px",
	left: "4px",
	zIndex: "9999",
	boxShadow: "6px 6px 5px #888888",
	borderRadius: "6px",
	border: "1px solid #4f4f4f"
});

document.body.appendChild(popup);

const settings = {
    //Set the keys you want to use here. You can get the values from http://keycode.info/
    keyStatus: {
      18: {
        name: "alt",
        pos: false
      },
      83: {
        name: "s",
        pos: false
      }
    },
    //Leave these alone.
    offset: {
      x: 0,
      y: 0
    }
};
    

var myResizeFunction = debounce(function() {
	populateTables();
}, 50);

window.addEventListener('resize', myResizeFunction);
populateTables();

popup.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);

function mouseUp() {
	window.removeEventListener('mousemove', popupMove, true);
}

function mouseDown(e) {
	settings.offset.x = e.clientX - popup.offsetLeft;
	settings.offset.y = e.clientY - popup.offsetTop;
	window.addEventListener('mousemove', popupMove, true);
}

function popupMove(e) {
	applyStyles(popup, {
		position: 'fixed',
		top: `${e.clientY - settings.offset.y}px`,
		left: `${e.clientX - settings.offset.x}px`
	});
}

window.onkeydown = e => {
	let {keyCode} = e;

	if (keyCode === 27 && popup.style.display !== "none") { //If ESC key pressed
		applyStyles(popup, {
			display: "none"
		});
	} 
	else if (keyCode.toString() in settings.keyStatus) { //If defined keys are pressed
		settings.keyStatus[keyCode.toString()].pos = true;
		console.log(settings.keyStatus[keyCode.toString()].pos);
		checkKeyPress();
	}
}

window.onkeyup = e => {
	let {keyCode} = e;

	if (keyCode.toString() in settings.keyStatus) { //If defined keys are released
		settings.keyStatus[keyCode.toString()].pos = false;
		checkKeyPress();
	}
}

function checkKeyPress() {
	let sequencePressed = false; //Detection for if the sequence has been pressed.
	if (popup.style.display !== "block") { //Dont run if the div is showing.
		for (let key of Object.keys(settings.keyStatus)) {
			const pos = settings.keyStatus[key].pos;

			if (!pos) {
				sequencePressed = false;
				break; //One of the keys wasn't pressed, so there's no need to let the loop continue.
			} 
			else if (pos && !sequencePressed) {
				sequencePressed = true;
			}
		}
	}

	if (sequencePressed) {
		showPopup(); // Div isn't showing, and the proper buttons were pressed, display.
	}
}

function showPopup() {
	applyStyles(popup, {
		display: "block"
	});
}

function populateTables() {
//Remove all the popup spans
	while (popup.hasChildNodes()) {
		popup.removeChild(popup.firstChild);
	}

	const pageTables = document.querySelectorAll(myQueryString);
	//This div lets the popup have a slightly faded opacity, while the text stays solid.
	const myDiv = createElement("div", {
		textAlign: "left",
	});

	let haveItems = false;
	//Loop through any tables that might have been found.
	for (const myTable of pageTables) {
		if (myTable.id !== "") {
			const mySpan = createElement("span");
			const linebreak = createElement("br");

			mySpan.textContent = `* ${myTable.id} = ${myTable.offsetWidth}px`;
			myDiv.appendChild(mySpan);
			myDiv.appendChild(linebreak);

			if (!haveItems) {
				haveItems = true;
			}
		}
	}

	//No tables were found, display a message instead.
	if (!haveItems) {
		const mySpan = createElement('span');
		const linebreak = createElement('br');

		mySpan.textContent = "No tables detected.";
		myDiv.appendChild(mySpan);
		myDiv.appendChild(linebreak);

		applyStyles(popup, {
			height: "20px",
			width: "150px",
		});
	}

	popup.appendChild(myDiv);
}

function applyStyles(element, styles) {
	Object.keys(styles).forEach(key => element.style[key] = styles[key]);
	return element;
}

function createElement(element, styles = {}) {
	const newElement = document.createElement(element);
	return applyStyles(newElement, styles);
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
		timeout = null;
		if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) {
			func.apply(context, args);
		}
	};
}

/* jshint ignore:start */
]]></>).toString();
var c = babel.transform(inline_src);
eval(c.code);
/* jshint ignore:end */
