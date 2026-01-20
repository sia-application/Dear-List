// ===================================
// Dear List - Couple Anniversary App
// JavaScript Logic
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Password Protection
    const PASSWORD = '1536'; // パスワードを設定
    const passwordScreen = document.getElementById('passwordScreen');
    const mainContainer = document.getElementById('mainContainer');
    const passwordInput = document.getElementById('passwordInput');
    const passwordSubmitBtn = document.getElementById('passwordSubmitBtn');
    const passwordError = document.getElementById('passwordError');
    const passwordContainer = document.querySelector('.password-container');

    // Check if already authenticated in this session
    if (sessionStorage.getItem('dearlist_authenticated') === 'true') {
        passwordScreen.style.display = 'none';
        mainContainer.style.display = 'block';
    }

    function verifyPassword() {
        const enteredPassword = passwordInput.value;
        if (enteredPassword === PASSWORD) {
            // Success - show main content
            sessionStorage.setItem('dearlist_authenticated', 'true');
            passwordScreen.style.opacity = '1';
            passwordScreen.style.transition = 'opacity 0.5s ease';
            passwordScreen.style.opacity = '0';
            setTimeout(() => {
                passwordScreen.style.display = 'none';
                mainContainer.style.display = 'block';
                mainContainer.style.opacity = '0';
                mainContainer.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    mainContainer.style.opacity = '1';
                }, 50);
            }, 500);
        } else {
            // Wrong password
            passwordError.textContent = 'パスワードが違います 💔';
            passwordContainer.classList.add('shake');
            passwordInput.value = '';
            setTimeout(() => {
                passwordContainer.classList.remove('shake');
            }, 500);
        }
    }

    passwordSubmitBtn.addEventListener('click', verifyPassword);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            verifyPassword();
        }
    });

    const calculateBtn = document.getElementById('calculateBtn');
    const resultSection = document.getElementById('resultSection');

    // Set default date to today
    const today = new Date();
    const todayStr = formatDateInput(today);

    calculateBtn.addEventListener('click', calculateMilestones);

    // Also allow Enter key to trigger calculation
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calculateMilestones();
            }
        });
    });

    // Tab switching functionality
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;

            // Remove active class from all buttons and panels
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

            // Add active class to clicked button and corresponding panel
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Hide passed toggle functionality
    const hidePassedBtn = document.getElementById('hidePassedBtn');
    let hidePassed = true; // Start with passed rows hidden
    hidePassedBtn.textContent = '経過を表示';
    hidePassedBtn.classList.add('active');

    hidePassedBtn.addEventListener('click', () => {
        hidePassed = !hidePassed;
        document.querySelectorAll('.row-passed').forEach(row => {
            row.style.display = hidePassed ? 'none' : '';
        });
        hidePassedBtn.textContent = hidePassed ? '経過を表示' : '経過を非表示';
        hidePassedBtn.classList.toggle('active', hidePassed);
    });

    // Sub-tab switching for birthday tabs
    document.querySelectorAll('.sub-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const subtabId = btn.dataset.subtab;
            const parent = btn.closest('.tab-panel');

            // Remove active class from all sub-buttons and panels within this parent
            parent.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
            parent.querySelectorAll('.sub-tab-panel').forEach(p => p.classList.remove('active'));

            // Add active class to clicked button and corresponding panel
            btn.classList.add('active');
            parent.querySelector(`#${subtabId}`).classList.add('active');
        });
    });

    // Load more button for 100-day milestones
    document.getElementById('loadMore100').addEventListener('click', loadMore100DayMilestones);

    // Load more button for 111 (repdigit) milestones
    document.getElementById('loadMore111').addEventListener('click', loadMore111Milestones);

    // Load more button for half-year milestones
    document.getElementById('loadMoreHalfYear').addEventListener('click', loadMoreHalfYearMilestones);

    // Load more buttons for birthday tables
    document.getElementById('loadMoreBirthday1').addEventListener('click', () => loadMoreBirthday('person1'));
    document.getElementById('loadMoreBirthday2').addEventListener('click', () => loadMoreBirthday('person2'));
});

function formatDateInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateDisplay(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
}

function getDayOfWeek(date) {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return days[date.getDay()] + '曜日';
}

function getDaysDifference(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((date2 - date1) / oneDay);
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}

function getStatusBadge(targetDate, today) {
    const diff = getDaysDifference(today, targetDate);

    if (diff < 0) {
        const passedDays = Math.abs(diff);
        return `<span class="status-badge status-passed">${passedDays}日経過</span>`;
    } else if (diff === 0) {
        return `<span class="status-badge status-today">記念日</span>`;
    } else if (diff <= 30) {
        return `<span class="status-badge status-soon">あと${diff}日</span>`;
    } else {
        return `<span class="status-badge status-upcoming">あと${diff}日</span>`;
    }
}

function calculateMilestones() {
    // Get input values
    const startDateInput = document.getElementById('startDate').value;
    const name1 = document.getElementById('name1').value.trim();
    const birthday1Input = document.getElementById('birthday1').value;
    const name2 = document.getElementById('name2').value.trim();
    const birthday2Input = document.getElementById('birthday2').value;

    // Validation
    if (!startDateInput) {
        alert('記念日を入力してください 💕');
        return;
    }
    if (!name1 || !name2) {
        alert('お二人のお名前を入力してください 💕');
        return;
    }
    if (!birthday1Input || !birthday2Input) {
        alert('お二人の誕生日を入力してください 🎂');
        return;
    }

    const startDate = new Date(startDateInput);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const birthday1 = new Date(birthday1Input);
    const birthday2 = new Date(birthday2Input);

    // Get count mode (checked = 0-based, unchecked = 1-based)
    const isZeroBased = document.getElementById('countMode').checked;
    const offset = isZeroBased ? 0 : 1;

    // Calculate total days
    const totalDays = getDaysDifference(startDate, today) + offset;
    document.getElementById('totalDays').textContent = totalDays.toLocaleString();

    // Generate 100-day milestones
    generate100DayMilestones(startDate, today, offset);

    // Generate 111-day (repdigit) milestones
    generate111Milestones(startDate, today, offset);

    // Generate half-year milestones
    generateHalfYearMilestones(startDate, today, offset);

    // Generate birthday table
    generateBirthdayTable(name1, birthday1, name2, birthday2, today, startDate);

    // Show result section with animation
    const resultSection = document.getElementById('resultSection');
    resultSection.style.display = 'block';

    // Apply hide passed state
    const hidePassed = document.getElementById('hidePassedBtn').classList.contains('active');
    document.querySelectorAll('.row-passed').forEach(row => {
        row.style.display = hidePassed ? 'none' : '';
    });

    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Global state for infinite scroll
let milestone100State = {
    currentMaxDays: 3000,
    startDate: null,
    today: null,
    offset: 0
};

function generate100DayMilestones(startDate, today, offset) {
    const tbody = document.querySelector('#table100 tbody');
    tbody.innerHTML = '';

    // Store state for load more
    milestone100State.startDate = startDate;
    milestone100State.today = today;
    milestone100State.offset = offset;
    milestone100State.currentMaxDays = 3000;

    // Generate milestones from 100 to 3000 days
    for (let days = 100; days <= 3000; days += 100) {
        const targetDate = addDays(startDate, days - offset);
        const row = document.createElement('tr');
        const isPassed = targetDate < today;
        if (isPassed) row.classList.add('row-passed');
        row.innerHTML = `
            <td><strong>${days}日目</strong></td>
            <td>${formatDateDisplay(targetDate)}</td>
            <td>${getDayOfWeek(targetDate)}</td>
            <td>${getStatusBadge(targetDate, today)}</td>
        `;
        tbody.appendChild(row);
    }

    // Show load more button
    const loadMoreBtn = document.getElementById('loadMore100');
    loadMoreBtn.style.display = 'block';
}

function loadMore100DayMilestones() {
    const tbody = document.querySelector('#table100 tbody');
    const { startDate, today, offset, currentMaxDays } = milestone100State;
    const hidePassed = document.getElementById('hidePassedBtn').classList.contains('active');

    // Load next 10 milestones (10 * 100 = 1000 days)
    const startDays = currentMaxDays + 100;
    const endDays = currentMaxDays + 1000;

    for (let days = startDays; days <= endDays; days += 100) {
        const targetDate = addDays(startDate, days - offset);
        const row = document.createElement('tr');
        const isPassed = targetDate < today;
        if (isPassed) {
            row.classList.add('row-passed');
            if (hidePassed) {
                row.style.display = 'none';
            }
        }
        row.innerHTML = `
            <td><strong>${days}日目</strong></td>
            <td>${formatDateDisplay(targetDate)}</td>
            <td>${getDayOfWeek(targetDate)}</td>
            <td>${getStatusBadge(targetDate, today)}</td>
        `;
        tbody.appendChild(row);
    }

    milestone100State.currentMaxDays = endDays;
}

// Global state for 111 (repdigit) milestones infinite scroll
let milestone111State = {
    currentIndex: 0,
    allRepdigits: [],
    startDate: null,
    today: null,
    offset: 0
};

// Generate all repdigit numbers (111, 222, ..., 999, 1111, 2222, ..., 9999, 11111, ...)
function generateAllRepdigits() {
    const repdigits = [];
    // Generate for 3 digits to 6 digits (can extend further if needed)
    for (let digits = 3; digits <= 6; digits++) {
        for (let d = 1; d <= 9; d++) {
            repdigits.push(parseInt(String(d).repeat(digits)));
        }
    }
    return repdigits.sort((a, b) => a - b);
}

function generate111Milestones(startDate, today, offset) {
    const tbody = document.querySelector('#table111 tbody');
    tbody.innerHTML = '';

    // Generate all repdigits and store state
    milestone111State.allRepdigits = generateAllRepdigits();
    milestone111State.startDate = startDate;
    milestone111State.today = today;
    milestone111State.offset = offset;
    milestone111State.currentIndex = 0;

    // Get hide passed state
    const hidePassed = document.getElementById('hidePassedBtn').classList.contains('active');

    // Show items until we have 10 visible rows (or run out of items)
    const targetVisibleCount = 10;
    let visibleCount = 0;
    let index = 0;

    while (visibleCount < targetVisibleCount && index < milestone111State.allRepdigits.length) {
        const days = milestone111State.allRepdigits[index];
        const targetDate = addDays(startDate, days - offset);
        const row = document.createElement('tr');
        const isPassed = targetDate < today;

        if (isPassed) {
            row.classList.add('row-passed');
            if (hidePassed) {
                row.style.display = 'none';
            } else {
                visibleCount++;
            }
        } else {
            visibleCount++;
        }

        row.innerHTML = `
            <td><strong>${days}日目</strong></td>
            <td>${formatDateDisplay(targetDate)}</td>
            <td>${getDayOfWeek(targetDate)}</td>
            <td>${getStatusBadge(targetDate, today)}</td>
        `;
        tbody.appendChild(row);
        index++;
    }

    milestone111State.currentIndex = index;

    // Show load more button if there are more items
    const loadMoreBtn = document.getElementById('loadMore111');
    loadMoreBtn.style.display = milestone111State.currentIndex < milestone111State.allRepdigits.length ? 'block' : 'none';
}

function loadMore111Milestones() {
    const tbody = document.querySelector('#table111 tbody');
    const { allRepdigits, startDate, today, offset, currentIndex } = milestone111State;
    const hidePassed = document.getElementById('hidePassedBtn').classList.contains('active');

    // Load items until we have 10 visible rows (or run out of items)
    const targetVisibleCount = 10;
    let visibleCount = 0;
    let index = currentIndex;

    while (visibleCount < targetVisibleCount && index < allRepdigits.length) {
        const days = allRepdigits[index];
        const targetDate = addDays(startDate, days - offset);
        const row = document.createElement('tr');
        const isPassed = targetDate < today;

        if (isPassed) {
            row.classList.add('row-passed');
            if (hidePassed) {
                row.style.display = 'none';
            } else {
                visibleCount++;
            }
        } else {
            visibleCount++;
        }

        row.innerHTML = `
            <td><strong>${days}日目</strong></td>
            <td>${formatDateDisplay(targetDate)}</td>
            <td>${getDayOfWeek(targetDate)}</td>
            <td>${getStatusBadge(targetDate, today)}</td>
        `;
        tbody.appendChild(row);
        index++;
    }

    milestone111State.currentIndex = index;

    // Hide button if no more items
    const loadMoreBtn = document.getElementById('loadMore111');
    loadMoreBtn.style.display = milestone111State.currentIndex < allRepdigits.length ? 'block' : 'none';
}

// Global state for half-year milestones infinite scroll
let milestoneHalfYearState = {
    currentMonths: 0,
    startDate: null,
    today: null
};

function generateHalfYearMilestones(startDate, today, offset) {
    const tbody = document.querySelector('#tableHalfYear tbody');
    tbody.innerHTML = '';

    // Store state for load more
    milestoneHalfYearState.startDate = startDate;
    milestoneHalfYearState.today = today;
    milestoneHalfYearState.currentMonths = 0;

    // Get hide passed state
    const hidePassed = document.getElementById('hidePassedBtn').classList.contains('active');

    // Show items until we have 10 visible rows
    const targetVisibleCount = 10;
    let visibleCount = 0;
    let months = 6;

    while (visibleCount < targetVisibleCount) {
        const targetDate = addMonths(startDate, months);
        const yearValue = months / 12;
        const label = `${yearValue}周年`;

        const row = document.createElement('tr');
        const isPassed = targetDate < today;

        if (isPassed) {
            row.classList.add('row-passed');
            if (hidePassed) {
                row.style.display = 'none';
            } else {
                visibleCount++;
            }
        } else {
            visibleCount++;
        }

        row.innerHTML = `
            <td><strong>${label}</strong></td>
            <td>${formatDateDisplay(targetDate)}</td>
            <td>${getDayOfWeek(targetDate)}</td>
            <td>${getStatusBadge(targetDate, today)}</td>
        `;
        tbody.appendChild(row);
        months += 6;
    }

    milestoneHalfYearState.currentMonths = months - 6;

    // Show load more button
    const loadMoreBtn = document.getElementById('loadMoreHalfYear');
    loadMoreBtn.style.display = 'block';
}

function loadMoreHalfYearMilestones() {
    const tbody = document.querySelector('#tableHalfYear tbody');
    const { startDate, today, currentMonths } = milestoneHalfYearState;
    const hidePassed = document.getElementById('hidePassedBtn').classList.contains('active');

    // Load items until we have 10 visible rows
    const targetVisibleCount = 10;
    let visibleCount = 0;
    let months = currentMonths + 6;

    while (visibleCount < targetVisibleCount) {
        const targetDate = addMonths(startDate, months);
        const yearValue = months / 12;
        const label = `${yearValue}周年`;

        const row = document.createElement('tr');
        const isPassed = targetDate < today;

        if (isPassed) {
            row.classList.add('row-passed');
            if (hidePassed) {
                row.style.display = 'none';
            } else {
                visibleCount++;
            }
        } else {
            visibleCount++;
        }

        row.innerHTML = `
            <td><strong>${label}</strong></td>
            <td>${formatDateDisplay(targetDate)}</td>
            <td>${getDayOfWeek(targetDate)}</td>
            <td>${getStatusBadge(targetDate, today)}</td>
        `;
        tbody.appendChild(row);
        months += 6;
    }

    milestoneHalfYearState.currentMonths = months - 6;
}

// Global state for birthday milestones infinite scroll
let birthdayState = {
    person1: { currentYear: 0, name: '', birthday: null, startDate: null, today: null },
    person2: { currentYear: 0, name: '', birthday: null, startDate: null, today: null }
};

function generateBirthdayTable(name1, birthday1, name2, birthday2, today, startDate) {
    // Update sub-tab buttons and titles with names
    const subTabBtns = document.querySelectorAll('#tabBirthday .sub-tab-btn');
    subTabBtns[0].textContent = name1;
    subTabBtns[1].textContent = name2;
    document.getElementById('birthday1Title').textContent = `${name1}の誕生日`;
    document.getElementById('birthday2Title').textContent = `${name2}の誕生日`;

    const people = [
        { name: name1, birthday: birthday1, tableId: 'tableBirthday1', isFemale: false, stateKey: 'person1', loadMoreId: 'loadMoreBirthday1' },
        { name: name2, birthday: birthday2, tableId: 'tableBirthday2', isFemale: true, stateKey: 'person2', loadMoreId: 'loadMoreBirthday2' }
    ];

    const hidePassed = document.getElementById('hidePassedBtn').classList.contains('active');
    const startYear = startDate.getFullYear();

    people.forEach(person => {
        const tbody = document.querySelector(`#${person.tableId} tbody`);
        tbody.innerHTML = '';

        // Store state
        birthdayState[person.stateKey] = {
            currentYear: startYear,
            name: person.name,
            birthday: person.birthday,
            startDate: startDate,
            today: today,
            isFemale: person.isFemale,
            tableId: person.tableId
        };

        // Show items until we have 10 visible rows
        const targetVisibleCount = 10;
        let visibleCount = 0;
        let year = startYear;

        while (visibleCount < targetVisibleCount) {
            const birthdayThisYear = new Date(year, person.birthday.getMonth(), person.birthday.getDate());

            // Only include birthdays from start date onwards
            if (birthdayThisYear >= startDate) {
                const age = year - person.birthday.getFullYear();
                const daysUntil = getDaysDifference(today, birthdayThisYear);
                const isPassed = birthdayThisYear < today;

                const row = document.createElement('tr');

                if (isPassed) {
                    row.classList.add('row-passed');
                    if (hidePassed) {
                        row.style.display = 'none';
                    } else {
                        visibleCount++;
                    }
                } else {
                    visibleCount++;
                }

                // For female, show 17歳 by default with click to reveal real age
                let ageCell;
                if (person.isFemale) {
                    ageCell = `<td class="age-cell" data-real-age="${age}" data-showing-real="false"><strong>17歳</strong></td>`;
                } else {
                    ageCell = `<td><strong>${age}歳</strong></td>`;
                }

                row.innerHTML = `
                    ${ageCell}
                    <td>${formatDateDisplay(birthdayThisYear)}</td>
                    <td>${getDayOfWeek(birthdayThisYear)}</td>
                    <td>${getBirthdayBadge(daysUntil, isPassed)}</td>
                `;
                tbody.appendChild(row);
            }
            year++;
        }

        birthdayState[person.stateKey].currentYear = year;

        // Show load more button
        const loadMoreBtn = document.getElementById(person.loadMoreId);
        loadMoreBtn.style.display = 'block';

        // Add header click to toggle all cells at once (for female only)
        if (person.isFemale) {
            const ageHeader = document.getElementById('birthday2AgeHeader');
            // Remove old listener by cloning
            const newHeader = ageHeader.cloneNode(true);
            ageHeader.parentNode.replaceChild(newHeader, ageHeader);

            newHeader.addEventListener('click', () => {
                const cells = tbody.querySelectorAll('.age-cell');
                const anyShowingFake = Array.from(cells).some(cell => cell.dataset.showingReal === 'false');

                cells.forEach(cell => {
                    const realAge = cell.dataset.realAge;
                    if (anyShowingFake) {
                        cell.innerHTML = `<strong>${realAge}歳</strong>`;
                        cell.dataset.showingReal = 'true';
                    } else {
                        cell.innerHTML = `<strong>17歳</strong>`;
                        cell.dataset.showingReal = 'false';
                    }
                });
            });
        }
    });
}

function loadMoreBirthday(personKey) {
    const state = birthdayState[personKey];
    const tbody = document.querySelector(`#${state.tableId} tbody`);
    const hidePassed = document.getElementById('hidePassedBtn').classList.contains('active');

    // Load items until we have 10 visible rows
    const targetVisibleCount = 10;
    let visibleCount = 0;
    let year = state.currentYear;

    while (visibleCount < targetVisibleCount) {
        const birthdayThisYear = new Date(year, state.birthday.getMonth(), state.birthday.getDate());
        const age = year - state.birthday.getFullYear();
        const daysUntil = getDaysDifference(state.today, birthdayThisYear);
        const isPassed = birthdayThisYear < state.today;

        const row = document.createElement('tr');

        if (isPassed) {
            row.classList.add('row-passed');
            if (hidePassed) {
                row.style.display = 'none';
            } else {
                visibleCount++;
            }
        } else {
            visibleCount++;
        }

        // For female, show 17歳 by default
        let ageCell;
        if (state.isFemale) {
            ageCell = `<td class="age-cell" data-real-age="${age}" data-showing-real="false"><strong>17歳</strong></td>`;
        } else {
            ageCell = `<td><strong>${age}歳</strong></td>`;
        }

        row.innerHTML = `
            ${ageCell}
            <td>${formatDateDisplay(birthdayThisYear)}</td>
            <td>${getDayOfWeek(birthdayThisYear)}</td>
            <td>${getBirthdayBadge(daysUntil, isPassed)}</td>
        `;
        tbody.appendChild(row);
        year++;
    }

    state.currentYear = year;
}

function getBirthdayBadge(daysUntil, isPassed) {
    if (isPassed) {
        const passedDays = Math.abs(daysUntil);
        return `<span class="status-badge status-passed">${passedDays}日経過</span>`;
    } else if (daysUntil === 0) {
        return `<span class="status-badge status-today">誕生日</span>`;
    } else if (daysUntil <= 7) {
        return `<span class="status-badge status-soon">あと${daysUntil}日</span>`;
    } else if (daysUntil <= 30) {
        return `<span class="status-badge status-soon">あと${daysUntil}日</span>`;
    } else {
        return `<span class="status-badge status-upcoming">あと${daysUntil}日</span>`;
    }
}
