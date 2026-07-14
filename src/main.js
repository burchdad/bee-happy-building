const body = document.body;
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  let lastFocusedElement = null;

  navToggle.addEventListener("click", () => {
    lastFocusedElement = document.activeElement;
    const open = body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");

    if (open) {
      nav.querySelector("a")?.focus();
    } else {
      lastFocusedElement?.focus();
    }
  });

  nav.addEventListener("click", event => {
    if (event.target.matches("a")) {
      body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && body.classList.contains("nav-open")) {
      body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
      navToggle.focus();
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

document.querySelectorAll(".reveal, .image-reveal").forEach(item => revealObserver.observe(item));

const scrollProgress = document.querySelector("[data-scroll-progress]");

function updateScrollProgress() {
  if (!scrollProgress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
}

if (scrollProgress) {
  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
}

const parallaxItems = [...document.querySelectorAll("[data-parallax]")];

function updateParallax() {
  if (prefersReducedMotion || !parallaxItems.length) return;
  parallaxItems.forEach(item => {
    const speed = Number(item.dataset.parallax) || 0.12;
    const rect = item.getBoundingClientRect();
    const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
    item.style.transform = `translate3d(0, ${centerOffset * speed * -0.12}px, 0)`;
  });
}

if (parallaxItems.length) {
  updateParallax();
  window.addEventListener("scroll", updateParallax, { passive: true });
}

const storyData = [
  {
    title: "Chapter 01 - The Vision",
    text:
      "A property-first build: a red barndo planned around practical work space, covered areas, and a finished exterior that feels permanent on the land.",
    image: "/assets/projects/red-barndo/red-barndo-hero.webp",
    alt: "Finished red barndominium exterior"
  },
  {
    title: "Chapter 02 - The Structure",
    text:
      "Red iron framing creates strength, clear spans, generous bay openings, and the durable shell needed for long-term use.",
    image: "/assets/projects/red-barndo/red-barndo-frame.webp",
    alt: "Red iron steel frame before roof and wall panels"
  },
  {
    title: "Chapter 03 - The Interior",
    text:
      "Inside, the building supports open shop utility, loft space, insulation planning, and flexible room for the way the property works.",
    image: "/assets/projects/red-barndo/red-barndo-interior-open.webp",
    alt: "Open interior with loft, stairs, and concrete floor"
  },
  {
    title: "Chapter 04 - The Result",
    text:
      "The finished building reads as both practical infrastructure and a permanent part of the property, built to serve what comes next.",
    image: "/assets/projects/red-barndo/red-barndo-sunset.webp",
    alt: "Red barndominium exterior at sunset"
  }
];

const story = document.querySelector("[data-story]");

if (story) {
  const image = story.querySelector("[data-story-image]");
  const title = story.querySelector("[data-story-title]");
  const text = story.querySelector("[data-story-text]");
  const count = story.querySelector("[data-story-count]");
  const progress = story.querySelector("[data-story-progress]");
  const media = story.querySelector(".story-media");
  const tabs = [...story.querySelectorAll("[data-story-tab]")];
  let activeStoryIndex = 0;

  function setStory(index) {
    const safeIndex = Math.max(0, Math.min(index, storyData.length - 1));
    if (safeIndex === activeStoryIndex && image?.getAttribute("src") === storyData[safeIndex].image) return;

    activeStoryIndex = safeIndex;
    const item = storyData[safeIndex];
    media?.classList.add("is-changing");

    window.setTimeout(
      () => {
        if (image) {
          image.src = item.image;
          image.alt = item.alt;
        }
        if (title) title.textContent = item.title;
        if (text) text.textContent = item.text;
        if (count) count.textContent = String(safeIndex + 1).padStart(2, "0");
        if (progress) progress.style.width = `${((safeIndex + 1) / storyData.length) * 100}%`;
        tabs.forEach(tab => tab.classList.toggle("active", Number(tab.dataset.storyTab) === safeIndex));
        media?.classList.remove("is-changing");
      },
      prefersReducedMotion ? 0 : 160
    );
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => setStory(Number(tab.dataset.storyTab)));
  });

  if (!prefersReducedMotion) {
    window.addEventListener(
      "scroll",
      () => {
        const rect = story.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        if (total <= 0) return;
        const progressValue = Math.min(Math.max(-rect.top / total, 0), 1);
        const nextIndex = Math.min(storyData.length - 1, Math.floor(progressValue * storyData.length));
        setStory(nextIndex);
      },
      { passive: true }
    );
  }
}

const gallery = document.querySelector("[data-gallery]");

if (gallery) {
  const strip = gallery.querySelector(".project-filmstrip");
  const prev = gallery.querySelector("[data-gallery-prev]");
  const next = gallery.querySelector("[data-gallery-next]");
  const meter = gallery.querySelector("[data-gallery-meter]");

  function updateGalleryMeter() {
    if (!strip || !meter) return;
    const total = strip.scrollWidth - strip.clientWidth;
    const progress = total > 0 ? strip.scrollLeft / total : 0;
    meter.style.width = `${Math.max(20, progress * 100)}%`;
  }

  function scrollGallery(direction) {
    if (!strip) return;
    strip.scrollBy({ left: direction * Math.max(strip.clientWidth * 0.72, 320), behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  prev?.addEventListener("click", () => scrollGallery(-1));
  next?.addEventListener("click", () => scrollGallery(1));
  strip?.addEventListener("scroll", updateGalleryMeter, { passive: true });
  strip?.addEventListener(
    "wheel",
    event => {
      if (!strip || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const atStart = strip.scrollLeft <= 0;
      const atEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 1;
      const wouldLeave = (event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd);
      if (wouldLeave) return;
      event.preventDefault();
      strip.scrollLeft += event.deltaY;
      updateGalleryMeter();
    },
    { passive: false }
  );
  strip?.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") scrollGallery(1);
    if (event.key === "ArrowLeft") scrollGallery(-1);
  });
  updateGalleryMeter();
}

const journey = document.querySelector("[data-process-journey]");

if (journey) {
  const steps = [...journey.querySelectorAll(".journey-steps li")];

  const journeyObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        steps.forEach(step => step.classList.toggle("active", step === entry.target));
      });
    },
    { rootMargin: "-38% 0px -42% 0px", threshold: 0.01 }
  );

  steps.forEach(step => journeyObserver.observe(step));
}

const tabsRoot = document.querySelector("[data-tabs]");

if (tabsRoot) {
  const tabContent = [
    {
      label: "Coming Soon",
      title: "Client Portal",
      text: "Planned access for project progress, photos, invoices, documents, selections, warranty, messages, and timeline."
    },
    {
      label: "Planned Client Experience",
      title: "Budget Estimator",
      text: "A planning tool concept for early ranges based on building type, size, finish level, concrete, insulation, and site complexity."
    },
    {
      label: "In Development",
      title: "Bee Happy AI",
      text: "A future assistant concept trained only on Bee Happy answers, process, service areas, financing notes, and material guidance."
    }
  ];
  const buttons = [...tabsRoot.querySelectorAll("[data-tab]")];
  const label = tabsRoot.querySelector("[data-tab-label]");
  const title = tabsRoot.querySelector("[data-tab-title]");
  const text = tabsRoot.querySelector("[data-tab-text]");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const item = tabContent[Number(button.dataset.tab)];
      buttons.forEach(option => option.classList.toggle("active", option === button));
      if (label) label.textContent = item.label;
      if (title) title.textContent = item.title;
      if (text) text.textContent = item.text;
    });
  });
}

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
