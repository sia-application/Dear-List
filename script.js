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
    const totalDays = getDaysDifference(startDate, today) + 1; // +1 to include start day
    document.getElementById('totalDays').textContent = totalDays.toLocaleString();

    // Generate 100-day milestones
    generate100DayMilestones(startDate, today);

    // Generate 111-day (repdigit) milestones
    generate111Milestones(startDate, today);

    // Generate half-year milestones
    generateHalfYearMilestones(startDate, today);

    // Generate birthday table
    generateBirthdayTable(name1, birthday1, name2, birthday2, today);

    // Show result section with animation
    const resultSection = document.getElementById('resultSection');
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function generate100DayMilestones(startDate, today) {
    const tbody = document.querySelector('#table100 tbody');
    tbody.innerHTML = '';

    // Generate milestones from 100 to 3000 days
    const milestones = [];
    for (let days = 100; days <= 3000; days += 100) {
        const targetDate = addDays(startDate, days - 1); // -1 because day 1 is the start date
        milestones.push({ days, date: targetDate });
    }

    // Filter to show past 3 and future 10
    const pastMilestones = milestones.filter(m => m.date < today).slice(-3);
    const futureMilestones = milestones.filter(m => m.date >= today).slice(0, 10);
    const displayMilestones = [...pastMilestones, ...futureMilestones];

    displayMilestones.forEach(milestone => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${milestone.days}日目</strong></td>
            <td>${formatDateDisplay(milestone.date)}</td>
            <td>${getDayOfWeek(milestone.date)}</td>
            <td>${getStatusBadge(milestone.date, today)}</td>
        `;
        tbody.appendChild(row);
    });
}

function generate111Milestones(startDate, today) {
    const tbody = document.querySelector('#table111 tbody');
    tbody.innerHTML = '';

    // Generate repdigit milestones: 111, 222, 333, ..., 999, 1111, 2222, ...
    const repdigits = [
        111, 222, 333, 444, 555, 666, 777, 888, 999,
        1111, 2222, 3333
    ];

    const milestones = repdigits.map(days => ({
        days,
        date: addDays(startDate, days - 1)
    }));

    // Filter to show past 3 and future 8
    const pastMilestones = milestones.filter(m => m.date < today).slice(-3);
    const futureMilestones = milestones.filter(m => m.date >= today).slice(0, 8);
    const displayMilestones = [...pastMilestones, ...futureMilestones];

    displayMilestones.forEach(milestone => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${milestone.days}日目</strong> ✨</td>
            <td>${formatDateDisplay(milestone.date)}</td>
            <td>${getDayOfWeek(milestone.date)}</td>
            <td>${getStatusBadge(milestone.date, today)}</td>
        `;
        tbody.appendChild(row);
    });
}

function generateHalfYearMilestones(startDate, today) {
    const tbody = document.querySelector('#tableHalfYear tbody');
    tbody.innerHTML = '';

    // Generate half-year milestones (6 months, 1 year, 1.5 years, ...)
    const milestones = [];
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

        milestones.push({ months, label, date: targetDate });
    }

    // Filter to show past 3 and future 10
    const pastMilestones = milestones.filter(m => m.date < today).slice(-3);
    const futureMilestones = milestones.filter(m => m.date >= today).slice(0, 10);
    const displayMilestones = [...pastMilestones, ...futureMilestones];

    displayMilestones.forEach(milestone => {
        const row = document.createElement('tr');
        const icon = milestone.months % 12 === 0 ? ' 🎊' : '';
        row.innerHTML = `
            <td><strong>${milestone.label}</strong>${icon}</td>
            <td>${formatDateDisplay(milestone.date)}</td>
            <td>${getDayOfWeek(milestone.date)}</td>
            <td>${getStatusBadge(milestone.date, today)}</td>
        `;
        tbody.appendChild(row);
    });
}

function generateBirthdayTable(name1, birthday1, name2, birthday2, today) {
    const tbody = document.querySelector('#tableBirthday tbody');
    tbody.innerHTML = '';

    const people = [
        { name: name1, birthday: birthday1 },
        { name: name2, birthday: birthday2 }
    ];

    people.forEach(person => {
        // Calculate next birthday
        let nextBirthday = new Date(today.getFullYear(), person.birthday.getMonth(), person.birthday.getDate());

        // If birthday has passed this year, use next year
        if (nextBirthday < today) {
            nextBirthday = new Date(today.getFullYear() + 1, person.birthday.getMonth(), person.birthday.getDate());
        }

        const daysUntil = getDaysDifference(today, nextBirthday);

        // Calculate age on next birthday
        const nextAge = nextBirthday.getFullYear() - person.birthday.getFullYear();

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${person.name}</strong> 💕</td>
            <td>${person.birthday.getMonth() + 1}月${person.birthday.getDate()}日</td>
            <td>${formatDateDisplay(nextBirthday)}<br><small>(${nextAge}歳)</small></td>
            <td>${getBirthdayBadge(daysUntil)}</td>
        `;
        tbody.appendChild(row);
    });
}

function getBirthdayBadge(daysUntil) {
    if (daysUntil === 0) {
        return `<span class="status-badge status-today">🎂 今日!</span>`;
    } else if (daysUntil <= 7) {
        return `<span class="status-badge status-soon">あと${daysUntil}日 🎁</span>`;
    } else if (daysUntil <= 30) {
        return `<span class="status-badge status-soon">あと${daysUntil}日</span>`;
    } else {
        return `<span class="status-badge status-upcoming">あと${daysUntil}日</span>`;
    }
}
