function setupLogoutButton() {
    const logoutButton = document.querySelector('.logout');
    logoutButton.addEventListener('click', () => {
        window.location.href = "bienvenida.html"
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupLogoutButton();
});