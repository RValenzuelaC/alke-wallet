const balance = document.getElementById("balance");

balance.textContent = parseFloat(localStorage.getItem("totalSueldo")) || 0;
