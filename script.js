document.addEventListener('DOMContentLoaded', function () {
  const allSubjects = document.querySelectorAll('li');
  const semesters = document.querySelectorAll('.semester');

  const firstSemester = semesters[0];
  const secondSemester = semesters[1];

  const year1 = document.querySelector('.year-1');
  const year2 = document.querySelector('.year-2');

  // Cargar estado desde localStorage
  allSubjects.forEach(li => {
    const key = li.querySelector('span').textContent.trim();
    const saved = localStorage.getItem(key);
    if (saved === 'completed') {
      li.classList.add('completed');
    }
  });

  function isCompleted(text) {
    const li = [...allSubjects].find(el => el.querySelector('span').textContent.trim() === text);
    return li && li.classList.contains('completed');
  }

  function checkUnlocking() {
    const firstSemSubjects = [...firstSemester.querySelectorAll('li')];
    const firstSemNonEnglish = firstSemSubjects.filter(li => !li.querySelector('span').textContent.includes('English'));
    const allFirstSemNonEnglishCompleted = firstSemNonEnglish.every(li => li.classList.contains('completed'));

    if (allFirstSemNonEnglishCompleted) {
      secondSemester.classList.add('active-1');
      secondSemester.classList.remove('inactive-1', 'inactive-2');
    } else {
      secondSemester.classList.add('inactive-1');
      secondSemester.classList.remove('active-1');
    }

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

    const firstYearSubjects = [...year1.querySelectorAll('li')];
    const allYear1Completed = firstYearSubjects.every(li => li.classList.contains('completed'));

    const secondYearSemester = year2.querySelector('.semester');

    if (allYear1Completed) {
      year2.classList.add('active');
      year2.classList.remove('inactive');
      if (secondYearSemester) {
        secondYearSemester.classList.remove('inactive-2');
        secondYearSemester.classList.add('active-2');
      }
    } else {
      year2.classList.add('inactive');
      year2.classList.remove('active');
      if (secondYearSemester) {
        secondYearSemester.classList.add('inactive-2');
        secondYearSemester.classList.remove('active-2');
      }
    }
  }

  function enableEnglish(text) {
    const li = [...allSubjects].find(el => el.querySelector('span').textContent.trim() === text);
    if (li) {
      li.style.opacity = '1';
      li.style.pointerEvents = 'auto';
    }
  }

  function disableEnglish(text) {
    const li = [...allSubjects].find(el => el.querySelector('span').textContent.trim() === text);
    if (li) {
      li.style.opacity = '0.5';
      li.style.pointerEvents = 'none';
      li.classList.remove('completed');
      localStorage.removeItem(text);
    }
  }

  allSubjects.forEach(li => {
    const key = li.querySelector('span').textContent.trim();
    if ((key === 'English A2 Waystage' || key === 'English B1 Threshold') && !isCompleted(key)) {
      disableEnglish(key);
    }

    li.addEventListener('click', (e) => {
      if (e.target.closest('.info-btn')) return;

      const semester = li.closest('.semester');
      if (!semester) return;

      const isActive = semester.classList.contains('active-1') || semester.classList.contains('active-2');
      if (!isActive) return;

      const isEnglish = li.querySelector('span').textContent.includes('English');
      const text = li.querySelector('span').textContent.trim();

      if (isEnglish) {
        const canComplete =
          (text === 'English A1 Breakthrough') ||
          (text === 'English A2 Waystage' && isCompleted('English A1 Breakthrough')) ||
          (text === 'English B1 Threshold' && isCompleted('English A2 Waystage'));

        if (canComplete) {
          li.classList.toggle('completed');
          localStorage.setItem(key, li.classList.contains('completed') ? 'completed' : '');
          checkUnlocking();
        }
      } else {
        li.classList.toggle('completed');
        localStorage.setItem(key, li.classList.contains('completed') ? 'completed' : '');
        checkUnlocking();
      }
    });
  });

  // Modal functionality
  const modal = document.getElementById('infoModal');
  const form = document.getElementById('moduleForm');
  const modalTitle = document.getElementById('modalTitle');
  const saveBtn = document.getElementById('saveBtn');
  let currentModuleId = '';

  function openModal(id, title) {
    currentModuleId = id;
    modalTitle.textContent = title;
    const data = JSON.parse(localStorage.getItem(`modinfo-${id}`)) || {};
    const today = new Date().toISOString().split('T')[0];
    form.docente.value = data.docente || '';
    form.grupo.value = data.grupo || '';
    form.inicio.value = data.inicio || today;
    form.fin.value = data.fin || today;
    form.nota.value = data.nota || '';
    form.estado.value = data.estado || 'Aprobado';
    modal.style.display = 'block';
  }

  function saveFormData() {
    const data = {
      docente: form.docente.value,
      grupo: form.grupo.value,
      inicio: form.inicio.value,
      fin: form.fin.value,
      nota: form.nota.value,
      estado: form.estado.value
    };
    localStorage.setItem(`modinfo-${currentModuleId}`, JSON.stringify(data));
  }

  document.querySelectorAll('.info-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const li = this.closest('li');
      const id = li.dataset.id;
      const title = li.querySelector('span').textContent.trim();
      openModal(id, title);
    });
  });

  document.querySelector('.close-btn').addEventListener('click', function() {
    modal.style.display = 'none';
  });

  saveBtn.addEventListener('click', function() {
    saveFormData();
    modal.style.display = 'none';
    alert('¡Guardado con éxito!');
  });

  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });


  checkUnlocking();
});
