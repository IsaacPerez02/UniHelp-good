document.addEventListener('DOMContentLoaded', () => {
    setupNavigationLinks();
    initializeCalendar();
    setupSearchInput();
    setupNewEntryButton();
    setupAddNoteButton();
    setupLogoutButton();
    setupProfileSummaryToggle();
    setupNoteActions();
    setupAlertActions();
});

function setupNavigationLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const target = event.target.getAttribute('href');
            navigateToPage(target); // Nuevo: Función para navegar a la página
        });
    });
}

function navigateToPage(target) {
    window.location.href = target;
}

function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        dateClick: handleDateClick
    });
    calendar.render();
}

function handleDateClick(info) {
    const alertTitle = prompt('Enter alert title:');
    if (alertTitle) {
        const alertContent = prompt('Enter alert content:');
        if (alertContent) {
            addNewAlert(alertTitle, alertContent, info.dateStr);
        }
    }
}

function addNewAlert(title, content, date) {
    const newAlert = document.createElement('div');
    newAlert.classList.add('alert-item');
    newAlert.innerHTML = `
        <h3>${title}</h3>
        <p>${date}</p>
        <p>${content}</p>
        <button class="edit-alert-button">Edit</button>
        <button class="delete-alert-button">Delete</button>
    `;
    document.querySelector('.alerts').appendChild(newAlert);
    setupAlertActions();
}

function editAlert(alertElement) {
    const title = alertElement.querySelector('h3');
    const content = alertElement.querySelectorAll('p')[1];

    const newTitle = prompt('Edit alert title:', title.textContent);
    const newContent = prompt('Edit alert content:', content.textContent);

    if (newTitle && newContent) {
        title.textContent = newTitle;
        content.textContent = newContent;
    }
}

function setupAlertActions() {
    const alertItems = document.querySelectorAll('.alert-item');
    alertItems.forEach(alertItem => {
        const editButton = alertItem.querySelector('.edit-alert-button');
        const deleteButton = alertItem.querySelector('.delete-alert-button');

        editButton.addEventListener('click', () => editAlert(alertItem)); // Modificado para pasar el elemento de alerta
        deleteButton.addEventListener('click', () => deleteAlert(alertItem));
    });
}


function setupSearchInput() {
    const searchInput = document.querySelector('header input');
    searchInput.addEventListener('input', handleSearch);
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    filterItems('.note-item', query);
    filterItems('.subject-item', query);
    filterItems('.alert-item', query);
}

function filterItems(selector, query) {
    const items = document.querySelectorAll(selector);
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'block' : 'none';
    });
}

function setupNewEntryButton() {
    const newEntryButton = document.querySelector('.new-entry');
    newEntryButton.addEventListener('click', addNewNote);
}

function setupAddNoteButton() {
    const addNoteButton = document.querySelector('.add-note-button');
    addNoteButton.addEventListener('click', addNewNote);
}

function addNewNote() {
    const title = prompt('Enter note title:');
    const description = prompt('Enter note description:');
    
    if (title && description) {
        const newNote = document.createElement('div');
        newNote.classList.add('note-item');
        newNote.innerHTML = `
            <h3 contenteditable="true">${title}</h3>
            <p contenteditable="true">${description}</p>
            <button class="save-note-button">Save</button>
            <button class="delete-note-button">Delete</button>
        `;
        document.querySelector('.notes').appendChild(newNote);
        setupNoteActions();
    } else {
        alert('Please enter both title and description for the note.');
    }
}


function saveNote(noteElement) {
    const title = noteElement.querySelector('h3').textContent;
    const content = noteElement.querySelector('p').textContent;
    alert(`Note saved with title: ${title} and content: ${content}`);
}

function deleteNote(noteElement) {
    if (confirm('Are you sure you want to delete this note?')) {
        noteElement.remove();
    }
}

function setupNoteActions() {
    const noteItems = document.querySelectorAll('.note-item');
    noteItems.forEach(noteItem => {
        const saveButton = noteItem.querySelector('.save-note-button');
        const deleteButton = noteItem.querySelector('.delete-note-button');

        saveButton.addEventListener('click', () => saveNote(noteItem));
        deleteButton.addEventListener('click', () => deleteNote(noteItem));
    });
}

function setupAlertActions() {
    const alertItems = document.querySelectorAll('.alert-item');
    alertItems.forEach(alertItem => {
        const editButton = alertItem.querySelector('.edit-alert-button');
        const deleteButton = alertItem.querySelector('.delete-alert-button');

        editButton.addEventListener('click', () => {
            const title = alertItem.querySelector('h3').textContent;
            const date = alertItem.querySelectorAll('p')[0].textContent;
            const content = alertItem.querySelectorAll('p')[1].textContent;
            editAlert(alertItem, title, content, date);
        });
        
        deleteButton.addEventListener('click', () => deleteAlert(alertItem));
    });
}

function setupLogoutButton() {
    const logoutButton = document.querySelector('.logout');
    logoutButton.addEventListener('click', () => {
        alert('Logout button clicked');
    });
}

function setupProfileSummaryToggle() {
    const profileSummaryToggle = document.querySelector('.profile-summary-toggle');
    const profileSummary = document.querySelector('.profile-summary');
    const closeProfileSummary = document.querySelector('.close-profile-summary');

    profileSummaryToggle.addEventListener('click', () => {
        profileSummary.classList.toggle('open');
    });

    closeProfileSummary.addEventListener('click', () => {
        profileSummary.classList.remove('open');
    });
}
