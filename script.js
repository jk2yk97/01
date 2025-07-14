document.addEventListener('DOMContentLoaded', function () {
    const allSubjects = document.querySelectorAll('li');
    const semesters = document.querySelectorAll('.semester');
    const secondSemester = semesters[1]; // II semestre 1er año
    const prácticas = document.querySelector('.year:nth-child(3) .semester');

    // Cargar estado desde localStorage
    allSubjects.forEach(li => {
        const key = li.textContent.trim();
        const saved = localStorage.getItem(key);
        if (saved === 'completed') {
            li.classList.add('completed');
            li.style.textDecoration = 'line-through';
        }
    });

    function isCompleted(text) {
        const li = [...allSubjects].find(el => el.textContent.trim() === text);
        return li && li.classList.contains('completed');
    }

    function checkUnlocking() {
        const firstSemSubjects = [...semesters[0].querySelectorAll('li')];
        const firstSemNonEnglish = firstSemSubjects.filter(li => !li.textContent.includes('English'));
        const allCompleted = firstSemNonEnglish.every(li => li.classList.contains('completed'));

        const requiredSubjects = [
            'Atención Telefónica y Mensajería en Alojamientos',
            'Reservación y Recepción en Alojamientos'
        ];

        const requiredCompleted = requiredSubjects.every(name => isCompleted(name));

        if (allCompleted && requiredCompleted) {
            secondSemester.classList.add('active');
            secondSemester.classList.remove('inactive');
            secondSemester.querySelector('.status-text').textContent = 'Activo';
            secondSemester.querySelector('.status-dot').textContent = '●';
        }

        if (isCompleted('English A1 Breakthrough')) {
            enableEnglish('English A2 Waystage');
        }
        if (isCompleted('English A2 Waystage')) {
            enableEnglish('English B1 Threshold');
        }

        const secondSemSubjects = [...secondSemester.querySelectorAll('li')];
        const year1Subjects = [...firstSemSubjects, ...secondSemSubjects];
        const allYear1Completed = year1Subjects.every(li => li.classList.contains('completed'));
        const facturacionCajaOk = isCompleted('Facturación y Caja en Alojamientos');

        if (allYear1Completed && facturacionCajaOk) {
            prácticas.classList.add('active');
            prácticas.classList.remove('inactive');
            prácticas.querySelector('.status-text').textContent = 'Activo';
            prácticas.querySelector('.status-dot').textContent = '●';
        }
    }

    function enableEnglish(text) {
        const li = [...allSubjects].find(el => el.textContent.trim() === text);
        if (li) {
            li.style.opacity = '1';
            li.style.pointerEvents = 'auto';
        }
    }

    allSubjects.forEach(li => {
        const key = li.textContent.trim();

        // Inicialmente bloquear A2 y B1
        if (key.includes('English A2') || key.includes('English B1')) {
            li.style.opacity = '0.5';
            li.style.pointerEvents = 'none';
        }

        li.addEventListener('click', () => {
            li.classList.toggle('completed');
            li.style.textDecoration = li.classList.contains('completed') ? 'line-through' : 'none';

            // Guardar estado
            localStorage.setItem(key, li.classList.contains('completed') ? 'completed' : '');

            checkUnlocking();
        });
    });

    checkUnlocking();
});
