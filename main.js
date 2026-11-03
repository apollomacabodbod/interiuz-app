/* =========================================
   HAMBURGER MENU LOGIC
   ========================================= */
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  hamburger.classList.toggle("is-active");
  document.body.classList.toggle("no-scroll");
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1032) {
    navMenu.classList.remove("active");
    hamburger.classList.remove("is-active");
    document.body.classList.remove("no-scroll");
  }
});

/* =========================================
   NAVIGATION: CLOSE MOBILE MENU ON LINK CLICK
   ========================================= */
document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    // Only close the overlay menu when the mobile layout is active
    if (window.innerWidth <= 1032) {
      navMenu.classList.remove("active");
      hamburger.classList.remove("is-active");
      document.body.classList.remove("no-scroll");
    }
  });
});

/* =========================================
   CUSTOM HERO SLIDER (Draggable Background)
   ========================================= */
const dragArea = document.getElementById("heroDragArea");
const track = document.getElementById("heroTrack");
const dots = document.querySelectorAll(".dot");

let currentIndex = 0;
const totalSlides = dots.length;
let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;

// Get the current width of the container (changes if you resize the window)
function getContainerWidth() {
  return dragArea.offsetWidth;
}

// Set initial position
function setSliderPosition() {
  track.style.transform = `translateX(${currentTranslate}px)`;
}

// --- MOUSE EVENTS ---
dragArea.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.pageX;
  track.style.transition = "none"; // Disable transition while dragging
});

dragArea.addEventListener("mouseleave", () => {
  if (isDragging) endDrag();
});

dragArea.addEventListener("mouseup", () => {
  if (isDragging) endDrag();
});

dragArea.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const currentX = e.pageX;
  const diff = currentX - startX;
  currentTranslate = prevTranslate + diff;

  // Optional: Add resistance at edges
  const width = getContainerWidth();
  if (currentTranslate > 0) currentTranslate = currentTranslate * 0.3;
  if (currentTranslate < -(width * (totalSlides - 1))) {
    currentTranslate =
      -(width * (totalSlides - 1)) +
      (currentTranslate + width * (totalSlides - 1)) * 0.3;
  }

  setSliderPosition();
});

// --- TOUCH EVENTS (For Mobile/Screen Emulators) ---
dragArea.addEventListener(
  "touchstart",
  (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    track.style.transition = "none";
  },
  { passive: true },
);

dragArea.addEventListener("touchend", () => {
  if (isDragging) endDrag();
});

dragArea.addEventListener(
  "touchmove",
  (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    currentTranslate = prevTranslate + diff;

    setSliderPosition();
  },
  { passive: true },
);

// --- DRAG END LOGIC ---
function endDrag() {
  isDragging = false;
  track.style.transition = "transform 0.4s ease-out";

  const width = getContainerWidth();
  const movedBy = currentTranslate - prevTranslate;

  // Determine if we should snap to the next/prev slide based on drag distance
  if (movedBy < -100 && currentIndex < totalSlides - 1) currentIndex += 1;
  if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;

  // Snap to the calculated slide index
  currentTranslate = -(width * currentIndex);
  prevTranslate = currentTranslate;
  setSliderPosition();

  updateDots();
}

function updateDots() {
  dots.forEach((dot) => dot.classList.remove("active"));
  if (dots[currentIndex]) dots[currentIndex].classList.add("active");
}

// Handle clicking the dots
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentIndex = index;
    const width = getContainerWidth();
    currentTranslate = -(width * currentIndex);
    prevTranslate = currentTranslate;

    track.style.transition = "transform 0.4s ease-out";
    setSliderPosition();
    updateDots();
  });
});

// Recalculate slider position on window resize so it doesn't break
window.addEventListener("resize", () => {
  const width = getContainerWidth();
  currentTranslate = -(width * currentIndex);
  prevTranslate = currentTranslate;
  setSliderPosition();
});

/* =========================================
   DRAG TO SCROLL (For Team and Projects)
   ========================================= */
const sliders = document.querySelectorAll(".team-cards, .projects-slider");

sliders.forEach((slider) => {
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });
});
