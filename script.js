// Функция для загрузки HTML компонентов
function loadComponent(containerId, filePath) {
  return fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка загрузки ${filePath}: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById(containerId).innerHTML = data;
      return true;
    })
    .catch((error) => {
      console.error("Ошибка загрузки компонента:", error);
      document.getElementById(
        containerId
      ).innerHTML = `<p>Ошибка загрузки компонента: ${filePath}</p>`;
      return false;
    });
}

// Инициализация всех компонентов и функционала
document.addEventListener("DOMContentLoaded", function () {
  // Загружаем header и footer
  Promise.all([
    loadComponent("header-container", "components/header.html"),
    loadComponent("footer-container", "components/footer.html"),
  ]).then(() => {
    // Инициализируем функционал после загрузки компонентов
    initNavigation();
    initForms();
    initSmoothScroll();
  });
});

// Инициализация навигации
function initNavigation() {
  // Обработка прокрутки для навигации
  window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (navbar && window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else if (navbar) {
      navbar.classList.remove("scrolled");
    }
  });

  // Мобильное меню
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      // Анимация кнопки меню
      this.classList.toggle("active");
    });
  }
}

// Инициализация плавной прокрутки
function initSmoothScroll() {
  // Плавная прокрутка для якорных ссылок
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      // Проверяем, что это якорная ссылка на текущей странице
      if (targetId === "#" || targetId.includes(".html")) return;

      e.preventDefault();

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 70;

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });

        // Обновляем URL без перезагрузки страницы
        history.pushState(null, null, targetId);

        // Закрываем мобильное меню после клика
        const navLinks = document.querySelector(".nav-links");
        const mobileMenuBtn = document.querySelector(".mobile-menu-btn");

        if (navLinks && navLinks.classList.contains("active")) {
          navLinks.classList.remove("active");
          if (mobileMenuBtn) {
            mobileMenuBtn.classList.remove("active");
          }
        }
      }
    });
  });
}

// Инициализация форм
function initForms() {
  // Обработка формы подписки
  const subscribeForm = document.querySelector(".subscribe-form");
  if (subscribeForm) {
    subscribeForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value;

      // Простая обработка формы
      alert(
        `Спасибо за подписку! На адрес ${email} будут отправляться новости.`
      );
      this.reset();
    });
  }
}

// Добавляем CSS для анимации мобильного меню
const style = document.createElement("style");
style.textContent = `
  .mobile-menu-btn.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  
  .mobile-menu-btn.active span:nth-child(2) {
    opacity: 0;
  }
  
  .mobile-menu-btn.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }
  
  .mobile-menu-btn span {
    transition: 0.3s;
  }
`;
document.head.appendChild(style);
