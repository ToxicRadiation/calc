const ops = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => b === 0 ? "Error: Divide by 0" : a / b
};

let state = { display: '0', first: null, op: null, reset: false, isDone: false };
const disp = document.getElementById('display');

function update() { disp.textContent = state.display; }

function digit(d) {
    if (state.reset || state.isDone) {
        state.display = d;
        state.reset = false;
        state.isDone = false;
    } else {
        state.display = state.display === '0' ? d : state.display + d;
    }
}

function decimal() {
    if (state.isDone || state.reset) {
        state.display = '0.';
        state.isDone = false;
        state.reset = false;
    } else if (!state.display.includes('.')) {
        state.display += '.';
    }
}

function setOp(next) {
    const val = parseFloat(state.display);
    if (state.op && state.reset) {
        state.op = next;
        return;
    }
    if (state.first === null) {
        state.first = val;
    } else if (state.op) {
        const res = ops[state.op](state.first, val);
        state.display = format(res);
        state.first = typeof res === 'string' ? null : parseFloat(state.display);
    }
    state.reset = true;
    state.op = next;
    state.isDone = false;
}

function calc() {
    if (!state.op || state.reset) return;
    const res = ops[state.op](state.first, parseFloat(state.display));
    state.display = format(res);
    state.first = null;
    state.op = null;
    state.reset = false;
    state.isDone = true;
}

function bksp() {
    if (state.isDone) return;
    state.display = state.display.length > 1 ? state.display.slice(0, -1) : '0';
}

function clear() {
    state = { display: '0', first: null, op: null, reset: false, isDone: false };
}

function format(r) {
    return typeof r === 'string' ? r : parseFloat(r.toFixed(7)).toString();
}

document.querySelector('.keys').addEventListener('click', (e) => {
    if (!e.target.matches('button')) return;
    const { digit: d, op: o, action: a } = e.target.dataset;
    if (d !== undefined) digit(d);
    if (o !== undefined) setOp(o);
    if (a === 'dec') decimal();
    if (a === 'clr') clear();
    if (a === 'bak') bksp();
    if (a === 'calc') calc();
    update();
});

window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') digit(e.key);
    if (e.key === '.') decimal();
    if (e.key === '=' || e.key === 'Enter') calc();
    if (e.key === 'Backspace') bksp();
    if (e.key === 'Escape') clear();
    if (['+', '-', '*', '/'].includes(e.key)) setOp(e.key);
    update();
});