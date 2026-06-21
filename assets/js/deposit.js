const btnDepositar = document.getElementById("btnDepositar");
const alertaDeposito = document.getElementById("containerDeposit");
const depositar = document.getElementById("depositAmount");
const mensaje = document.getElementById("mensaje");

btnDepositar.addEventListener("click", (event) => {
	event.preventDefault();

	const num = parseFloat(depositar.value);

	if (isNaN(num) || num <= 0) {
		mensaje.innerHTML = `
            <div class="alert alert-warning text-center py-2" role="alert">
                ⚠️ Por favor, ingrese un monto mayor a 0.
            </div>
        `;
		setTimeout(() => {
			mensaje.innerHTML = "";
		}, 2000);
		return;
	}

	let saldoGuardado = parseInt(localStorage.getItem("totalSueldo")) || 0;
	let sumaTotal = num + saldoGuardado;

	localStorage.setItem("totalSueldo", sumaTotal);

	// Guardar el registro en el historial de movimientos
	const nuevoMovimiento = `Depósito realizado - $${num.toFixed(2)}`;
	const movimientosExistentes = localStorage.getItem("misMovimientos");

	if (movimientosExistentes) {
		localStorage.setItem(
			"misMovimientos",
			movimientosExistentes + "|" + nuevoMovimiento,
		);
	} else {
		localStorage.setItem("misMovimientos", nuevoMovimiento);
	}

	mensaje.innerHTML = `
        <div class="alert alert-success text-center py-2" role="alert">
            ✅ ¡Depósito realizado con éxito!
        </div>
    `;
	setTimeout(() => {
		mensaje.innerHTML = "";
	}, 2000);
	depositar.value = "";
});
