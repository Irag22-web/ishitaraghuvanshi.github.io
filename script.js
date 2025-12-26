function toggleAbout() {
  const section = document.getElementById("about");
  section.classList.toggle("hidden");
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
