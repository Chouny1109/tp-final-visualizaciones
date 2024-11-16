const calendarDays = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");
const tooltip = document.getElementById("tooltip");
let currentDate = new Date();

// Lista de feriados en Argentina (formato MM-DD)
const holidays = [
    { date: "01-01", name: "Año Nuevo" },
    { date: "05-01", name: "Día del Trabajador" },
    { date: "05-25", name: "Revolución de Mayo" },
    { date: "07-09", name: "Día de la Independencia" },
    { date: "12-25", name: "Navidad" }
];

// Lista de eventos especiales
const specialEvents = [
    { date: "03-21", name: "Inicio de Clases", color: "bg-info" },
    { date: "11-14", name: "Inscripción a exámenes finales, libres y acreditaciones", color: "bg-warning" },
    {date:  "11-15", name: "Inscripción a exámenes finales, libres y acreditaciones", color: "bg-warning" },
    {date:  "11-21", name: "Verificación de inscripción", color: "bg-warning" },
    {date:  "12-05", name: "Examenes turno Diciembre del 05/12 hasta 14/12", color: "bg-warning" },
    { date: "12-31", name: "Fiesta de Fin de Año", color: "bg-danger" }
];

function getEvent(day, month) {
    const formattedDate = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return holidays.find(event => event.date === formattedDate) ||
           specialEvents.find(event => event.date === formattedDate);
}

function showTooltip(event, message) {
    if (message) {
        tooltip.textContent = message;
        tooltip.style.left = `${event.pageX + 10}px`;
        tooltip.style.top = `${event.pageY + 10}px`;
        tooltip.style.display = 'block';
    }
}

function hideTooltip() {
    tooltip.style.display = 'none';
}

function renderCalendar(date) {
    calendarDays.innerHTML = "";
    const year = date.getFullYear();
    const month = date.getMonth();

    monthYear.textContent = date.toLocaleString("default", { month: "long", year: "numeric" });

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let dayCell = "";
    for (let i = 0; i < firstDayOfMonth; i++) {
        dayCell += "<td></td>";
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear();
        const event = getEvent(day, month);

        let classes = isToday ? 'today' : '';
        let tooltipMessage = '';
        if (event) {
            classes += ` ${event.color || 'holiday'}`;
            tooltipMessage = event.name;
        }

        dayCell += `<td class="${classes}" onmouseover="showTooltip(event, '${tooltipMessage}')" onmouseout="hideTooltip()">${day}</td>`;
        if ((day + firstDayOfMonth) % 7 === 0) {
            calendarDays.innerHTML += `<tr>${dayCell}</tr>`;
            dayCell = "";
        }
    }
    if (dayCell) {
        calendarDays.innerHTML += `<tr>${dayCell}</tr>`;
    }
}

document.getElementById("prevMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

document.getElementById("nextMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

renderCalendar(currentDate);