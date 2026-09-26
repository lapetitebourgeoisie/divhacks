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

// Temporary frontend samples. Replace only after agreeing on Person A's schema.
const sampleMeetings = [
  // These three IDs are reserved for the next increment's full demo details.
  {
    id: 'demo-housing-streets',
    title: 'Housing and street improvements',
    start: '2026-10-06T18:30:00-04:00',
    board: 'Community Board [TBD]',
    preview: 'Discuss a sample affordable-housing proposal and safer crossings near a neighborhood school.',
    agendaCategories: ['Housing', 'Housing', 'Transportation'],
  },
  {
    id: 'demo-bus-business',
    title: 'Bus access and local business applications',
    start: '2026-10-13T19:00:00-04:00',
    board: 'Community Board [TBD]',
    preview: 'Review sample bus-stop accessibility improvements and a restaurant license application.',
    agendaCategories: ['Transportation', 'Licensing'],
  },
  {
    id: 'demo-licensing-review',
    title: 'Neighborhood licensing review',
    start: '2026-10-22T18:00:00-04:00',
    board: 'Community Board [TBD]',
    preview: 'Consider two fictional license applications from neighborhood businesses.',
    agendaCategories: ['Licensing', 'Licensing'],
  },
];

// Lightweight list-only samples: one category entry represents one agenda item.
const sampleTopics = [
  ['Housing repair priorities', 'Discuss fictional building repair and tenant-support proposals.', ['Housing', 'Housing']],
  ['Safer neighborhood journeys', 'Review sample crossing improvements and bus-stop access.', ['Transportation', 'Transportation']],
  ['Local license applications', 'Consider fictional restaurant and sidewalk-cafe applications.', ['Licensing', 'Licensing']],
  ['Housing and local business review', 'Review sample housing improvements and a business license application.', ['Housing', 'Licensing']],
  ['Street access and licensing', 'Discuss fictional curb access changes and local license applications.', ['Transportation', 'Licensing', 'Licensing']],
  ['Neighborhood planning discussion', 'Review sample housing, street safety, and business license proposals.', ['Housing', 'Transportation', 'Licensing']],
];

for (let index = 0; index < 24; index += 1) {
  // Weekly Thursdays, November 2026 through April 2027, at 6:30 or 7 PM NYC time.
  const date = new Date(Date.UTC(2026, 10, 5 + index * 7));
  const dateString = date.toISOString().slice(0, 10);
  const time = index % 2 === 0 ? '18:30:00' : '19:00:00';
  const offset = dateString >= '2026-11-01' && dateString < '2027-03-14' ? '-05:00' : '-04:00';
  const [title, preview, categories] = sampleTopics[index % sampleTopics.length];
  sampleMeetings.push({
    id: `demo-list-${String(index + 4).padStart(2, '0')}`,
    start: `${dateString}T${time}${offset}`,
    board: 'Community Board [TBD]',
    title,
    preview,
    agendaCategories: [...categories],
  });
}

const meetingsPerPage = 3;
let currentPage = 1;

const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/New_York',
});
const timeFormat = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York',
});

function renderUpcomingMeetings() {
  const selectedInterests = Array.from(
    interestsDropdown.querySelectorAll('input:checked'), (input) => input.value,
  );
  const list = document.querySelector('#upcoming-list');
  list.replaceChildren();

  // Chronological order stays the same regardless of interest matches.
  const sortedMeetings = [...sampleMeetings].sort((a, b) => new Date(a.start) - new Date(b.start));
  const firstIndex = (currentPage - 1) * meetingsPerPage;
  list.start = firstIndex + 1;
  sortedMeetings.slice(firstIndex, firstIndex + meetingsPerPage).forEach((meeting) => {
    const categories = [...new Set(meeting.agendaCategories)];
    const matches = categories.filter((category) => selectedInterests.includes(category));
    const matchCount = meeting.agendaCategories.filter((category) => selectedInterests.includes(category)).length;
    const row = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'upcoming-row';
    button.dataset.meetingId = meeting.id;

    const date = document.createElement('time');
    date.className = 'upcoming-date';
    date.dateTime = meeting.start;
    const day = document.createElement('span');
    day.textContent = dateFormat.format(new Date(meeting.start));
    const time = document.createElement('span');
    time.textContent = timeFormat.format(new Date(meeting.start));
    date.append(day, time);

    const content = document.createElement('span');
    content.className = 'upcoming-content';
    // Use textContent so this rendering does not interpret data as HTML.
    const fields = [
      ['upcoming-board', meeting.board],
      ['upcoming-title', meeting.title],
      ['upcoming-preview', meeting.preview],
      ['upcoming-categories', `Topics: ${categories.join(' · ')}`],
      ['upcoming-count', `${matchCount} agenda ${matchCount === 1 ? 'item matches' : 'items match'} your interests`],
    ];
    fields.forEach(([className, value]) => {
      const text = document.createElement('span');
      text.className = className;
      text.textContent = value;
      content.append(text);
    });
    if (matchCount > 0) {
      const indicator = document.createElement('span');
      indicator.className = 'interest-match';
      indicator.textContent = `Matches your interests — ${matches.join(' · ')}`;
      content.append(indicator);
    }
    button.append(date, content);
    row.append(button);
    list.append(row);
  });
}

function renderPagination() {
  const pagination = document.querySelector('#meeting-pagination');
  const pageCount = Math.ceil(sampleMeetings.length / meetingsPerPage);
  pagination.replaceChildren();

  function addButton(label, page, accessibleLabel, disabled = false) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'page-control';
    button.textContent = label;
    button.setAttribute('aria-label', accessibleLabel);
    button.disabled = disabled;
    if (label === String(currentPage)) button.setAttribute('aria-current', 'page');
    button.addEventListener('click', () => {
      currentPage = page;
      renderUpcomingMeetings();
      renderPagination();
      // Keep keyboard focus on a usable control after replacing the buttons.
      pagination.querySelector('[aria-current="page"]').focus({ preventScroll: true });
      document.querySelector('#page-status').textContent = `Page ${currentPage} of ${pageCount}`;
    });
    pagination.append(button);
  }

  addButton('‹', currentPage - 1, 'Previous page', currentPage === 1);
  // Always show the ends and a three-page window around the current page.
  const windowStart = Math.max(1, Math.min(currentPage - 1, pageCount - 2));
  const visiblePages = new Set([1, pageCount, windowStart, windowStart + 1, windowStart + 2]);
  let previousPage = 0;
  [...visiblePages].sort((a, b) => a - b).forEach((page) => {
    if (page - previousPage > 1) {
      const ellipsis = document.createElement('span');
      ellipsis.textContent = '…';
      ellipsis.setAttribute('aria-hidden', 'true');
      pagination.append(ellipsis);
    }
    addButton(String(page), page, `Page ${page}`);
    previousPage = page;
  });
  addButton('›', currentPage + 1, 'Next page', currentPage === pageCount);
}

// Two screens in one document; the navbar and footer stay in place.
function showScreen(screen) {
  const home = document.querySelector('#home-screen');
  const upcoming = document.querySelector('#upcoming-screen');
  const showUpcoming = screen === 'upcoming';
  home.hidden = showUpcoming;
  upcoming.hidden = !showUpcoming;
  interestsDropdown.open = false;
  const heading = (showUpcoming ? upcoming : home).querySelector('h1');
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

document.querySelector('.meeting-card--upcoming button').addEventListener('click', () => {
  showScreen('upcoming');
});
document.querySelector('.app-name').addEventListener('click', (event) => {
  event.preventDefault();
  showScreen('home');
});
interestsDropdown.addEventListener('change', renderUpcomingMeetings);
renderUpcomingMeetings();
renderPagination();
