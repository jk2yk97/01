document.addEventListener('DOMContentLoaded', function () {
    const allSubjects = document.querySelectorAll('li');
    const semesters = document.querySelectorAll('.semester');

    const firstSemester = semesters[0];
    const secondSemester = semesters[1];

    const year1 = document.querySelector('.year-1');
    const year2 = document.querySelector('.year-2');

    // Cargar estado desde localStorage
    allSubjects.forEach(li => {
        const key = li.textContent.trim();
        const saved = localStorage.getItem(key);
        if (saved === 'completed') {
            li.classList.add('completed');
            li.style.textDecoration = 'line-through';
            li.style.opacity = '1';
            li.style.pointerEvents = 'auto';
        }
    });

    function isCompleted(text) {
        const li = [...allSubjects].find(el => el.textContent.trim() === text);
        return li && li.classList.contains('completed');
    }

    function checkUnlocking() {
        // Desbloqueo del segundo semestre del 1er año
        const firstSemSubjects = [...firstSemester.querySelectorAll('li')];
        const firstSemNonEnglish = firstSemSubjects.filter(li => !li.textContent.includes('English'));
        const allFirstSemNonEnglishCompleted = firstSemNonEnglish.every(li => li.classList.contains('completed'));

        if (allFirstSemNonEnglishCompleted) {
            secondSemester.classList.add('active-1');
            secondSemester.classList.remove('inactive-1', 'inactive-2');
        } else {
            secondSemester.classList.add('inactive-1');
            secondSemester.classList.remove('active-1');
        }

        // Desbloqueo progresivo de materias de inglés
        if (isCompleted('English A1 Breakthrough')) {
            enableEnglish('English A2 Waystage');
        } else {
            disableEnglish('English A2 Waystage');
        }
        if (isCompleted('English A2 Waystage')) {
            enableEnglish('English B1 Threshold');
        } else {
            disableEnglish('English B1 Threshold');
        }

        // Desbloqueo del 2do año si todas las materias del 1er año están completadas
        const firstYearSubjects = [...year1.querySelectorAll('li')];
        const allYear1Completed = firstYearSubjects.every(li => li.classList.contains('completed'));

        const secondYearSemester = year2.querySelector('.semester');

        if (allYear1Completed) {
            year2.classList.add('active');
            year2.classList.remove('inactive');

            if (secondYearSemester) {
                secondYearSemester.classList.remove('inactive-2');
                secondYearSemester.classList.add('active-2'); // usamos active-1 para que funcione el clic
            }
        } else {
            year2.classList.add('inactive');
            year2.classList.remove('active');

            if (secondYearSemester) {
                secondYearSemester.classList.add('inactive-2');
                secondYearSemester.classList.remove('active-1');
            }
        }
    }

    function enableEnglish(text) {
        const li = [...allSubjects].find(el => el.textContent.trim() === text);
        if (li) {
            li.style.opacity = '1';
            li.style.pointerEvents = 'auto';
        }
    }

    function disableEnglish(text) {
        const li = [...allSubjects].find(el => el.textContent.trim() === text);
        if (li) {
            li.style.opacity = '0.5';
            li.style.pointerEvents = 'none';
            li.classList.remove('completed');
            li.style.textDecoration = 'none';
            localStorage.removeItem(text);
        }
    }

    allSubjects.forEach(li => {
        const key = li.textContent.trim();

        // Inicialmente bloquear A2 y B1, excepto si ya están completados
        if ((key === 'English A2 Waystage' || key === 'English B1 Threshold') && !isCompleted(key)) {
            disableEnglish(key);
        }

        li.addEventListener('click', () => {
            const semester = li.closest('.semester');
            if (!semester) return;

            const isActive = semester.classList.contains('active-1') || semester.classList.contains('active-2') || semester.classList.contains('active');
            if (!isActive) return;

            const isEnglish = li.textContent.includes('English');
            const text = li.textContent.trim();

            if (isEnglish) {
                const canComplete =
                    (text === 'English A1 Breakthrough') ||
                    (text === 'English A2 Waystage' && isCompleted('English A1 Breakthrough')) ||
                    (text === 'English B1 Threshold' && isCompleted('English A2 Waystage'));

                if (canComplete) {
                    li.classList.toggle('completed');
                    li.style.textDecoration = li.classList.contains('completed') ? 'line-through' : 'none';
                    localStorage.setItem(key, li.classList.contains('completed') ? 'completed' : '');
                    checkUnlocking();
                }
            } else {
                li.classList.toggle('completed');
                li.style.textDecoration = li.classList.contains('completed') ? 'line-through' : 'none';
                localStorage.setItem(key, li.classList.contains('completed') ? 'completed' : '');
                checkUnlocking();
            }
        });
    });

    checkUnlocking();
});
