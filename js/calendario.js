/*const calendarDays = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");
let currentDate = new Date();

function renderCalendar(date) {
    calendarDays.innerHTML = "";
    const year = date.getFullYear();
    const month = date.getMonth();
    
    monthYear.textContent = date.toLocaleString("default", { month: "long", year: "numeric" });

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let dayCell = "";
    for (let i = 0; i < firstDayOfMonth; i++) {
        dayCell += "<td></td>"; // Espacios vacíos hasta el primer día del mes
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear();
        dayCell += `<td class="${isToday ? 'today' : ''}">${day}</td>`;
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

renderCalendar(currentDate);*/
    const calendarDays = document.getElementById("calendarDays");
    const monthYear = document.getElementById("monthYear");
    let currentDate = new Date();

    // Lista de feriados en Argentina (formato MM-DD)
    const holidays = [
        "01-01", // Año Nuevo
        "05-01", // Día del Trabajador
        "05-25", // Revolución de Mayo
        "07-09", // Día de la Independencia
        "12-25"  // Navidad
        // Agrega otros feriados aquí...
    ];

    function isHoliday(day, month) {
        const formattedDate = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return holidays.includes(formattedDate);
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
            dayCell += "<td></td>"; // Espacios vacíos hasta el primer día del mes
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear();
            const isHolidayToday = isHoliday(day, month);

            dayCell += `<td class="${isToday ? 'today' : ''} ${isHolidayToday ? 'holiday' : ''}">${day}</td>`;
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