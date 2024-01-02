const displayField = document.querySelector(".display");

const baseList = document.querySelectorAll(".number, .classic, #root, #closepar, #openpar, #pi, #percent, #dot");
baseList.forEach(button => {
    button.addEventListener("click", event => {
        displayField.value += event.target.textContent;
    });
});

const mod = document.querySelector("#mod");
mod.addEventListener("click", event => {
    displayField.value += ` ${event.target.textContent} `;
});

const erase = document.querySelector("#erase");
erase.addEventListener("click", event => {
    displayField.value = "";
});

const square = document.querySelector("#square");
square.addEventListener("click", event => {
    displayField.value += "^";
});

const equals = document.querySelector("#equals");
equals.addEventListener("click", event => {
    displayField.value = "=";
});

