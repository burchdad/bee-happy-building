const body = document.body;
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

const processCopy = [
  "We listen first: property goals, lifestyle, timeline, budget, land, utilities, and must-have spaces.",
  "A site visit clarifies access, drainage, utilities, approach, views, and the small property realities that shape a better build.",
  "Planning turns ideas into a practical direction for layout, scope, materials, budget priorities, and schedule expectations.",
  "Engineering and permitting align drawings, structure, code needs, documentation, and pre-construction decisions.",
  "Construction is guided by craft, sequencing, updates, and respect for the property Bee Happy is trusted to improve.",
  "The walkthrough and warranty handoff make the finished building feel complete, documented, and ready for the next chapter."
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

const estimator = document.querySelector("[data-estimator]");

if (estimator) {
  const output = estimator.querySelector("[data-estimate]");
  const fields = [...estimator.querySelectorAll("input, select")];

  function formatEstimate(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value);
  }

  function updateEstimate() {
    const values = Object.fromEntries(new FormData(estimator).entries());
    const typeRate = Number(values.type);
    const size = Math.max(Number(values.size) || 0, 400);
    const finish = Number(values.finish);
    const site = Number(values.site);
    const comfort = Number(values.comfort);
    const midpoint = size * typeRate * finish * site + comfort;
    const low = Math.round(midpoint * 0.9 / 1000) * 1000;
    const high = Math.round(midpoint * 1.18 / 1000) * 1000;
    output.textContent = `${formatEstimate(low)} - ${formatEstimate(high)}`;
  }

  fields.forEach(field => field.addEventListener("input", updateEstimate));
  updateEstimate();
}

function setActive(activeItem, selector) {
  document.querySelectorAll(selector).forEach(item => item.classList.toggle("active", item === activeItem));
}
