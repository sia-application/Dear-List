// ===================================
// Dear List - Couple Anniversary App
// JavaScript Logic
// ===================================

document.addEventListener('DOMContentLoaded', () => {
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
    let hidePassed = false;

    hidePassedBtn.addEventListener('click', () => {
        hidePassed = !hidePassed;
        document.querySelectorAll('.row-passed').forEach(row => {
            row.style.display = hidePassed ? 'none' : '';
        });
        hidePassedBtn.textContent = hidePassed ? '経過を表示' : '経過を非表示';
        hidePassedBtn.classList.toggle('active', hidePassed);
    });
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
        return `<span class="status-badge status-passed">✓ 経過</span>`;
    } else if (diff === 0) {
        return `<span class="status-badge status-today">🎉 今日!</span>`;
    } else if (diff <= 30) {
        return `<span class="status-badge status-soon">あと${diff}日 💕</span>`;
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

    // Calculate total days
    const totalDays = getDaysDifference(startDate, today); // Day 0 is the start date
    document.getElementById('totalDays').textContent = totalDays.toLocaleString();

    // Generate 100-day milestones
    generate100DayMilestones(startDate, today);

    // Generate 111-day (repdigit) milestones
    generate111Milestones(startDate, today);

    // Generate half-year milestones
    generateHalfYearMilestones(startDate, today);

    // Generate birthday table
    generateBirthdayTable(name1, birthday1, name2, birthday2, today, startDate);

    // Show result section with animation
    const resultSection = document.getElementById('resultSection');
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function generate100DayMilestones(startDate, today) {
    const tbody = document.querySelector('#table100 tbody');
    tbody.innerHTML = '';

    // Generate milestones from 100 to 3000 days
    for (let days = 100; days <= 3000; days += 100) {
        const targetDate = addDays(startDate, days); // Day 0 is the start date
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
}

function generate111Milestones(startDate, today) {
    const tbody = document.querySelector('#table111 tbody');
    tbody.innerHTML = '';

    // Generate repdigit milestones: 111, 222, 333, ..., 999, 1111, 2222, ...
    const repdigits = [
        111, 222, 333, 444, 555, 666, 777, 888, 999,
        1111, 2222, 3333
    ];

    repdigits.forEach(days => {
        const targetDate = addDays(startDate, days);
        const row = document.createElement('tr');
        const isPassed = targetDate < today;
        if (isPassed) row.classList.add('row-passed');
        row.innerHTML = `
            <td><strong>${days}日目</strong> ✨</td>
            <td>${formatDateDisplay(targetDate)}</td>
            <td>${getDayOfWeek(targetDate)}</td>
            <td>${getStatusBadge(targetDate, today)}</td>
        `;
        tbody.appendChild(row);
    });
}

function generateHalfYearMilestones(startDate, today) {
    const tbody = document.querySelector('#tableHalfYear tbody');
    tbody.innerHTML = '';

    // Generate half-year milestones (6 months, 1 year, 1.5 years, ...)
    for (let months = 6; months <= 120; months += 6) { // Up to 10 years
        const targetDate = addMonths(startDate, months);
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        let label = '';
        if (years === 0) {
            label = `${months}ヶ月`;
        } else if (remainingMonths === 0) {
            label = `${years}年`;
        } else {
            label = `${years}年${remainingMonths}ヶ月`;
        }

        const row = document.createElement('tr');
        const isPassed = targetDate < today;
        if (isPassed) row.classList.add('row-passed');
        const icon = months % 12 === 0 ? ' 🎊' : '';
        row.innerHTML = `
            <td><strong>${label}</strong>${icon}</td>
            <td>${formatDateDisplay(targetDate)}</td>
            <td>${getDayOfWeek(targetDate)}</td>
            <td>${getStatusBadge(targetDate, today)}</td>
        `;
        tbody.appendChild(row);
    }
}

function generateBirthdayTable(name1, birthday1, name2, birthday2, today, startDate) {
    const tbody = document.querySelector('#tableBirthday tbody');
    tbody.innerHTML = '';

    const people = [
        { name: name1, birthday: birthday1 },
        { name: name2, birthday: birthday2 }
    ];

    // Generate birthdays from start date year to 10 years in the future
    const startYear = startDate.getFullYear();
    const endYear = today.getFullYear() + 10;

    const allBirthdays = [];

    people.forEach(person => {
        for (let year = startYear; year <= endYear; year++) {
            const birthdayThisYear = new Date(year, person.birthday.getMonth(), person.birthday.getDate());
            // Only include birthdays from start date onwards
            if (birthdayThisYear >= startDate) {
                const age = year - person.birthday.getFullYear();
                allBirthdays.push({
                    name: person.name,
                    date: birthdayThisYear,
                    age: age,
                    originalBirthday: person.birthday
                });
            }
        }
    });

    // Sort by date
    allBirthdays.sort((a, b) => a.date - b.date);

    allBirthdays.forEach(birthday => {
        const daysUntil = getDaysDifference(today, birthday.date);
        const isPassed = birthday.date < today;

        const row = document.createElement('tr');
        if (isPassed) row.classList.add('row-passed');
        row.innerHTML = `
            <td><strong>${birthday.name}</strong></td>
            <td>${birthday.age}歳</td>
            <td>${formatDateDisplay(birthday.date)}</td>
            <td>${getBirthdayBadge(daysUntil, isPassed)}</td>
        `;
        tbody.appendChild(row);
    });
}

function getBirthdayBadge(daysUntil, isPassed) {
    if (isPassed) {
        return `<span class="status-badge status-passed">✓ 経過</span>`;
    } else if (daysUntil === 0) {
        return `<span class="status-badge status-today">🎂 今日!</span>`;
    } else if (daysUntil <= 7) {
        return `<span class="status-badge status-soon">あと${daysUntil}日 🎁</span>`;
    } else if (daysUntil <= 30) {
        return `<span class="status-badge status-soon">あと${daysUntil}日</span>`;
    } else {
        return `<span class="status-badge status-upcoming">あと${daysUntil}日</span>`;
    }
}
