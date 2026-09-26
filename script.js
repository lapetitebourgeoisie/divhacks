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

// Fictional agenda for the first full-demo meeting only. Source order is stable.
const housingMeeting = sampleMeetings.find((meeting) => meeting.id === 'demo-housing-streets');
housingMeeting.agenda = [
  {
    id: 'demo-west-96-housing',
    impact: 'The proposal could add new housing to the neighborhood while affecting affordability, building density, and how the site is used.',
    category: 'Housing',
    location: '184 West 96th Street',
    title: 'Proposed affordable housing development',
    description: 'A developer is proposing a new residential building that would include a portion of income-restricted apartments. The Community Board will hear details about the project and discuss its potential neighborhood impact.',
  },
  {
    id: 'demo-broadway-97-crossing',
    impact: 'The redesign could affect pedestrian safety, traffic flow, parking, deliveries, and how residents move through the intersection.',
    category: 'Transportation',
    location: 'Broadway & West 97th Street',
    title: 'Safer intersection redesign',
    description: 'A street-safety proposal would change the intersection with shorter pedestrian crossings, adjusted curb space, and new loading arrangements.',
  },
  {
    id: 'demo-west-100-license',
    impact: 'Nearby residents may care about evening activity, noise, outdoor seating, and the addition of a new local business.',
    category: 'Licensing',
    location: '221 West 100th Street',
    title: 'New restaurant liquor license',
    description: 'A new restaurant is seeking support for a liquor-license application, including evening operating hours and outdoor seating.',
  },
  {
    id: 'demo-amsterdam-cafe',
    impact: 'The proposal could affect sidewalk space, accessibility, outdoor activity, and nearby residents and businesses.',
    category: 'Licensing',
    location: 'Amsterdam Avenue',
    title: 'Sidewalk café application',
    description: 'A neighborhood café is requesting permission to operate an outdoor dining area using part of the sidewalk.',
  },
];
// Keep list counts consistent with the actual four-item demo agenda.
housingMeeting.agendaCategories = housingMeeting.agenda.map((item) => item.category);

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
    if (meeting.id === housingMeeting.id) {
      button.addEventListener('click', () => {
        renderMeetingDetail();
        showScreen('meeting-detail');
      });
    }

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

// Reuse the same DOM rows when reordering, preserving open panels and draft text.
const agendaRows = new Map();

function calendarUrl() {
  const start = new Date(housingMeeting.start);
  const end = new Date(start.getTime() + 90 * 60 * 1000);
  const calendarDate = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: '[FICTIONAL DEMO] Housing & Neighborhood Improvements',
    dates: `${calendarDate(start)}/${calendarDate(end)}`,
    ctz: 'America/New_York',
    details: `Fictional demo only — not a verified real meeting. ${housingMeeting.board}. ${housingMeeting.preview} Duration assumed to be 90 minutes; meeting location is not specified.`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

function createAgendaRow(item) {
  const row = document.createElement('details');
  row.className = 'agenda-item';
  const summary = document.createElement('summary');
  summary.className = 'agenda-summary';
  const heading = document.createElement('h3');
  heading.textContent = `${item.category}: ${item.location}`;
  const title = document.createElement('p');
  title.className = 'agenda-subtitle';
  title.textContent = item.title;
  const description = document.createElement('p');
  description.className = 'agenda-description';
  description.textContent = item.description;
  summary.append(heading, title, description);

  const expanded = document.createElement('div');
  expanded.className = 'agenda-expanded';
  const impactHeading = document.createElement('h4');
  impactHeading.textContent = 'Why might this matter?';
  const impact = document.createElement('p');
  impact.textContent = item.impact;
  const actions = document.createElement('div');
  actions.className = 'agenda-actions';
  const questionButton = document.createElement('button');
  questionButton.type = 'button';
  questionButton.className = 'agenda-action';
  questionButton.textContent = 'Submit a Question';
  questionButton.setAttribute('aria-expanded', 'false');
  questionButton.setAttribute('aria-controls', `${item.id}-question-form`);
  const calendar = document.createElement('a');
  calendar.className = 'agenda-action';
  calendar.textContent = 'Add to Calendar';
  calendar.href = calendarUrl();
  calendar.target = '_blank';
  calendar.rel = 'noopener noreferrer';
  actions.append(questionButton, calendar);
  const note = document.createElement('p');
  note.className = 'agenda-action-note';
  note.textContent = 'Demo actions only. Calendar opens a fictional 90-minute event in Google Calendar for you to review and save.';

  const form = document.createElement('form');
  form.id = `${item.id}-question-form`;
  form.className = 'agenda-question';
  form.hidden = true;
  const label = document.createElement('label');
  label.htmlFor = `${item.id}-question`;
  label.textContent = 'Your question';
  const textarea = document.createElement('textarea');
  textarea.id = label.htmlFor;
  textarea.rows = 4;
  textarea.required = true;
  const emailNote = document.createElement('p');
  emailNote.id = `${item.id}-email-note`;
  emailNote.className = 'agenda-action-note';
  emailNote.textContent = 'Recipient: board-demo@example.invalid (fictional, non-deliverable). This opens a draft in your email app; it does not send a message to a real Community Board.';
  textarea.setAttribute('aria-describedby', emailNote.id);
  const continueButton = document.createElement('button');
  continueButton.type = 'submit';
  continueButton.className = 'agenda-action';
  continueButton.textContent = 'Continue to email app';
  form.append(label, textarea, emailNote, continueButton);
  questionButton.addEventListener('click', () => {
    form.hidden = !form.hidden;
    questionButton.setAttribute('aria-expanded', String(!form.hidden));
    if (!form.hidden) textarea.focus();
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const question = textarea.value.trim();
    if (!question) {
      textarea.setCustomValidity('Please enter a question.');
      textarea.reportValidity();
      return;
    }
    const subject = `[FICTIONAL DEMO] ${dateFormat.format(new Date(housingMeeting.start))} — ${item.title} — ${item.location}`;
    const body = `Fictional demo only — not for a real Community Board.\n\nMeeting: Housing & Neighborhood Improvements\nDate: ${dateFormat.format(new Date(housingMeeting.start))}, ${timeFormat.format(new Date(housingMeeting.start))} (New York time)\nAgenda item: ${item.title}\nLocation: ${item.location}\n\nMy question:\n${question}`;
    window.location.href = `mailto:board-demo@example.invalid?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
  textarea.addEventListener('input', () => textarea.setCustomValidity(''));
  expanded.append(impactHeading, impact, actions, note, form);
  row.append(summary, expanded);
  return row;
}

function renderMeetingDetail() {
  document.querySelector('#detail-meeting-meta').textContent =
    `${dateFormat.format(new Date(housingMeeting.start))} · ${timeFormat.format(new Date(housingMeeting.start))} (New York time) · ${housingMeeting.board}`;
  document.querySelector('#detail-meeting-preview').textContent = housingMeeting.preview;
  const selected = Array.from(interestsDropdown.querySelectorAll('input:checked'), (input) => input.value);
  const matching = housingMeeting.agenda.filter((item) => selected.includes(item.category));
  const other = housingMeeting.agenda.filter((item) => !selected.includes(item.category));
  const agenda = document.querySelector('#meeting-agenda');
  agenda.replaceChildren();

  function appendItems(items) {
    items.forEach((item) => {
      if (!agendaRows.has(item.id)) agendaRows.set(item.id, createAgendaRow(item));
      agenda.append(agendaRows.get(item.id));
    });
  }

  appendItems(matching);
  if (other.length > 0) {
    const divider = document.createElement('p');
    divider.className = 'agenda-divider';
    divider.textContent = 'Other agenda items';
    agenda.append(divider);
    appendItems(other);
  }
}

// Screens share one document; the navbar, footer, and current page stay in place.
function showScreen(screen) {
  document.querySelectorAll('main').forEach((main) => {
    main.hidden = main.id !== `${screen}-screen`;
  });
  interestsDropdown.open = false;
  const heading = document.querySelector(`#${screen}-screen h1`);
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
document.querySelector('#back-to-upcoming').addEventListener('click', () => showScreen('upcoming'));
interestsDropdown.addEventListener('change', () => {
  renderUpcomingMeetings();
  renderMeetingDetail();
});
renderUpcomingMeetings();
renderPagination();
