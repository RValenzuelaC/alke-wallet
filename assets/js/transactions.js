$(document).ready(function () {
	const $movementsList = $("#movementsList");

	// 1. Limpiamos la lista para estructurarla desde JavaScript
	$movementsList.empty();

	const movimientosGuardados = localStorage.getItem("misMovimientos");
	let todosLosMovimientos = [];

	// 2. Cargamos los movimientos reales nuevos y los invertimos para que el último sea el primero
	if (movimientosGuardados) {
		const listaMovimientos = movimientosGuardados.split("|");
		// .reverse() asegura que el depósito o transferencia más reciente salga arriba del todo
		listaMovimientos.reverse().forEach(function (movimiento) {
			if (movimiento.trim() !== "") {
				todosLosMovimientos.push({ texto: movimiento, oculto: false });
			}
		});
	}

	// 3. Cargamos los datos iniciales fijos debajo de los nuevos (y se ocultan por defecto)
	const datosIniciales = [
		"Compra en línea - $50.00",
		"Depósito - $100.00",
		"Transferencia recibida - $75.00",
		"Compra en línea - $5550.00",
		"Depósito misma cuenta - $10500.00",
		"Transferencia recibida - $7575.00",
	];

	datosIniciales.forEach(function (movimiento) {
		todosLosMovimientos.push({ texto: movimiento, oculto: true });
	});

	// 4. Renderizamos los elementos respetando el orden de arriba hacia abajo (.append)
	todosLosMovimientos.forEach(function (mov) {
		let claseColor = "text-white";
		const textoMin = mov.texto.toLowerCase();

		// Aplicamos colores según el tipo de movimiento
		if (textoMin.includes("depósito") || textoMin.includes("recibida")) {
			claseColor = "text-success font-weight-bold"; // Verde para ingresos
		} else if (textoMin.includes("compra") || textoMin.includes("enviada")) {
			claseColor = "text-danger font-weight-bold"; // Rojo para egresos
		}

		let claseOculto = mov.oculto ? "d-none historial-antiguo" : "";

		// Usamos .append() para inyectarlos en orden descendente estricto
		const itemHtml = `<li class="list-group-item bg-dark ${claseColor} border-secondary ${claseOculto}">${mov.texto}</li>`;
		$movementsList.append(itemHtml);
	});

	// 5. Agregamos el botón de flecha al final de la tarjeta de forma dinámica
	$movementsList.after(`
        <div class="text-center mt-3">
            <button id="btnMostrarMas" class="btn btn-link text-info font-weight-bold text-decoration-none">
                Mostrar más <span id="flechaBoton">▼</span>
            </button>
        </div>
    `);

	// 6. Evento de clic para alternar entre mostrar y ocultar
	$(document).on("click", "#btnMostrarMas", function () {
		const $elementosOcultos = $(".historial-antiguo");

		if ($elementosOcultos.first().hasClass("d-none")) {
			$elementosOcultos.removeClass("d-none").hide().slideDown("fast");
			$(this).html('Mostrar menos <span id="flechaBoton">▲</span>');
		} else {
			$elementosOcultos.slideUp("fast", function () {
				$(this).addClass("d-none");
			});
			$(this).html('Mostrar más <span id="flechaBoton">▼</span>');
		}
	});
});
