    // Función que muestra campos adicionales basado en una condición
    function mostrarCamposAdicionales() {
        const estudioPrevio = document.getElementById('estudioPrevio').value;
        const camposAdicionales = document.getElementById('camposAdicionales');
        if (estudioPrevio === 'si') {
            camposAdicionales.style.display = 'block';
        } else {
            camposAdicionales.style.display = 'none';
        }
    }
document.addEventListener("DOMContentLoaded", function() {

    // Variables
    let seccionActual = 1;
    const btnSiguiente = document.getElementById('botonSiguiente'); 
    const btnAnterior = document.getElementById('anterior');
    const btnEnviar = document.getElementById('enviar');
    const formulario = document.querySelector('form'); 

    // Función para activar o desactivar campos requeridos en una sección
    function actualizarCamposRequeridos(seccion, activar) {
        let campos = seccion.querySelectorAll('input, textarea, select');
        campos.forEach(campo => {
            if (activar) {
                campo.setAttribute('required', true);
            } else {
                campo.removeAttribute('required');
            }
        });
    }

    // Función que maneja el botón "Siguiente"
    btnSiguiente.addEventListener('click', function() {
        btnSiguiente.disabled = true;
        let seccionAnterior = document.getElementById('seccion' + seccionActual);
        seccionAnterior.style.display = 'none';
        actualizarCamposRequeridos(seccionAnterior, false);
        
        seccionActual++;
        
        let seccionNueva = document.getElementById('seccion' + seccionActual);
        if (seccionNueva) {
            seccionNueva.style.display = 'block';
            actualizarCamposRequeridos(seccionNueva, true);
        }
        
        btnAnterior.style.display = 'block';
        if (!document.getElementById('seccion' + (seccionActual + 1))) {
            btnSiguiente.style.display = 'none';
            btnEnviar.style.display = 'block';
        }
        btnSiguiente.disabled = false;
    });

    // Función que maneja el botón "Anterior"
    btnAnterior.addEventListener('click', function() {
        btnAnterior.disabled = true; // Desactiva al principio

        let seccionActualDiv = document.getElementById('seccion' + seccionActual);
        seccionActualDiv.style.display = 'none';
        actualizarCamposRequeridos(seccionActualDiv, false);

        seccionActual--;

        let seccionAnteriorDiv = document.getElementById('seccion' + seccionActual);
        seccionAnteriorDiv.style.display = 'block';
        actualizarCamposRequeridos(seccionAnteriorDiv, true);

        btnSiguiente.style.display = 'block';
        btnEnviar.style.display = 'none';
        if (seccionActual === 1) {
            btnAnterior.style.display = 'none';
        }
        btnAnterior.disabled = false;  // Activa al final
    });



    // Función que maneja la lógica de envío del formulario
    btnEnviar.addEventListener('click', (e) => {
        e.preventDefault();
    
        console.log('Datos a enviar:', [...new FormData(formulario).entries()]);
    
        fetch('/procesar', {
            method: 'POST',
            body: new FormData(formulario)
        })
        .then(res => {
            // Check if the response is JSON
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return res.json();
            } else {
                // If it's not JSON, throw an error
                throw new Error('Received non-JSON response from server');
            }
        })
        .then(({ redirectUrl }) => {
            window.location.href = redirectUrl;
        })    
        .catch(error => {
            console.error('Hubo un problema con la operación fetch:', error.message);
        });   
    });

    // Inicialización
    for (let i = 2; i <= 10; i++) {
        let seccion = document.getElementById('seccion' + i);
        if (seccion) {
            actualizarCamposRequeridos(seccion, false);
        }
    }
    btnAnterior.style.display = 'none';

});
