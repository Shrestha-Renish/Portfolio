// Typing effect
var typed = new Typed(".typing", {
  strings: [
    "Digital Marketer",
    "Social Media Management",
    "LinkedIn Growth Expert",
  ],
  typeSpeed: 80,
  backSpeed: 40,
  loop: true,
});

// Scroll reveal
const faders = document.querySelectorAll(".fade-in");
window.addEventListener("scroll", () => {
  faders.forEach((fader) => {
    const position = fader.getBoundingClientRect();
    if (position.top < window.innerHeight - 100) {
      fader.classList.add("show");
    }
  });
});
