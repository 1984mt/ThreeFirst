document.addEventListener('DOMContentLoaded', () => {
    // Set current date automatically
    setCurrentDate();
    
    // Load saved data
    loadSavedData();
    
    // Setup checkbox listeners
    document.querySelectorAll('.checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', () => {
            checkbox.classList.toggle('checked');
            saveData();
        });
    });
    
    // Setup task input listeners
    document.querySelectorAll('.task-input').forEach(input => {
        input.addEventListener('change', saveData);
        input.addEventListener('blur', saveData);
    });
    
    // Setup date input listener
    document.getElementById('dateInput').addEventListener('change', saveData);
    
    // Setup reset button
    document.getElementById('resetButton').addEventListener('click', () => {
        // Clear checkboxes
        document.querySelectorAll('.checkbox').forEach(checkbox => {
            checkbox.classList.remove('checked');
        });
        
        // Clear task inputs
        document.querySelectorAll('.task-input').forEach(input => {
            input.value = '';
        });
        
        saveData();
    });
    
    // Setup midnight reset
    checkMidnightReset();
});

function setCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear()).slice(-2);
    const formattedDate = `${day}.${month}.${year}`;
    
    const dateInput = document.getElementById('dateInput');
    dateInput.value = formattedDate;
    dateInput.readOnly = true;  // Make it read-only since it's automatic
}

function saveData() {
    const data = {
        date: document.getElementById('dateInput').value,
        tasks: Array.from(document.querySelectorAll('.task-item')).map(item => ({
            text: item.querySelector('.task-input').value,
            checked: item.querySelector('.checkbox').classList.contains('checked')
        })),
        lastSaved: new Date().toDateString()
    };
    localStorage.setItem('taskData', JSON.stringify(data));
}

function loadSavedData() {
    const savedData = JSON.parse(localStorage.getItem('taskData'));
    if (savedData) {
        document.getElementById('dateInput').value = savedData.date;
        
        const taskItems = document.querySelectorAll('.task-item');
        savedData.tasks.forEach((task, index) => {
            if (taskItems[index]) {
                taskItems[index].querySelector('.task-input').value = task.text;
                if (task.checked) {
                    taskItems[index].querySelector('.checkbox').classList.add('checked');
                }
            }
        });
    }
}

function checkMidnightReset() {
    const savedData = JSON.parse(localStorage.getItem('taskData'));
    if (savedData && savedData.lastSaved !== new Date().toDateString()) {
        document.querySelectorAll('.checkbox').forEach(checkbox => {
            checkbox.classList.remove('checked');
        });
        saveData();
    }
}
