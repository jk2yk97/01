document.addEventListener('DOMContentLoaded', function() {
    const allSubjects = document.querySelectorAll('li');
    const semesters = document.querySelectorAll('.semester');
    const secondSemester = semesters[1]; // II semestre 1er año
    const prácticas = document.querySelector('.year:nth-child(3) .semester');

    // Función para marcar estado activo o bloqueado
    function setLiState(li, state) {
        if (state === 'activo') {
            li.classList.add('activo');
            li.classList.remove('bloqueado');
        } else {
            li.classList.add('bloqueado');
            li.classList.remove('activo');
        }
    }

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

    // Revisa y actualiza desbloqueos y estados visuales
    function checkUnlocking() {
        const firstSemSubjects = [...semesters[0].querySelectorAll('li')];
        const secondSemSubjects = [...semesters[1].querySelectorAll('li')];
        const prácticasSubjects = prácticas.querySelectorAll('li');

        // Bloquear todos del segundo semestre y prácticas inicialmente
        secondSemSubjects.forEach(li => setLiState(li, 'bloqueado'));
        prácticasSubjects.forEach(li => setLiState(li, 'bloqueado'));

        // Verificar si desbloquea segundo semestre
        const firstSemNonEnglish = firstSemSubjects.filter(li => !li.textContent.includes('English'));
        const allCompleted = firstSemNonEnglish.every(li => li.classList.contains('completed'));

        const requiredSubjects = [
            'Atención Telefónica y Mensajería en Alojamientos',
            'Reservación y Recepción en Alojamientos'
        ];

        const requiredCompleted = requiredSubjects.every(name => isCompleted(name));

        if (allCompleted && requiredCompleted) {
            semesters[1].classList.add('active');
            semesters[1].classList.remove('inactive');
            semesters[1].querySelector('.status-dot').textContent = '●';

            secondSemSubjects.forEach(li => {
                setLiState(li, 'activo');
            });
        } else {
            semesters[1].classList.add('inactive');
            semesters[1].classList.remove('active');
            semesters[1].querySelector('.status-dot').textContent = '○';
        }

        // Habilitar inglés progresivamente
        if (isCompleted('English A1 Breakthrough')) {
            const a2 = [...allSubjects].find(el => el.textContent.trim() === 'English A2 Waystage');
            if (a2) setLiState(a2, 'activo');
        }
        if (isCompleted('English A2 Waystage')) {
            const b1 = [...allSubjects].find(el => el.textContent.trim() === 'English B1 Threshold');
            if (b1) setLiState(b1, 'activo');
        }

        // Desbloquear prácticas si año 1 completo
        const year1Subjects = [...firstSemSubjects, ...secondSemSubjects];
        const allYear1Completed = year1Subjects.every(li => li.classList.contains('completed'));
        const facturacionCajaOk = isCompleted('Facturación y Caja en Alojamientos');

        if (allYear1Completed && facturacionCajaOk) {
            prácticas.classList.add('active');
            prácticas.classList.remove('inactive');
            prácticas.querySelector('.status-dot').textContent = '●';

            prácticasSubjects.forEach(li => setLiState(li, 'activo'));
        } else {
            prácticas.classList.add('inactive');
            prácticas.classList.remove('active');
            prácticas.querySelector('.status-dot').textContent = '○';

            prácticasSubjects.forEach(li => setLiState(li, 'bloqueado'));
        }
    }

    // Inicializar estados y eventos
    allSubjects.forEach(li => {
        const key = li.textContent.trim();

        // Bloquear li que estén en semestres inactivos
        const parentSemester = li.closest('.semester');
        if (parentSemester.classList.contains('inactive')) {
            setLiState(li, 'bloqueado');
        } else {
            setLiState(li, 'activo');
        }

        // Bloquear inicialmente inglés A2 y B1
        if (key.includes('English A2') || key.includes('English B1')) {
            setLiState(li, 'bloqueado');
        }

        // Marcar completados según localStorage
        if (localStorage.getItem(key) === 'completed') {
            li.classList.add('completed');
            li.style.textDecoration = 'line-through';
        }

        li.addEventListener('click', () => {
            if (li.classList.contains('bloqueado')) return;

            li.classList.toggle('completed');
            li.style.textDecoration = li.classList.contains('completed') ? 'line-through' : 'none';

            localStorage.setItem(key, li.classList.contains('completed') ? 'completed' : '');

            checkUnlocking();
        });
    });

    checkUnlocking();
});
