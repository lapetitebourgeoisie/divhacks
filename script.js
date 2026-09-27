// Checkboxes handle selection directly; nothing is saved after leaving the page.
const interestsDropdown = document.querySelector('.interests');

// Reserve each word's width in both weights so hover never changes line breaks.
// Crossfade the two layers instead of resizing the text. Only one is read aloud.
const homeCopy = new Map(Array.from(document.querySelectorAll('.meeting-card button, .meeting-card p'),
  element => [element, element.textContent]));
function renderHomeTypography() {
  homeCopy.forEach((english, text) => {
    const parts = translate(english).split(/(\s+)/);
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
}
renderHomeTypography();

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
    board: 'Manhattan Community Board 8',
    preview: 'Discuss an affordable housing proposal and safer crossings near a neighborhood school.',
    agendaCategories: ['Housing', 'Housing', 'Transportation'],
  },
  {
    id: 'demo-bus-business',
    title: 'Bus access and local business applications',
    start: '2026-10-13T19:00:00-04:00',
    board: 'Manhattan Community Board 8',
    preview: 'Review bus stop accessibility improvements and a restaurant license application.',
    agendaCategories: ['Transportation', 'Licensing'],
  },
  {
    id: 'demo-licensing-review',
    title: 'Neighborhood licensing review',
    start: '2026-10-22T18:00:00-04:00',
    board: 'Manhattan Community Board 8',
    preview: 'Consider two license applications from neighborhood businesses.',
    agendaCategories: ['Licensing', 'Licensing'],
  },
];

// Lightweight list-only samples: one category entry represents one agenda item.
const sampleTopics = [
  ['Housing repair priorities', 'Discuss proposals for building repairs and tenant support.', ['Housing', 'Housing']],
  ['Safer neighborhood journeys', 'Review crossing improvements and bus stop access.', ['Transportation', 'Transportation']],
  ['Local license applications', 'Consider restaurant and sidewalk café applications.', ['Licensing', 'Licensing']],
  ['Housing and local business review', 'Review housing improvements and a business license application.', ['Housing', 'Licensing']],
  ['Street access and licensing', 'Discuss curb access changes and local license applications.', ['Transportation', 'Licensing', 'Licensing']],
  ['Neighborhood planning discussion', 'Review housing, street safety, and business license proposals.', ['Housing', 'Transportation', 'Licensing']],
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
    board: 'Manhattan Community Board 8',
    title,
    preview,
    agendaCategories: [...categories],
  });
}

const meetingsPerPage = 3;
let currentPage = 1;
let pastPage = 1;

// Separate fictional past records; each category entry represents one decision.
const pastMeetings = [
  {
    id: 'demo-past-housing-streets',
    start: '2026-09-22T18:30:00-04:00',
    board: 'Manhattan Community Board 8',
    title: 'Housing repairs and safer crossings',
    preview: 'The board supported a housing repair proposal and recommended changes to pedestrian crossings.',
    decisionCategories: ['Housing', 'Transportation'],
  },
  {
    id: 'demo-past-business-access',
    start: '2026-09-15T19:00:00-04:00',
    board: 'Manhattan Community Board 8',
    title: 'Local businesses and street access',
    preview: 'The board recommended conditions for two license applications and supported a loading zone change.',
    decisionCategories: ['Licensing', 'Licensing', 'Transportation'],
  },
  {
    id: 'demo-past-licensing',
    start: '2026-09-08T18:00:00-04:00',
    board: 'Manhattan Community Board 8',
    title: 'Neighborhood licensing decisions',
    preview: 'The board supported one restaurant application and requested revisions to another.',
    decisionCategories: ['Licensing', 'Licensing'],
  },
];

// Twelve lightweight list-only records; the original three retain their IDs.
const pastSampleTopics = [
  ['Housing improvements', 'The board recommended revisions to housing repair and affordability proposals.', ['Housing', 'Housing']],
  ['Street safety decisions', 'The board supported crossing improvements and requested a review of bus stop access.', ['Transportation', 'Transportation']],
  ['Local licensing review', 'The board recommended conditions for two business license applications.', ['Licensing', 'Licensing']],
  ['Housing and street access', 'The board supported a housing proposal and recommended changes to curb access.', ['Housing', 'Transportation']],
  ['Businesses and neighborhood access', 'The board reviewed licensing applications and recommended changes to delivery access.', ['Licensing', 'Transportation', 'Licensing']],
  ['Neighborhood recommendations', 'The board made recommendations on housing repairs, pedestrian access, and a business license.', ['Housing', 'Transportation', 'Licensing']],
];
for (let index = 0; index < 12; index += 1) {
  const date = new Date(Date.UTC(2026, 8, 1 - index * 7));
  const [title, preview, categories] = pastSampleTopics[index % pastSampleTopics.length];
  pastMeetings.push({
    id: `demo-past-list-${String(index + 4).padStart(2, '0')}`,
    start: `${date.toISOString().slice(0, 10)}T18:30:00-04:00`,
    board: 'Manhattan Community Board 8',
    title,
    preview,
    decisionCategories: [...categories],
  });
}

// Fictional outcomes for the first Past meeting, kept in a stable source order.
const heroPastMeeting = pastMeetings[0];
heroPastMeeting.agenda = [
  {
    id: 'demo-past-west-96-housing',
    category: 'Housing',
    location: '184 West 96th Street',
    title: 'Proposed affordable housing development',
    description: 'The Community Board reviewed a proposal for a new residential building that would include income-restricted apartments.',
    decision: 'The Community Board recommended that the proposal move forward, while requesting changes to the building’s design at street level and additional information about the proposed affordable units.',
    meaning: 'The Board supported the project overall, but raised concerns about parts of the current plan. Its recommendation does not itself authorize construction.',
    next: 'The proposal will continue through the relevant city review process. The agency responsible for the next stage can consider the Community Board’s recommendation when reviewing the project.',
  },
  {
    id: 'demo-past-broadway-crossing',
    category: 'Transportation',
    location: 'Broadway & West 97th Street',
    title: 'Safer intersection redesign',
    description: 'The Community Board considered shorter pedestrian crossings and changes to curb space for deliveries.',
    decision: 'The Community Board recommended further development of the redesign, with a request to review delivery access and pedestrian crossing times.',
    meaning: 'The recommendation expressed support for safer crossings while identifying details that need further review. It did not establish a construction schedule.',
    next: 'The transportation agency can consider the recommendation as it refines the design and evaluates access needs.',
  },
  {
    id: 'demo-past-west-100-license',
    category: 'Licensing',
    location: '221 West 100th Street',
    title: 'New restaurant liquor license',
    description: 'The Community Board reviewed a restaurant’s liquor license application and proposed evening operating hours.',
    decision: 'The Community Board recommended support for the application with requested limits on outdoor activity late in the evening and a plan for addressing noise concerns.',
    meaning: 'The Board’s recommendation described conditions it wanted considered. It did not issue a liquor license.',
    next: 'The licensing authority can review the application and the Board’s recommendation before making its decision.',
  },
  {
    id: 'demo-past-amsterdam-cafe',
    category: 'Licensing',
    location: 'Amsterdam Avenue',
    title: 'Sidewalk café application',
    description: 'The Community Board considered a café’s proposal to use part of the sidewalk for outdoor dining.',
    decision: 'The Community Board requested a revised seating layout showing more clearly how pedestrian access would be maintained.',
    meaning: 'The Board sought additional information about sidewalk use. The discussion did not grant permission to install an outdoor dining area.',
    next: 'The applicant can submit a revised layout for further review by the relevant city agency.',
  },
];
heroPastMeeting.decisionCategories = heroPastMeeting.agenda.map((item) => item.category);

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
    description: 'A proposal to improve street safety would change the intersection with shorter pedestrian crossings, adjusted curb space, and new loading arrangements.',
  },
  {
    id: 'demo-west-100-license',
    impact: 'Nearby residents may care about evening activity, noise, outdoor seating, and the addition of a new local business.',
    category: 'Licensing',
    location: '221 West 100th Street',
    title: 'New restaurant liquor license',
    description: 'A new restaurant is seeking support for a liquor license application, including evening operating hours and outdoor seating.',
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

// Rich demo content is limited to the first three meetings in each list.
sampleMeetings[1].agenda = [
  { id: 'demo-bus-access', category: 'Transportation', location: 'Amsterdam Avenue & West 110th Street', title: 'Bus stop accessibility improvements', description: 'A proposal would redesign the bus stop area to make boarding easier and improve pedestrian access around the intersection.', impact: 'The changes could affect bus riders, pedestrians, curb access, nearby parking, and how easily people with limited mobility can use the stop.' },
  { id: 'demo-columbus-bike', category: 'Transportation', location: 'Columbus Avenue', title: 'Protected bike lane and loading zone changes', description: 'The Community Board will review proposed changes to protection for bike lanes and commercial loading areas along part of Columbus Avenue.', impact: 'The proposal could change cyclist safety, delivery access, curb space, parking, and traffic patterns along the corridor.' },
  { id: 'demo-amsterdam-267', category: 'Licensing', location: '267 Amsterdam Avenue', title: 'New restaurant liquor license', description: 'A new restaurant is seeking support for a liquor license that would allow alcohol service during its proposed operating hours.', impact: 'Nearby residents and businesses may care about evening activity, noise, operating hours, and the addition of a new neighborhood business.' },
  { id: 'demo-west-109', category: 'Housing', location: '142 West 109th Street', title: 'Residential building renovation', description: 'Plans are being presented for a substantial renovation of an existing residential property, including changes to shared and exterior spaces.', impact: 'The work could affect current residents during construction and change how the property and surrounding block are used afterward.' },
];
sampleMeetings[2].agenda = [
  { id: 'demo-columbus-318', category: 'Licensing', location: '318 Columbus Avenue', title: 'Restaurant liquor license application', description: 'A restaurant is requesting Community Board support for a liquor license and proposed evening operating hours.', impact: 'The application could affect nightlife, noise, local business activity, and residents living near the restaurant.' },
  { id: 'demo-amsterdam-475', category: 'Licensing', location: '475 Amsterdam Avenue', title: 'Sidewalk café application', description: 'A café is proposing an outdoor seating area that would occupy part of the sidewalk during operating hours.', impact: 'Outdoor seating could affect available sidewalk space, accessibility, street activity, and nearby residents and businesses.' },
  { id: 'demo-west-86', category: 'Transportation', location: 'West 86th Street', title: 'Curbside loading zone proposal', description: 'A proposal would reorganize part of the curb to create dedicated loading space for deliveries and passenger pickup.', impact: 'The change could affect parking availability, deliveries, traffic flow, and double parking on the block.' },
  { id: 'demo-west-88', category: 'Housing', location: '205 West 88th Street', title: 'Residential conversion proposal', description: 'A property owner is presenting plans to convert existing space in the building into additional residential units.', impact: 'The proposal could add housing while changing the use and density of the existing property.' },
];

pastMeetings[1].agenda = [
  { id: 'demo-past-business-license', category: 'Licensing', location: '267 Amsterdam Avenue', title: 'Restaurant liquor license application', description: 'The Board considered a restaurant application and proposed evening hours.', decision: 'The Board recommended support with a request for earlier outdoor closing hours and a clear process for responding to noise concerns.', meaning: 'The recommendation expressed the Board’s preferred conditions. It did not grant a liquor license.', next: 'The applicant can provide updated information for consideration by the responsible licensing authority.' },
  { id: 'demo-past-business-cafe', category: 'Licensing', location: 'Columbus Avenue', title: 'Outdoor café seating', description: 'The Board reviewed a proposed seating layout outside a café.', decision: 'The Board requested a revised plan showing a wider pedestrian route before offering further recommendations.', meaning: 'The Board sought clarification about accessibility rather than authorizing sidewalk use.', next: 'The applicant can revise the layout for review through the relevant city process.' },
  { id: 'demo-past-business-loading', category: 'Transportation', location: 'West 104th Street', title: 'Commercial loading space', description: 'The Board considered changing a section of curb to accommodate deliveries.', decision: 'The Board recommended evaluating a limited loading area and monitoring its effect on nearby access.', meaning: 'The recommendation identified a possible approach. It did not change parking rules or install a loading zone.', next: 'The responsible agency can assess the proposal and determine whether further design or outreach is needed.' },
  { id: 'demo-past-business-housing', category: 'Housing', location: '142 West 109th Street', title: 'Residential building repairs', description: 'The Board discussed a repair plan affecting shared areas in an occupied building.', decision: 'The Board requested clearer information about construction scheduling and resident access.', meaning: 'The request highlighted resident concerns and did not constitute approval of building work.', next: 'The property owner can provide revised plans and seek any required reviews.' },
];
pastMeetings[2].agenda = [
  { id: 'demo-past-review-restaurant', category: 'Licensing', location: '318 Columbus Avenue', title: 'Restaurant operating hours', description: 'The Board reviewed a restaurant’s license application and evening service plans.', decision: 'The Board recommended support with a request for a written plan to manage noise.', meaning: 'The recommendation was advisory. A separate licensing decision would still be needed.', next: 'The application and recommendation can be considered by the relevant licensing authority.' },
  { id: 'demo-past-review-sidewalk', category: 'Licensing', location: '475 Amsterdam Avenue', title: 'Sidewalk café layout', description: 'The Board considered an outdoor seating proposal near a busy pedestrian route.', decision: 'The Board requested fewer tables and clearer drawings of the remaining sidewalk space.', meaning: 'The Board identified changes it wanted reviewed, without granting permission for outdoor seating.', next: 'The café can submit revised information through the applicable review process.' },
  { id: 'demo-past-review-crossing', category: 'Transportation', location: 'West 86th Street', title: 'Pedestrian crossing improvements', description: 'The Board discussed a proposal to improve visibility at a crossing.', decision: 'The Board recommended a site assessment and consideration of curb adjustments.', meaning: 'The recommendation called for further evaluation rather than committing the city to construction.', next: 'The responsible agency can examine conditions and identify any feasible changes.' },
  { id: 'demo-past-review-conversion', category: 'Housing', location: '205 West 88th Street', title: 'Residential conversion proposal', description: 'The Board considered a plan to convert existing space into additional apartments.', decision: 'The Board requested more information about the proposed units and effects on existing occupants.', meaning: 'The request did not authorize the conversion or determine its compliance with city requirements.', next: 'The applicant can supply additional information for the next stage of review.' },
];

// Derived list counts reflect the richer content; existing dates/titles stay intact.
sampleMeetings.slice(1, 3).forEach((meeting) => {
  meeting.agendaCategories = meeting.agenda.map((item) => item.category);
});
pastMeetings.slice(1, 3).forEach((meeting) => {
  meeting.decisionCategories = meeting.agenda.map((item) => item.category);
});
let activeUpcomingMeeting = housingMeeting;
let activePastMeeting = heroPastMeeting;
const upcomingDetailTitle = (meeting) => meeting.id === housingMeeting.id
  ? 'Housing & Neighborhood Improvements' : meeting.title;

const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/New_York',
});
const timeFormat = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York',
});

function renderUpcomingMeetings() {
  const list = document.querySelector('#upcoming-list');
  // Chronological order stays the same regardless of interest matches.
  const sortedMeetings = [...sampleMeetings].sort((a, b) => new Date(a.start) - new Date(b.start));
  const firstIndex = (currentPage - 1) * meetingsPerPage;
  list.start = firstIndex + 1;
  renderMeetingRows(list, sortedMeetings.slice(firstIndex, firstIndex + meetingsPerPage));
}

function renderPastMeetings() {
  const sortedMeetings = [...pastMeetings].sort((a, b) => new Date(b.start) - new Date(a.start));
  const list = document.querySelector('#past-list');
  const firstIndex = (pastPage - 1) * meetingsPerPage;
  list.start = firstIndex + 1;
  renderMeetingRows(list, sortedMeetings.slice(firstIndex, firstIndex + meetingsPerPage), true);
}

function renderPastPagination() {
  const pagination = document.querySelector('#past-pagination');
  const pageCount = Math.ceil(pastMeetings.length / meetingsPerPage);
  pagination.replaceChildren();

  function addButton(label, page, accessibleLabel, disabled = false) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'page-control';
    button.textContent = label;
    button.setAttribute('aria-label', accessibleLabel);
    button.disabled = disabled;
    if (label === String(pastPage)) button.setAttribute('aria-current', 'page');
    button.addEventListener('click', () => {
      pastPage = page;
      renderPastMeetings();
      renderPastPagination();
      pagination.querySelector('[aria-current="page"]').focus({ preventScroll: true });
      document.querySelector('#past-page-status').textContent = `Page ${pastPage} of ${pageCount}`;
    });
    pagination.append(button);
  }

  addButton('‹', pastPage - 1, 'Previous page', pastPage === 1);
  for (let page = 1; page <= pageCount; page += 1) {
    addButton(String(page), page, `Page ${page}`);
  }
  addButton('›', pastPage + 1, 'Next page', pastPage === pageCount);
}

// Both lists share row structure and styling; only dates and count wording differ.
function renderMeetingRows(list, meetings, isPast = false) {
  const selectedInterests = Array.from(
    interestsDropdown.querySelectorAll('input:checked'), (input) => input.value,
  );
  list.replaceChildren();
  meetings.forEach((meeting) => {
    const itemCategories = isPast ? meeting.decisionCategories : meeting.agendaCategories;
    const categories = [...new Set(itemCategories)];
    const matches = categories.filter((category) => selectedInterests.includes(category));
    const matchCount = itemCategories.filter((category) => selectedInterests.includes(category)).length;
    const row = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'upcoming-row';
    button.dataset.meetingId = meeting.id;
    if (!isPast && meeting.agenda) {
      button.addEventListener('click', () => {
        activeUpcomingMeeting = meeting;
        renderMeetingDetail();
        showScreen('meeting-detail');
      });
    }
    if (isPast && meeting.agenda) {
      button.addEventListener('click', () => {
        activePastMeeting = meeting;
        renderPastMeetingDetail();
        showScreen('past-detail');
      });
    }

    const date = document.createElement('time');
    date.className = 'upcoming-date';
    date.dateTime = meeting.start;
    const day = document.createElement('span');
    day.textContent = dateFormat.format(new Date(meeting.start));
    date.append(day);
    if (!isPast) {
      const time = document.createElement('span');
      time.textContent = timeFormat.format(new Date(meeting.start));
      date.append(time);
    }

    const content = document.createElement('span');
    content.className = 'upcoming-content';
    // Use textContent so this rendering does not interpret data as HTML.
    const fields = [
      ['upcoming-board', meeting.board],
      ['upcoming-title', meeting.title],
      ['upcoming-preview', meeting.preview],
      ['upcoming-categories', `Topics: ${categories.join(' · ')}`],
      ['upcoming-count', isPast
        ? `${matchCount} relevant ${matchCount === 1 ? 'decision' : 'decisions'}`
        : `${matchCount} agenda ${matchCount === 1 ? 'item matches' : 'items match'} your interests`],
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
      indicator.textContent = `Matches your interests: ${matches.join(' · ')}`;
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

function calendarUrl(meeting) {
  const start = new Date(meeting.start);
  const end = new Date(start.getTime() + 90 * 60 * 1000);
  const calendarDate = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: message('calendarTitle', { title: translate(upcomingDetailTitle(meeting)) }),
    dates: `${calendarDate(start)}/${calendarDate(end)}`,
    ctz: 'America/New_York',
    details: message('calendarDetails', { board: translate(meeting.board), preview: translate(meeting.preview) }),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

function createAgendaRow(item, isPast = false, meeting) {
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
  if (isPast) {
    const outcomes = [
      ['What did the Community Board decide?', item.decision],
      ['What does this mean?', item.meaning],
      ['What happens next?', item.next],
    ];
    outcomes.forEach(([label, text]) => {
      const sectionHeading = document.createElement('h4');
      sectionHeading.textContent = label;
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      expanded.append(sectionHeading, paragraph);
    });
    const source = document.createElement('button');
    source.type = 'button';
    source.className = 'agenda-action';
    source.disabled = true;
    source.textContent = 'View original source ↗';
    const sourceNote = document.createElement('p');
    sourceNote.className = 'agenda-action-note';
    sourceNote.textContent = 'Source unavailable in prototype';
    expanded.append(source, sourceNote);
    row.append(summary, expanded);
    return row;
  }
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
  calendar.href = calendarUrl(meeting);
  calendar.dataset.calendarMeeting = meeting.id;
  calendar.target = '_blank';
  calendar.rel = 'noopener noreferrer';
  actions.append(questionButton, calendar);
  const note = document.createElement('p');
  note.className = 'agenda-action-note';
  note.textContent = 'Opens a 90-minute event in Google Calendar for you to review and save.';

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
  emailNote.textContent = 'Recipient: board-demo@example.invalid (not a working address). Opens a draft in your email app. No message is sent to a Community Board.';
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
      textarea.setCustomValidity(translate('Please enter a question.'));
      textarea.reportValidity();
      return;
    }
    const values = {
      meeting: translate(upcomingDetailTitle(meeting)),
      date: localizedDate(meeting.start),
      time: localizedTime(meeting.start),
      board: translate(meeting.board),
      title: translate(item.title),
      location: item.location,
      question,
    };
    const subject = message('emailSubject', values);
    const body = message('emailBody', values);
    window.location.href = `mailto:board-demo@example.invalid?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
  textarea.addEventListener('invalid', () => textarea.setCustomValidity(translate('Please enter a question.')));
  textarea.addEventListener('input', () => textarea.setCustomValidity(''));
  expanded.append(impactHeading, impact, actions, note, form);
  row.append(summary, expanded);
  return row;
}

function renderMeetingDetail() {
  const meeting = activeUpcomingMeeting;
  document.querySelector('#meeting-detail-screen h1').textContent = upcomingDetailTitle(meeting);
  document.querySelector('#detail-meeting-meta').textContent =
    `${dateFormat.format(new Date(meeting.start))} · ${timeFormat.format(new Date(meeting.start))} (New York time) · ${meeting.board}`;
  document.querySelector('#detail-meeting-preview').textContent = meeting.preview;
  renderOrderedAgenda(meeting, '#meeting-agenda');
}

function renderPastMeetingDetail() {
  const meeting = activePastMeeting;
  document.querySelector('#past-detail-title').textContent = meeting.title;
  document.querySelector('#past-detail-meta').textContent =
    `${dateFormat.format(new Date(meeting.start))} · ${meeting.board}`;
  document.querySelector('#past-detail-preview').textContent = meeting.preview;
  renderOrderedAgenda(meeting, '#past-meeting-agenda', true);
}

function renderOrderedAgenda(meeting, container, isPast = false) {
  const selected = Array.from(interestsDropdown.querySelectorAll('input:checked'), (input) => input.value);
  const matching = meeting.agenda.filter((item) => selected.includes(item.category));
  const other = meeting.agenda.filter((item) => !selected.includes(item.category));
  const agenda = document.querySelector(container);
  agenda.replaceChildren();

  function appendItems(items) {
    items.forEach((item) => {
      if (!agendaRows.has(item.id)) agendaRows.set(item.id, createAgendaRow(item, isPast, meeting));
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
  translateInterface();
  const heading = document.querySelector(`#${screen}-screen h1`);
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

document.querySelector('.meeting-card--upcoming button').addEventListener('click', () => {
  showScreen('upcoming');
});
document.querySelector('.meeting-card--past button').addEventListener('click', () => {
  showScreen('past');
});
document.querySelector('.app-name').addEventListener('click', (event) => {
  event.preventDefault();
  showScreen('home');
});
document.querySelector('#back-to-upcoming').addEventListener('click', () => showScreen('upcoming'));
document.querySelector('#back-to-past').addEventListener('click', () => showScreen('past'));
interestsDropdown.addEventListener('change', () => {
  renderUpcomingMeetings();
  renderPastMeetings();
  renderMeetingDetail();
  renderPastMeetingDetail();
});
renderUpcomingMeetings();
renderPastMeetings();
renderPagination();
renderPastPagination();


function setLanguage(language) {
  if (!['en', 'es'].includes(language) || language === currentLanguage) return;
  currentLanguage = language;
  renderHomeTypography();
  translateInterface();
  // Cached rows may be detached while another meeting is on screen.
  agendaRows.forEach(row => {
    translateInterface(row);
    row.querySelectorAll('[data-calendar-meeting]').forEach(link => {
      const meeting = sampleMeetings.find(record => record.id === link.dataset.calendarMeeting);
      link.href = calendarUrl(meeting);
    });
    row.querySelectorAll('textarea').forEach(textarea => {
      if (textarea.validity.customError) textarea.setCustomValidity(translate('Please enter a question.'));
    });
  });
  document.querySelectorAll('.language-option').forEach(button => {
    if (button.lang === language) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
}

document.querySelectorAll('.language-option').forEach(button => {
  button.addEventListener('click', () => setLanguage(button.lang));
});
// Dynamic content is created in English; localize after existing UI handlers run.
// This leaves all pagination, selection, focus, draft, and accordion state intact.
document.addEventListener('click', () => translateInterface());
document.addEventListener('change', () => translateInterface());
translateInterface();
