const body = document.body;
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

const processCopy = [
  "We listen first: property goals, lifestyle, timeline, budget, land, utilities, and must-have spaces.",
  "Your ideas turn into a practical building direction with layouts, finishes, access, storage, and future use in mind.",
  "The proposal clarifies scope, expectations, allowances, and the decisions needed before construction begins.",
  "Planning aligns site conditions, scheduling, materials, documents, and communication before crews mobilize.",
  "Construction is guided by craft, sequencing, updates, and a respect for the property Bee Happy is trusted to improve.",
  "The finished building is reviewed with care so the handoff feels complete, confident, and ready for use."
];

if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
  });
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const open = body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", event => {
    if (event.target.matches("a")) {
      body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

document.querySelectorAll(".service-panel").forEach(panel => {
  panel.addEventListener("pointerenter", () => setActive(panel, ".service-panel"));
  panel.addEventListener("focus", () => setActive(panel, ".service-panel"));
});

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    setActive(button, ".filter");
    const filter = button.dataset.filter;
    document.querySelectorAll(".project-tile").forEach(tile => {
      tile.classList.toggle("hidden", filter !== "all" && tile.dataset.category !== filter);
    });
  });
});

document.querySelectorAll(".step").forEach((button, index) => {
  button.addEventListener("click", () => {
    setActive(button, ".step");
    document.querySelector("[data-process-detail]").textContent = processCopy[index];
  });
});

const searches = document.querySelectorAll("[data-faq-search], [data-resource-search]");
searches.forEach(search => {
  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    const target = search.dataset.resourceSearch !== undefined ? ".resource-item" : ".faq-list details";
    document.querySelectorAll(target).forEach(item => {
      item.hidden = query && !item.textContent.toLowerCase().includes(query);
    });
  });
});

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach(item => revealObserver.observe(item));

const planner = document.querySelector("[data-planner]");

if (planner) {
  const steps = [...planner.querySelectorAll(".planner-step")];
  const next = planner.querySelector("[data-next]");
  const prev = planner.querySelector("[data-prev]");
  const progress = planner.querySelector("[data-progress]");
  let activeStep = 0;

  function updatePlanner() {
    steps.forEach((step, index) => step.classList.toggle("active", index === activeStep));
    progress.style.width = `${((activeStep + 1) / steps.length) * 100}%`;
    prev.hidden = activeStep === 0;
    next.textContent = activeStep === steps.length - 1 ? "Request Consultation" : "Next";
  }

  next.addEventListener("click", () => {
    const current = steps[activeStep];
    const fields = [...current.querySelectorAll("input, select")].filter(field => field.required);
    const valid = fields.every(field => field.reportValidity());

    if (!valid) return;

    if (activeStep < steps.length - 1) {
      activeStep += 1;
      updatePlanner();
      return;
    }

    next.textContent = "Planner Saved";
    next.disabled = true;
    planner.dataset.status = "ready-for-crm";
  });

  prev.addEventListener("click", () => {
    activeStep = Math.max(0, activeStep - 1);
    updatePlanner();
  });

  updatePlanner();
}

function setActive(activeItem, selector) {
  document.querySelectorAll(selector).forEach(item => item.classList.toggle("active", item === activeItem));
}
