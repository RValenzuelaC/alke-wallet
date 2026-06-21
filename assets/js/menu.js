const balance = document.getElementById("balance");

const saldo = parseFloat(balance.textContent);
const saldoAgregado = parseFloat(localStorage.getItem("totalSueldo")) || 0;

const nuevoSaldo = saldo + saldoAgregado;

balance.textContent = nuevoSaldo;
