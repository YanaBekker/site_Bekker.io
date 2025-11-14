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

document.addEventListener("DOMContentLoaded", function () {
  Promise.all([
    loadComponent("header-container", "components/header.html"),
    loadComponent("footer-container", "components/footer.html"),
  ]).then(() => {
    initNavigation();
    initSmoothScroll();
  });
});

function initNavigation() {
  window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (navbar && window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else if (navbar) {
      navbar.classList.remove("scrolled");
    }
  });

  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      this.classList.toggle("active");
    });
  }
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || targetId.includes(".html")) return;

      e.preventDefault();

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 70;

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });

        history.pushState(null, null, targetId);
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
