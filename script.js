document.addEventListener('DOMContentLoaded', function () {
    const allLevels = document.querySelectorAll('li');
    const years = document.querySelectorAll('.year');
    
    function enableLevel(levelName) {
        const li = [...allLevels].find(el => el.querySelector('span').textContent.trim() === levelName);
        if (li) {
            li.style.opacity = '1';
            li.style.pointerEvents = 'auto';
            li.classList.remove('disabled');
        }
    }

    function disableLevel(levelName) {
        const li = [...allLevels].find(el => el.querySelector('span').textContent.trim() === levelName);
        if (li) {
            li.style.opacity = '0.5';
            li.style.pointerEvents = 'none';
            li.classList.add('disabled');
        }
    }

    function isCompleted(levelName) {
        const li = [...allLevels].find(el => el.querySelector('span').textContent.trim() === levelName);
        return li && li.classList.contains('completed');
    }

    allLevels.forEach(li => {
        const key = li.querySelector('span').textContent.trim();
        const saved = localStorage.getItem(key);
        if (saved === 'completed') {
            li.classList.add('completed');
        } else {
            li.classList.remove('completed');
        }
    });

    function checkUnlocking() {
        disableLevel('中文水平二级');
        disableLevel('中文水平三级');
        disableLevel('中文水平四级');
        disableLevel('中文水平五级');
        disableLevel('中文水平六级');
        
        if (isCompleted('中文水平一级')) enableLevel('中文水平二级');
        
        if (isCompleted('中文水平二级')) {
            enableLevel('中文水平三级');
            document.querySelector('.year-2').classList.add('active');
            document.querySelector('.year-2').classList.remove('inactive');
        }
        
        if (isCompleted('中文水平三级')) enableLevel('中文水平四级');
        
        if (isCompleted('中文水平四级')) {
            enableLevel('中文水平五级');
            document.querySelector('.year-3').classList.add('active');
            document.querySelector('.year-3').classList.remove('inactive');
        }
        
        if (isCompleted('中文水平五级')) enableLevel('中文水平六级');
    }
            
            this.classList.toggle('completed');
            localStorage.setItem(levelName, this.classList.contains('completed') ? 'completed' : '');
            checkUnlocking();
        });
    });

    const modal = document.getElementById('infoModal');
    const form = document.getElementById('moduleForm');
    const modalTitle = document.getElementById('modalTitle');
    const saveBtn = document.getElementById('saveBtn');
    let currentModuleId = '';

    function openModal(id, title) {
        initializeDatePickers();
        currentModuleId = id;
        modalTitle.textContent = title;
        const data = JSON.parse(localStorage.getItem(`modinfo-${id}`)) || {};
        
        form.docente.value = data.docente || '';
        form.grupo.value = data.grupo || '';
        
        if (data.inicio) {
            const inicioInput = form.querySelector('input[name="inicio"]');
            inicioInput.value = formatDateForDisplay(data.inicio);
            inicioInput.dataset.dateValue = data.inicio;
        }
        
        if (data.fin) {
            const finInput = form.querySelector('input[name="fin"]');
            finInput.value = formatDateForDisplay(data.fin);
            finInput.dataset.dateValue = data.fin;
        }
        
        form.nota.value = data.nota || '';
        form.estado.value = data.estado || 'Aprobado';
        modal.style.display = 'block';
    }

    function formatDateForDisplay(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('es-ES', options).replace('.', '');
    }

    function saveFormData() {
        const notaValue = parseFloat(form.nota.value);
        if (!isNaN(notaValue)) {
            if (notaValue > 100) {
                alert('🧊 成绩不能高于一百分');
                return;
            }
            if (notaValue < 0) {
                alert('🧊 成绩不能低于零分');
                return;
            }
        }

        const inicioValue = form.querySelector('input[name="inicio"]').dataset.dateValue || '';
        const finValue = form.querySelector('input[name="fin"]').dataset.dateValue || '';
        
        if (finValue && !inicioValue) {
            alert('🧊 如果选择了结束日期，必须选择开始日期');
            return;
        }
        
        const data = {
            docente: form.docente.value,
            grupo: form.grupo.value,
            inicio: inicioValue,
            fin: finValue,
            nota: form.nota.value,
            estado: form.estado.value
        };
        
        localStorage.setItem(`modinfo-${currentModuleId}`, JSON.stringify(data));
        alert('🧊 保存成功');
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
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    function initializeDatePickers() {
        const datePickers = document.querySelectorAll('.date-picker');
        
        datePickers.forEach(picker => {
            const dateInput = picker.querySelector('.date-input');
            const calendarDropdown = picker.querySelector('.calendar-dropdown');
            
            let currentDate = new Date();
            let selectedDate = null;
            
            dateInput.addEventListener('click', function(e) {
                e.stopPropagation();
                showCalendarDropdown();
            });

            function showCalendarDropdown() {
                const rect = dateInput.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                
                calendarDropdown.innerHTML = generateCalendarHTML(currentDate);
                calendarDropdown.classList.add('active');
                
                if (spaceBelow < 300 && rect.top > 300) {
                    calendarDropdown.style.top = 'auto';
                    calendarDropdown.style.bottom = '100%';
                    calendarDropdown.style.marginBottom = '5px';
                } else {
                    calendarDropdown.style.top = '100%';
                    calendarDropdown.style.bottom = 'auto';
                    calendarDropdown.style.marginBottom = '0';
                }
                
                const days = calendarDropdown.querySelectorAll('.calendar-day:not(.other-month)');
                days.forEach(day => {
                    day.addEventListener('click', (e) => {
                        e.stopPropagation();
                        selectDate(day);
                    });
                });
                
                const clearBtn = calendarDropdown.querySelector('.clear-date-btn');
                clearBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    clearDate();
                });
                
                const prevMonth = calendarDropdown.querySelector('.prev-month');
                const nextMonth = calendarDropdown.querySelector('.next-month');
                
                prevMonth.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentDate.setMonth(currentDate.getMonth() - 1);
                    showCalendarDropdown();
                });
                
                nextMonth.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentDate.setMonth(currentDate.getMonth() + 1);
                    showCalendarDropdown();
                });
            }
            
            function selectDate(dayElement) {
                const day = parseInt(dayElement.textContent);
                selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                dateInput.value = formatDate(selectedDate);
                dateInput.dataset.dateValue = formatDateForStorage(selectedDate);
                calendarDropdown.classList.remove('active');
            }
            
            function clearDate() {
                dateInput.value = '';
                dateInput.removeAttribute('data-date-value');
                selectedDate = null;
                calendarDropdown.classList.remove('active');
            }
            
            function formatDate(date) {
                if (!date) return '';
                const weekday = date.toLocaleDateString('es', { weekday: 'short' }).replace('.', '');
                const day = date.getDate();
                const month = date.toLocaleDateString('es', { month: 'short' }).replace('.', '');
                const year = date.getFullYear();
                return `${weekday}., ${day} de ${month}. de ${year}`;
            }
            
            function formatDateForStorage(date) {
                if (!date) return '';
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
            
            function generateCalendarHTML(date) {
                const year = date.getFullYear();
                const month = date.getMonth();
                const monthName = date.toLocaleString('es', { month: 'long' });
                
                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                const prevMonthLastDay = new Date(year, month, 0).getDate();
                
                let html = `
                    <div class="calendar-header">
                        <button class="calendar-nav prev-month">←</button>
                        <div class="calendar-title">${monthName} ${year}</div>
                        <button class="calendar-nav next-month">→</button>
                    </div>
                    <div class="calendar-grid">
                        <div class="calendar-day-header">L</div>
                        <div class="calendar-day-header">M</div>
                        <div class="calendar-day-header">M</div>
                        <div class="calendar-day-header">J</div>
                        <div class="calendar-day-header">V</div>
                        <div class="calendar-day-header">S</div>
                        <div class="calendar-day-header">D</div>
                `;
                
                const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
                for (let i = firstDayOfWeek; i > 0; i--) {
                    html += `<div class="calendar-day other-month">${prevMonthLastDay - i + 1}</div>`;
                }
                
                for (let i = 1; i <= lastDay.getDate(); i++) {
                    const current = new Date(year, month, i);
                    const isSelected = selectedDate && 
                                    current.getDate() === selectedDate.getDate() && 
                                    current.getMonth() === selectedDate.getMonth() && 
                                    current.getFullYear() === selectedDate.getFullYear();
                    
                    html += `<div class="calendar-day ${isSelected ? 'selected' : ''}">${i}</div>`;
                }

                const lastDayOfWeek = lastDay.getDay() === 0 ? 0 : 7 - lastDay.getDay();
                for (let i = 1; i <= lastDayOfWeek; i++) {
                    html += `<div class="calendar-day other-month">${i}</div>`;
                }
                
                html += `</div>
                    <div class="calendar-actions">
                        <button type="button" class="clear-date-btn">Borrar fecha</button>
                    </div>`;
                
                return html;
            }
        });
        
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.date-picker')) {
                document.querySelectorAll('.calendar-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }

    checkUnlocking();
});
