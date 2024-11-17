document.getElementById('generate-pdf').addEventListener('click', () => {
    // Construir dinámicamente el contenido HTML para el PDF
    let htmlContent = `
        <h2>Inscripción realizada con éxito</h2>
        <p>Te has inscrito con éxito en las siguientes materias:</p>
        <ul>
    `;

    // Recorremos las materias seleccionadas
    seleccionadas.forEach(item => {
        const [materia, horario] = item.split(' - ');
        htmlContent += `
            <li>
                <strong>${materia}</strong>: ${horario}
            </li>
        `;
    });

    // Cerramos la lista
    htmlContent += `
        </ul>
        <p>Puedes verificar las materias a las que te inscribiste en cualquier momento.</p>
    `;

    // Crear un contenedor temporal en el DOM
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    // Usar html2pdf para generar el PDF
    html2pdf().from(tempDiv).save('inscripcion.pdf');

    // Opcional: eliminar el contenedor temporal después de generar el PDF
    tempDiv.remove();
});

const botones = document.querySelectorAll(".buttonIncri");
let clickeo = false;  

botones.forEach((boton) => {
    boton.addEventListener("click", () => {
        clickeo = true;
        boton.classList.toggle("selected");

        if (clickeo) {
            nextBtn.disabled = false;
        }
        verificarSeleccionDeHorarios()
    });
});

const carouselElement = document.getElementById('inscripcionCarousel');
const prevBtn = carouselElement.querySelector('[data-bs-slide="prev"]');
const nextBtn = carouselElement.querySelector('[data-bs-slide="next"]');

nextBtn.disabled = true;

carouselElement.addEventListener('slid.bs.carousel', () => {
    const isFirstSlide = carouselElement.querySelector('.carousel-item:first-child').classList.contains('active');
    prevBtn.disabled = isFirstSlide;

    verificarSeleccionDeHorarios();
});

const buttons = document.querySelectorAll('.buttonIncri');
const materiasSeleccionadasContainer = document.getElementById('materiasSeleccionadas');
const seleccionadas = [];

buttons.forEach(button => {
    button.addEventListener('click', function() {
        const materiaSeleccionada = this.textContent || this.innerText;

        const materiaHTML = `
            <div class="col-md-4 mb-3 text-center">
                <h5>${materiaSeleccionada}</h5>
                <div class="horario">
                    <button type="button" class="btn w-100 buttonIncri1" value="Lun-Vie 19 a 23hs. Com 368">Lun-Vie 19 a 23hs. Com 368</button>
                    <button type="button" class="btn w-100 buttonIncri1" value="Miercoles 8 a 12hs. Com 368">Miercoles 8 a 12hs. Com 268</button>
                    <button type="button" class="btn w-100 buttonIncri1" value="Jueves 19 a 23hs. Com 368">Jueves 19 a 23hs. Com 168</button>
                </div>
            </div>
        `;

        materiasSeleccionadasContainer.innerHTML += materiaHTML;

        const carouselElement = document.getElementById('inscripcionCarousel');
        const nextBtn = carouselElement.querySelector('[data-bs-slide="next"]');
        nextBtn.disabled = false;
    });
});

materiasSeleccionadasContainer.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('buttonIncri1')) {
        const horarioSeleccionado = event.target.innerText;
        const materiaSeleccionada = event.target.closest('.col-md-4').querySelector('h5').innerText;

        const horariosMateria = event.target.closest('.horario').querySelectorAll('.buttonIncri1');
        horariosMateria.forEach(horario => {
            if (horario !== event.target) {
                horario.classList.remove('selected');
            }
        });

        event.target.classList.toggle('selected');

        const indexExistente = seleccionadas.findIndex(item => item.split(' - ')[0] === materiaSeleccionada);
        if (indexExistente !== -1) {
            seleccionadas.splice(indexExistente, 1);
        }

        if (event.target.classList.contains('selected')) {
            const materiaYHorario = `${materiaSeleccionada} - ${horarioSeleccionado}`;
            seleccionadas.push(materiaYHorario);
        }

        const confirmacionHorario = document.getElementById("seleccionadasIncripcion");
        confirmacionHorario.innerHTML = '';

        seleccionadas.forEach(item => {
            confirmacionHorario.innerHTML += `
                <div class="col-md-4 mb-3 text-center">
                    <h5>${item.split(' - ')[0]}</h5>
                    <div class="horario">
                        <p>Horario seleccionado: ${item.split(' - ')[1]}</p>
                    </div>
                </div>
            `;
        });

        verificarSeleccionDeHorarios();
    }
});

let currentStep = 1;

function updateProgress() {
    const progressBar = document.getElementById("progressBar");
    const stepMaterias = document.getElementById("stepMaterias");
    const stepHorarios = document.getElementById("stepHorarios");
    const stepConfirmacion = document.getElementById("stepConfirmacion");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    switch (currentStep) {
        case 1:
            progressBar.style.width = "33%";
            progressBar.innerText = "Paso 1 de 3";
            progressBar.setAttribute("aria-valuenow", "33");

            stepMaterias.classList.add("text-primary");
            stepHorarios.classList.remove("text-primary");
            stepConfirmacion.classList.remove("text-primary");

            prevBtn.disabled = true;
            nextBtn.innerText = "Siguiente";
            break;
        case 2:
            progressBar.style.width = "66%";
            progressBar.innerText = "Paso 2 de 3";
            progressBar.setAttribute("aria-valuenow", "66");

            stepMaterias.classList.remove("text-primary");
            stepHorarios.classList.add("text-primary");
            stepConfirmacion.classList.remove("text-primary");

            prevBtn.disabled = false;
            nextBtn.innerText = "Siguiente";

            verificarSeleccionDeHorarios();
            break;

        case 3:
            progressBar.style.width = "100%";
            progressBar.innerText = "Paso 3 de 3";
            progressBar.setAttribute("aria-valuenow", "100");

            stepMaterias.classList.remove("text-primary");
            stepHorarios.classList.remove("text-primary");
            stepConfirmacion.classList.add("text-primary");

            prevBtn.disabled = true;
            nextBtn.innerText = "Finalizar";

            nextBtn.disabled = false;

            nextBtn.removeEventListener('click', nextStep);
            nextBtn.removeAttribute('data-bs-slide');
            nextBtn.addEventListener('click', mostrarModalConfirmacion);
            break;
    }
}

function verificarSeleccionDeHorarios() {
    const materiasSeleccionadas = document.querySelectorAll('#materiasSeleccionadas h5').length;
    const horariosSeleccionados = seleccionadas.length;

    const nextBtn = document.querySelector('[data-bs-slide="next"]');
    const isLastSlide = carouselElement.querySelector('.carousel-item:last-child').classList.contains('active');

    nextBtn.disabled = (horariosSeleccionados < materiasSeleccionadas);
}

function mostrarModalConfirmacion() {
    const modal = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
    modal.show();
}

function nextStep() {
    if (currentStep < 3) {
        currentStep++;
        updateProgress();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateProgress();
    }
}

updateProgress();
