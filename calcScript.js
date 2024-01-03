"use strict";

function factorial(n) {
    if (n === 0) return 1;
    return n * factorial(n - 1);
}

function operationToResult(operation, arg1, arg2) {
    switch(operation) {
        case OPERATIONS.ADD:
            return arg1 + arg2;

        case OPERATIONS.SUBTRACT:
            return arg1 - arg2;

        case OPERATIONS.MULTIPLY:
            return arg1 * arg2;

        case OPERATIONS.DIVIDE:
            return arg1 / arg2;

        case OPERATIONS.POWER:
            return arg1 ** arg2;

        case OPERATIONS.MOD:
            return arg1 % arg2;

        case OPERATIONS.FACTORIAL:
            return Number.isInteger(arg1) && arg1 >= 0 ? factorial(arg1) : "ERROR";

        case OPERATIONS.NEGATION:
            return arg1 * -1;
    }
}

/* function getPrecedence(operation, modifier) {
    switch(operation) {
        case OPERATIONS.ADD:
            return 1 + modifier;

        case OPERATIONS.SUBTRACT:
            return 1 + modifier;

        case OPERATIONS.MULTIPLY:
            return 2 + modifier;

        case OPERATIONS.DIVIDE:
            return 2 + modifier;

        case OPERATIONS.POWER:
            return 3 + modifier;

        case OPERATIONS.MOD:
            return 2 + modifier;

        case OPERATIONS.FACTORIAL:
            return 3 + modifier;
    }
}
 */


function computeSingleOp(numStack, opStack) {
    let op = opStack.pop().operation;
    if (op === OPERATIONS.FACTORIAL || op === OPERATIONS.NEGATION) {
        let num = numStack.pop();
        numStack.push(operationToResult(op, num));
    } else {
        // Stack pops from right to left 
        let num2 = numStack.pop();
        let num1 = numStack.pop();
        numStack.push(operationToResult(op, num1, num2));
    }
}

function unravelComputationStacks(numStack, opStack) {
    while(opStack.length > 0) {
        computeSingleOp(numStack, opStack)
    }
}

function logNumberAndOp(operation, currNum, numStack, opStack, currPrec, prev = "") {
    if (operation === OPERATIONS.NEGATION) return;
    if (prev !== OPERATIONS.FACTORIAL) {
        numStack.push(+currNum);
    }


    while(opStack.length > 0 && PRECEDENCE[operation] + currPrec <= (opStack[opStack.length - 1].prec)) {
        computeSingleOp(numStack, opStack);
    }
    opStack.push({operation: operation, prec: PRECEDENCE[operation] + currPrec});

    return 0;
}


function preprocessString(str) {
    let retval = "";
    for (let i = 0; i < str.length; i++) {
        let char = str.charAt(i);
        if (char.charCodeAt(0) === 215) {
            retval += "*";
        } else if (char.charCodeAt(0) === 247) {
            retval += "/";
        } else {
            retval += char
        }
    }
    return retval;
}

function evaluate() {
    const OPSET = new Set(Object.values(OPERATIONS));
    OPSET.delete("(");
    OPSET.delete(")");
    let str = preprocessString(displayField.value);
    let numStack = [];
    let opStack = [];
    let currNum = "";
    let currPrec = 0;
    let errFlag = false;

    for (let i = 0; i < str.length; i++) {
        let char = str.charAt(i);

        if (char === "-" && (i == 0 || (OPSET.has(str.charAt(i - 1)) && str.charAt(i - 1) != OPERATIONS.FACTORIAL) || str.charAt(i - 1) === "(")) {
            opStack.push({operation: OPERATIONS.NEGATION, prec: PRECEDENCE[OPERATIONS.NEGATION] + currPrec});
        } else if (char === "(") {
            if (i > 0 && !OPSET.has(str.charAt(i - 1))) {
                logNumberAndOp(OPERATIONS.MULTIPLY, currNum, numStack, opStack, currPrec);
                currNum = "";
            }
            currPrec += PARSHIFT;
        } else if (char === ")") {
            currPrec -= PARSHIFT;
            if (currPrec < 0) {
                errFlag = true;
                break;
            } 
            if (i < str.length - 1 && !OPSET.has(str.charAt(i + 1))) {
                logNumberAndOp(OPERATIONS.MULTIPLY, currNum, numStack, opStack, currPrec);
                currNum = "";
            } else if (i == str.length - 1) {
                numStack.push(+currNum);
                currNum = "";
            }
        } else if (OPSET.has(char)) {
            let prev = "";
            if (i != 0) prev = str.charAt(i - 1);
            logNumberAndOp(char, currNum, numStack, opStack, currPrec, prev);
            currNum = "";
        } else {
            currNum += char;
        }
    }

    if (currPrec > 0) errFlag = true;

    if (currNum !== "") {
        numStack.push(+currNum);
        currNum = "";
    } 

    unravelComputationStacks(numStack, opStack);

    if (opStack.length !== 0 || numStack.length !== 1 || (numStack.length == 1 && isNaN(numStack[0])) || errFlag) return [-1, "ERROR"];

    return [1, numStack[0]];
}


function enterKey(event) {
    event.preventDefault();
    const char = event.key;
    let buttonId = "#";
    if (validKeyInput.has(char)) {
        if (char === "Delete" || char === "Backspace") buttonId += "delete";
        else if (char === "Enter" || char === "=") buttonId += "equals";
        else buttonId += `c${char.charCodeAt(0)}`;
    } else {
        return;
    }

    let clickEvent = new Event("click");
    const eventButton = document.querySelector(buttonId);
    eventButton.dispatchEvent(clickEvent);
}

//, 
const DOT = "46";
const OPERATIONS = {
    ADD: "+",
    SUBTRACT: "-",
    NEGATION: "neg",
    MULTIPLY: "*",
    DIVIDE: "/",
    POWER: "^",
    OPENPAR: "(",
    CLOSEPAR: ")",
    MOD: "%",
    FACTORIAL: "!",
    EMPTYOP: "",
};

const PRECEDENCE = {
    [OPERATIONS.ADD]: 1,
    [OPERATIONS.SUBTRACT]: 1,
    [OPERATIONS.MULTIPLY]: 2,
    [OPERATIONS.DIVIDE]: 2,
    [OPERATIONS.MOD]: 2,
    [OPERATIONS.NEGATION]: 3,
    [OPERATIONS.POWER]: 4,
    [OPERATIONS.FACTORIAL]: 4,
    [OPERATIONS.EMPTYOP]: 0,
};

const PARSHIFT = 4;

// Driver stars here

let delExpression = false;

const displayField = document.querySelector(".display");
const validKeyInput = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 
                                    OPERATIONS.ADD, OPERATIONS.SUBTRACT, OPERATIONS.MULTIPLY, OPERATIONS.DIVIDE,
                                    OPERATIONS.POWER, DOT, OPERATIONS.OPENPAR, OPERATIONS.CLOSEPAR, OPERATIONS.MOD, OPERATIONS.FACTORIAL,
                                    "Delete", "Backspace", "Enter", "="]);





const numList = document.querySelectorAll(".number, #c46, #pi, #e");

numList.forEach(button => {
    button.addEventListener("click", event => {
        if (delExpression) {
            displayField.value = "";
            delExpression = false;
        }
        let addval = event.target.textContent;    
        if (event.target.id === "pi") addval = "3.141592";
        else if (event.target.id === "e") addval = "2.718282";
        
        displayField.value += addval;
    });
});


const ops = document.querySelectorAll(`.classic, #c${OPERATIONS.MOD.charCodeAt(0)}, #c${OPERATIONS.POWER.charCodeAt(0)}, 
                                                #c${OPERATIONS.FACTORIAL.charCodeAt(0)}, #c${OPERATIONS.OPENPAR.charCodeAt(0)}, 
                                                #c${OPERATIONS.CLOSEPAR.charCodeAt(0)}`);

ops.forEach(button => {
    button.addEventListener("click", event => {
        if (delExpression) {
            displayField.value = "";
            delExpression = false;
        }
        displayField.value += event.target.textContent;
    });
});

const erase = document.querySelector("#delete");
erase.addEventListener("click", event => {
    delExpression = false;
    displayField.value = "";
});

const equals = document.querySelector("#equals");
equals.addEventListener("click", event => {
    let [success, result] = evaluate();

    if (success == -1) {
        displayField.value = "Malformed Expression";
        delExpression = true;    
    } else {
        let equationHistory = document.createElement("div");
        let equals = document.createElement("div");
        let equationResult = document.createElement("div");
        let history = document.createElement("div");

        equationHistory.style.width = "60%";
        equals.style.width = "10%"
        equationResult.style.width = "30%";
        equationResult.style.textAlign = "right";

        equationHistory.textContent = displayField.value;
        equals.textContent = "=";
        equationResult.textContent = result;

        history.classList.toggle("historyElement");

        history.appendChild(equationHistory);
        history.appendChild(equals);
        history.appendChild(equationResult);


        history.childNodes.forEach(node => {
            node.addEventListener("click", event => {
                displayField.value = event.target.parentNode.childNodes[0].textContent;
            }) 
        });

        displayField.value = result;

        document.querySelector(".history").appendChild(history);
    }
});


document.addEventListener("keydown", enterKey);
