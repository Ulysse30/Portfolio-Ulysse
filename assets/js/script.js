'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn) { // Vérification si le bouton existe
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}


// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  if (modalContainer && overlay) { // Vérification si les éléments existent
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  }
}

// add click event to all modal items
testimonialsItem.forEach(item => {
  item.addEventListener("click", function () {
    // Vérification si les éléments de la modale existent avant d'accéder à leurs propriétés
    if (modalImg && this.querySelector("[data-testimonials-avatar]")) {
      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    }
    if (modalTitle && this.querySelector("[data-testimonials-title]")) {
      modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    }
    if (modalText && this.querySelector("[data-testimonials-text]")) {
      modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
    }
    testimonialsModalFunc();
  });
});

// add click event to modal close button and overlay
if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
if (overlay) overlay.addEventListener("click", testimonialsModalFunc);


// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]"); // Corrigé: data-select-value

// Vérification de l'existence des éléments select
if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items
selectItems.forEach(item => {
  item.addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText; // Vérification
    if (select) elementToggleFunc(select); // Vérification
    filterFunc(selectedValue); // La fonction de filtrage est appelée ici
  });
});

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]"); // Items de projet (li)
const filterBtn = document.querySelectorAll("[data-filter-btn]"); // Boutons de filtre desktop

const filterFunc = function (selectedValue) {
  filterItems.forEach(item => {
    // Simplification: utiliser 'tous' au lieu de 'all' si c'est le texte du bouton
    const category = item.dataset.category ? item.dataset.category.toLowerCase() : '';
    if (selectedValue === "tous" || selectedValue === category) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn.length > 0 ? filterBtn[0] : null; // Vérification initiale

filterBtn.forEach(btn => {
  btn.addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    // Mettre à jour la valeur affichée dans le select (même si caché sur desktop)
    if (selectValue) selectValue.innerText = this.innerText;

    filterFunc(selectedValue);

    if (lastClickedBtn) lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
});


// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
formInputs.forEach(input => {
  input.addEventListener("input", function () {
    // check form validation
    if (form && form.checkValidity()) { // Vérification si form existe
      if (formBtn) formBtn.removeAttribute("disabled"); // Vérification si formBtn existe
    } else {
      if (formBtn) formBtn.setAttribute("disabled", ""); // Vérification si formBtn existe
    }
  });
});


// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]"); // Les sections <article>

// add event to all nav link
navigationLinks.forEach(link => {
  link.addEventListener("click", function () {
    const targetPage = this.innerHTML.toLowerCase();
    let activeLinkFound = false; // Pour gérer le cas où aucun lien n'est actif

    // Cacher toutes les pages et désactiver tous les liens de nav
    pages.forEach(page => page.classList.remove("active"));
    navigationLinks.forEach(navLink => navLink.classList.remove("active"));

    // Activer la page et le lien ciblés
    pages.forEach(page => {
        if (page.dataset.page === targetPage) {
            page.classList.add("active");
            link.classList.add("active"); // Activer le lien cliqué
            window.scrollTo(0, 0);
            activeLinkFound = true;
        }
    });

     // Si on clique sur "Projets", s'assurer que la grille est visible et aucune page projet active
     if (targetPage === 'projets') {
        showProjectsGrid(); // Fonction pour réinitialiser la vue projet
     }

    // Si aucun lien ne correspond (sécurité), activer le premier lien/page par défaut
    if (!activeLinkFound && navigationLinks.length > 0 && pages.length > 0) {
        navigationLinks[0].classList.add("active");
        pages[0].classList.add("active");
    }
  });
});


// ----------- NOUVELLE LOGIQUE POUR LES PAGES PROJETS -----------

const portfolioArticle = document.querySelector('.portfolio[data-page="projets"]');
const projectsGrid = document.querySelector('[data-projects-grid]'); // La section contenant les filtres et la liste
const projectTriggers = document.querySelectorAll('.project-trigger'); // Les liens <a> des miniatures
const projectPages = document.querySelectorAll('[data-project-page]'); // Les divs de page projet
const backToProjectsBtns = document.querySelectorAll('[data-back-btn]'); // Les boutons "Retour"

// Fonction pour afficher une page projet spécifique
const showProjectPage = (projectId) => {
  if (!portfolioArticle || !projectsGrid) return; // Sécurité

  // Cacher la grille
  portfolioArticle.classList.add('show-project'); // Ajoute la classe pour cacher .projects via CSS

  // Cacher toutes les pages projets
  projectPages.forEach(page => page.classList.remove('active'));

  // Trouver et afficher la page projet correspondante
  const targetPage = document.getElementById(`project-${projectId}`);
  if (targetPage) {
    targetPage.classList.add('active');
    window.scrollTo(0, portfolioArticle.offsetTop - 20); // Scroll vers le haut de la section portfolio
  }
};

// Fonction pour afficher la grille des projets
const showProjectsGrid = () => {
  if (!portfolioArticle || !projectsGrid) return; // Sécurité

  // Cacher toutes les pages projets
  projectPages.forEach(page => page.classList.remove('active'));

  // Afficher la grille
  portfolioArticle.classList.remove('show-project'); // Retire la classe qui cache .projects
};

// Ajouter les écouteurs d'événements sur les miniatures
projectTriggers.forEach(trigger => {
  trigger.addEventListener('click', function(event) {
    event.preventDefault(); // Empêche le comportement par défaut du lien (#)
    const projectId = this.closest('[data-project-id]')?.dataset.projectId; // Récupère l'ID depuis le parent li
    if (projectId) {
      showProjectPage(projectId);
    }
  });
});

// Ajouter les écouteurs d'événements sur les boutons "Retour"
backToProjectsBtns.forEach(btn => {
  btn.addEventListener('click', function(event) {
      event.preventDefault();
      showProjectsGrid();
      window.scrollTo(0, portfolioArticle.offsetTop - 20); // Scroll vers le haut de la section portfolio
  });
});

// Assurer que la grille est visible par défaut si on arrive sur l'onglet projet
// (peut être redondant avec la logique de navigation mais assure l'état initial)
if (portfolioArticle && portfolioArticle.classList.contains('active')) {
    showProjectsGrid();
}