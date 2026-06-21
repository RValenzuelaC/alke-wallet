const usuario = "Ignacio";
const password = "1234";

const btnSubmit = document.getElementById("submit");
const usuarioRequerido = document.getElementById("usuario");
const contrasenaRequerida = document.getElementById("password");
const mensaje = document.getElementById("mensaje");

btnSubmit.addEventListener("click", (e) => {
	e.preventDefault();

	const usuarioIngresado = usuarioRequerido.value.trim();
	const contrasenaIngresada = contrasenaRequerida.value.trim();

	if (usuarioIngresado === "" || contrasenaIngresada === "") {
		mensaje.innerHTML = `
	<div class="alert alert-warning">
		Debes completar todos los campos
	</div>
`;
		return;
	}

	if (usuarioIngresado === usuario && contrasenaIngresada === password) {
		mensaje.innerHTML = `
		<div class="alert alert-success">
			Bienvenido a tu billetera virtual.
		</div>
	`;

		setTimeout(() => {
			window.location.href = "../menu/menu.html";
		}, 1000);
	} else {
		mensaje.innerHTML = `
	<div class="alert alert-danger">
		Usuario o contraseña incorrectos
	</div>
`;
	}
});
