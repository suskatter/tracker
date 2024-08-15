let habits = [];

// Load habits from local storage on page load
document.addEventListener('DOMContentLoaded', loadHabits);

function loadHabits() {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
        habits = JSON.parse(savedHabits);
        updateHabitList();
        updateStats();
    }
}

function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

function addHabit() {
    const habitInput = document.getElementById('habitInput');
    const habitText = habitInput.value.trim();

    if (habitText === '') {
        alert('Please enter a habit');
        return;
    }

    // Check if habit already exists
    if (habits.some(habit => habit.text === habitText)) {
        alert('Habit already exists');
        habitInput.value = '';
        return;
    }

    const habit = {
        text: habitText,
        streak: 0,
        lastCompleted: null
    };

    habits.push(habit);
    habitInput.value = '';
    updateHabitList();
    updateStats();
    saveHabits();
}

function completeHabit(index) {
    const now = new Date();
    const lastCompletedDate = new Date(habits[index].lastCompleted);
    const daysSinceLastCompletion = Math.floor((now - lastCompletedDate) / (1000 * 60 * 60 * 24));

    if (habits[index].lastCompleted && daysSinceLastCompletion > 1) {
        habits[index].streak = 0; // Reset streak if more than one day has passed
    } else {
        habits[index].streak++;
    }

    habits[index].lastCompleted = now.toISOString().split('T')[0]; // Store date in YYYY-MM-DD format
    updateHabitList();
    updateStats();
    saveHabits();
}

function deleteHabit(index) {
    habits.splice(index, 1);
    updateHabitList();
    updateStats();
    saveHabits();
}

function updateHabitList() {
    const habitList = document.getElementById('habitList');
    habitList.innerHTML = '';

    habits.forEach((habit, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${habit.text}</span>
            <button class="complete-btn" onclick="completeHabit(${index})">Complete</button>
            <button class="delete-btn" onclick="deleteHabit(${index})">Delete</button>
            <span>Streak: ${habit.streak}</span>
        `;
        habitList.appendChild(listItem);
    });
}

function updateStats() {
    const totalHabits = document.getElementById('totalHabits');
    const totalStreaks = document.getElementById('totalStreaks');

    totalHabits.textContent = habits.length;
    totalStreaks.textContent = habits.reduce((sum, habit) => sum + habit.streak, 0);
}
