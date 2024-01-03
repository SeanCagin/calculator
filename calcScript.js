function enterKey(event) {
    const char = event.key;
    let buttonId = "#";
    if (validKeyInput.has(char)) {
        if (char === "Delete" || char === "Backspace") buttonId += "delete";
        else if (char === "Enter") buttonId += "equals";
        else buttonId += `c${char.charCodeAt(0)}`;
    } else {
        return;
    }
    let clickEvent = new Event("click");
    const eventButton = document.querySelector(buttonId);
    eventButton.dispatchEvent(clickEvent);
}


const displayField = document.querySelector(".display");
const validKeyInput = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "/", "+", "^", "-", "*", ".", "%", "(", ")", "Delete", "Backspace", "Enter"]);

const baseList = document.querySelectorAll(".number, .classic, #root, #c40, #c41, #pi, #c37, #c46");
baseList.forEach(button => {
    button.addEventListener("click", event => {
        displayField.value += event.target.textContent;
    });
});

const mod = document.querySelector("#mod");
mod.addEventListener("click", event => {
    displayField.value += ` ${event.target.textContent} `;
});

const erase = document.querySelector("#delete");
erase.addEventListener("click", event => {
    displayField.value = "";
});

const square = document.querySelector("#c94");
square.addEventListener("click", event => {
    displayField.value += "^";
});

const equals = document.querySelector("#equals");
equals.addEventListener("click", event => {
    displayField.value = "=";
});

document.addEventListener("keydown", enterKey);
