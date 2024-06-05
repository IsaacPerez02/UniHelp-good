document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("courseSearch");
    const courseCards = document.querySelectorAll(".course-card");

    // Función para normalizar cadenas y remover acentos
    const normalizeString = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    searchInput.addEventListener("input", () => {
        const filter = normalizeString(searchInput.value);

        courseCards.forEach(card => {
            const courseTitle = normalizeString(card.querySelector("h2").textContent);
            if (courseTitle.includes(filter)) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    });
});
