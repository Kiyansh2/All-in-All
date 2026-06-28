const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("open", !isOpen);
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("open");
    });
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const element = entry.target;
    if (element.dataset.done === "true") return;

    const target = Number(element.dataset.count);
    if (!Number.isFinite(target)) return;

    element.dataset.done = "true";
    const duration = 950;
    const start = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = target;
      }
    };

    requestAnimationFrame(animate);
    countObserver.unobserve(element);
  });
}, { threshold: 0.45 });

document.querySelectorAll("[data-count]").forEach(element => countObserver.observe(element));

const demoTabs = document.querySelectorAll(".demo-tab");
const demoPanels = document.querySelectorAll(".demo-panel");

function showDemo(key) {
  demoTabs.forEach(tab => tab.classList.toggle("active", tab.dataset.demo === key));
  demoPanels.forEach(panel => panel.classList.toggle("active", panel.dataset.panel === key));
}

demoTabs.forEach(tab => {
  tab.addEventListener("click", () => showDemo(tab.dataset.demo));
});

document.querySelectorAll(".product-card").forEach(card => {
  card.addEventListener("mousemove", event => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("background", `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,.16), rgba(255,255,255,.045) 42%, rgba(13,19,36,.72))`);
  });

  card.addEventListener("mouseleave", () => {
    card.style.removeProperty("background");
  });
});
