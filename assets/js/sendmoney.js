$(document).ready(function () {
	let contactoSeleccionado = null;
	let transferenciaEnProgreso = false;

	// Función auxiliar para mostrar los mensajes en el HTML de forma dinámica
	function mostrarMensaje(texto, tipo) {
		// tipo puede ser 'success' (verde) o 'danger' (rojo)
		$("#mensaje").html(`
            <div class="alert alert-${tipo} alert-dismissible fade show font-weight-bold text-center" role="alert">
                ${texto}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);

		// Desplaza la pantalla automáticamente hacia arriba para que el usuario vea el mensaje
		$("html, body").animate({ scrollTop: 0 }, "slow");
	}

	// Renderiza los usuarios fijos de forma limpia al cargar
	function cargarContactosBase() {
		$("#contactList").html(`
          <li class="list-group-item bg-dark text-white border-secondary" data-nombre="John Doe" style="cursor: pointer;">
            <div class="contact-info">
              <strong class="contact-name">John Doe</strong><br>
              <small class="contact-details text-muted">RUT: 11.111.111-1, Alias: john.doe, Banco: ABC Bank</small>
            </div>
          </li>
          <li class="list-group-item bg-dark text-white border-secondary" data-nombre="Jane Smith" style="cursor: pointer;">
            <div class="contact-info">
              <strong class="contact-name">Jane Smith</strong><br>
              <small class="contact-details text-muted">RUT: 22.222.222-2, Alias: jane.smith, Banco: XYZ Bank</small>
            </div>
          </li>
        `);
	}

	// Carga inicial de los contactos, si es que hay alguno en localstorage
	if ($("#contactList").length) {
		cargarContactosBase();

		const contactosGuardados = localStorage.getItem("misContactos");
		if (contactosGuardados) {
			const listaContactos = contactosGuardados.split("|");
			listaContactos.forEach(function (contactoTexto) {
				if (contactoTexto) {
					const datos = contactoTexto.split(",");
					const itemHtml = `
                <li class="list-group-item bg-dark text-white border-secondary" data-nombre="${datos[0]}" style="cursor: pointer;">
                  <div class="contact-info">
                    <strong class="contact-name">${datos[0]}</strong><br>
                    <small class="contact-details text-muted">RUT: ${datos[1]}, Alias: ${datos[2]}, Banco: ${datos[3]}</small>
                  </div>
                </li>
              `;
					$("#contactList").append(itemHtml);
				}
			});
		}
	}

	// Guardar un nuevo contacto personalizado
	$("#formNuevoContacto").on("submit", function (event) {
		event.preventDefault();

		const nombre = $("#nombreContacto").val();
		const rutIngresado = $("#rutContacto").val();
		const banco = $("#bancoContacto").val();
		const alias = $("#aliasContacto").val();

		const nuevoItem = `
          <li class="list-group-item bg-dark text-white border-secondary" data-nombre="${nombre}" style="cursor: pointer;">
            <div class="contact-info">
              <strong class="contact-name">${nombre}</strong><br>
              <small class="contact-details text-muted">RUT: ${rutIngresado}, Alias: ${alias}, Banco: ${banco}</small>
            </div>
          </li>
        `;

		$("#contactList").append(nuevoItem);

		const nuevoContactoTexto = `${nombre},${rutIngresado},${alias},${banco}`;
		const existentes = localStorage.getItem("misContactos");
		if (existentes) {
			localStorage.setItem(
				"misContactos",
				existentes + "|" + nuevoContactoTexto,
			);
		} else {
			localStorage.setItem("misContactos", nuevoContactoTexto);
		}

		$("#formNuevoContacto")[0].reset();
		$("#modalAgregarContacto").modal("hide");

		// Mensaje de éxito al agregar contacto en lugar de un alert
		mostrarMensaje(`Contacto "${nombre}" agregado correctamente.`, "success");
	});

	// Buscador con funcionalidad
	$("#searchContact").on("keyup", function () {
		const valorBusqueda = $(this).val().toLowerCase();

		$("#contactList li").each(function () {
			const nombreContacto = $(this).find(".contact-name").text().toLowerCase();

			if (nombreContacto.indexOf(valorBusqueda) > -1) {
				$(this).show();
			} else {
				$(this).hide();
			}
		});
	});

	// Marcar contacto activo al hacer clic
	$("#contactList").on("click", ".list-group-item", function () {
		$("#contactList li").removeClass("active bg-primary").addClass("bg-dark");
		$(this).addClass("active bg-primary").removeClass("bg-dark");
		contactoSeleccionado = $(this).attr("data-nombre");
	});

	// Acción de abrir el modal
	$("#btnEnviarDinero").on("click", function () {
		if (!contactoSeleccionado) {
			mostrarMensaje(
				"Por favor, selecciona un contacto de la lista primero.",
				"danger",
			);
		} else {
			$("#destinoNombre").text(contactoSeleccionado);
			$("#montoTransferir").val("");
			$("#modalTransferir").modal("show");
		}
	});

	// Botón Confirmar del modal
	$("#btnConfirmarTransferencia").on("click", function () {
		if (transferenciaEnProgreso) return;

		const monto = parseFloat($("#montoTransferir").val());
		const saldoActual = parseFloat(localStorage.getItem("totalSueldo")) || 0;

		if (isNaN(monto) || monto <= 0) {
			// Cerramos el modal momentáneamente para que el usuario pueda ver el mensaje de error detrás
			$("#modalTransferir").modal("hide");
			mostrarMensaje("Por favor, ingresa un monto válido mayor a 0.", "danger");
			return;
		}

		if (monto > saldoActual) {
			$("#modalTransferir").modal("hide");
			mostrarMensaje(
				"Saldo insuficiente para realizar esta transferencia.",
				"danger",
			);
			return;
		}

		transferenciaEnProgreso = true;

		localStorage.setItem("totalSueldo", saldoActual - monto);

		const nuevoMovimiento = `Transferencia enviada - $${monto} a ${contactoSeleccionado}`;
		const movimientosExistentes = localStorage.getItem("misMovimientos");

		if (movimientosExistentes) {
			localStorage.setItem(
				"misMovimientos",
				movimientosExistentes + "|" + nuevoMovimiento,
			);
		} else {
			localStorage.setItem("misMovimientos", nuevoMovimiento);
		}

		// Cerramos el modal de transferencia
		$("#modalTransferir").modal("hide");

		// Mostramos el mensaje exitoso e incrustado directamente en tu div #mensaje
		mostrarMensaje(
			`¡Transferencia Exitosa! Se han enviado $${monto} a ${contactoSeleccionado}.`,
			"success",
		);

		// Reseteamos el formulario de forma limpia
		$("#contactList li").removeClass("active bg-primary").addClass("bg-dark");
		contactoSeleccionado = null;
		transferenciaEnProgreso = false;
	});
});
