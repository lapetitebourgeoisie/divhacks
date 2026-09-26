// Checkboxes handle selection directly; nothing is saved after leaving the page.
const interestsDropdown = document.querySelector('.interests');

// Reserve each word's width in both weights so hover never changes line breaks.
// Crossfade the two layers instead of resizing the text. Only one is read aloud.
document.querySelectorAll('.meeting-card button, .meeting-card p').forEach((text) => {
  const parts = text.textContent.split(/(\s+)/);
  text.replaceChildren();

  parts.forEach((part) => {
    if (!part.trim()) {
      text.append(document.createTextNode(part));
      return;
    }

    const word = document.createElement('span');
    word.className = 'weight-word';
    const regular = document.createElement('span');
    regular.className = 'weight-regular';
    regular.textContent = part;
    const bold = document.createElement('span');
    bold.className = 'weight-bold';
    bold.textContent = part;
    bold.setAttribute('aria-hidden', 'true');
    word.append(regular, bold);
    text.append(word);
  });
});

// Close the panel when clicking elsewhere on the page.
document.addEventListener('click', (event) => {
  if (!interestsDropdown.contains(event.target)) {
    interestsDropdown.open = false;
  }
});

// Escape closes the panel and returns keyboard focus to its control.
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && interestsDropdown.open) {
    interestsDropdown.open = false;
    interestsDropdown.querySelector('summary').focus();
  }
});
