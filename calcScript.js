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
    let op = opStack.pop();
    if (op === OPERATIONS.FACTORIAL) {
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

function logNumberAndOp(operation, currNum, numStack, opStack) {
    numStack.push(+currNum);

    if (operation === OPERATIONS.OPENPAR) return PARSHIFT;
    else if (operation === OPERATIONS.CLOSEPAR) return -1 * PARSHIFT;

    while(opStack.length > 0 && PRECEDENCE[operation] <= PRECEDENCE[opStack[opStack.length - 1]]) {
        computeSingleOp(numStack, opStack);
    }
    opStack.push(operation);

    return 0;
}


function evaluate() {
    const OPSET = new Set(Object.values(OPERATIONS));
    let str = displayField.value;
    let numStack = [];
    let opStack = [];
    let currNum = "";
    let currPrec = 0;

    for (let i = 0; i < str.length; i++) {
        let char = str.charAt(i);
        if (char.charCodeAt(0) === 215) char = "*";
        else if (char.charCodeAt(0) === 247) char = "/";
        if (OPSET.has(char)) {
            currPrec += logNumberAndOp(char, currNum, numStack, opStack);
            currNum = "";
        } else {
            currNum += char;
        }
    }

    if (currNum !== "") {
        numStack.push(+currNum);
        currNum = "";
    } 

    unravelComputationStacks(numStack, opStack);

    if (opStack.length !== 0 || numStack.length !== 1 || (numStack.length == 1 && isNaN(numStack[0]))) {
        displayField.value = "Malformed Expression";
    }

    else displayField.value = numStack[0];
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
    [OPERATIONS.POWER]: 3,
    [OPERATIONS.FACTORIAL]: 3,
    [OPERATIONS.EMPTYOP]: 0,
};

const PARSHIFT = 4;

// Driver stars here

const displayField = document.querySelector(".display");
const validKeyInput = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 
                                    OPERATIONS.ADD, OPERATIONS.SUBTRACT, OPERATIONS.MULTIPLY, OPERATIONS.DIVIDE,
                                    OPERATIONS.POWER, DOT, OPERATIONS.OPENPAR, OPERATIONS.CLOSEPAR, OPERATIONS.MOD, 
                                    "Delete", "Backspace", "Enter", "="]);





const numList = document.querySelectorAll(".number, #c46, #pi, #e");

numList.forEach(button => {
    button.addEventListener("click", event => {
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
        displayField.value += event.target.textContent;
    });
});

const erase = document.querySelector("#delete");
erase.addEventListener("click", event => {
    numStack = [];
    opStack = [];
    currNum = "";
    currPrec = 0;
    displayField.value = "";
});

const equals = document.querySelector("#equals");
equals.addEventListener("click", event => {
    evaluate();
});


document.addEventListener("keydown", enterKey);
