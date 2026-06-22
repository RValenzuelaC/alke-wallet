$(document).ready(function () {
	const $movementsList = $("#movementsList");

	// se limpia la lista para empezar a estructurarla
	$movementsList.empty();

	const movimientosGuardados = localStorage.getItem("misMovimientos");
	let todosLosMovimientos = [];

	//  se cargan los movimientos reales nuevos y los invertimos para que el último sea el primero
	if (movimientosGuardados) {
		const listaMovimientos = movimientosGuardados.split("|");
		// se utiliza reverse para que queden los ultimos movimientos al principio de la lista.
		listaMovimientos.reverse().forEach(function (movimiento) {
			if (movimiento.trim() !== "") {
				todosLosMovimientos.push({ texto: movimiento, oculto: false });
			}
		});
	}

	// datos iniciales de los movimientos antes de todo.
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

	// se renderizn los elementos respetando el orden de arriba hacia abajo (.append)
	todosLosMovimientos.forEach(function (movTransaciones) {
		let claseColor = "text-white";
		const textoMinimo = movTransaciones.texto.toLowerCase();

		if (textoMinimo.includes("depósito") || textoMinimo.includes("recibida")) {
			claseColor = "text-success font-weight-bold";
		} else if (
			textoMinimo.includes("compra") ||
			textoMinimo.includes("enviada")
		) {
			claseColor = "text-danger font-weight-bold";
		}

		let claseOculto = movTransaciones.oculto ? "d-none historial-antiguo" : "";

		// se utiliza append() para que los movimientos salgan en forma descendente
		const itemHtml = `<li class="list-group-item bg-dark ${claseColor} border-secondary ${claseOculto}">${movTransaciones.texto}</li>`;
		$movementsList.append(itemHtml);
	});

	// Agregamos el botón mostrar más para ver la info de las transacciones
	$movementsList.after(`
        <div class="text-center mt-3">
            <button id="btnMostrarMas" class="btn btn-link text-info font-weight-bold text-decoration-none">
                Mostrar más <span id="flechaBoton">▼</span>
            </button>
        </div>
    `);

	// funcion para mostrar o ocular los archivos mostrados.
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
