const overlay = document.querySelector('.menu-overlay');
const hamburger = document.querySelector('.hamburger');
const closeButton = document.querySelector('.close-menu');

hamburger.addEventListener('click', () => {
    overlay.classList.toggle('active');
})

closeButton.addEventListener('click', () => {
    overlay.classList.remove('active');
})

const eventList = document.querySelector('#event-list');
const calendarUrl = 'https://p129-caldav.icloud.com/published/2/MjIyNjc1MzA1OTgyMjI2N42NT819xg_2CN-hPCGhKhsGY9-w24oS_cxbMKWd2SoqntGe9LStkualQnEaS_MRrjfqq7xLpUzXUmZ4szVKqSk'

async function loadCalendarEvents() {
    const response = await fetch(calendarUrl);
    const text = await response.text();
    const events = parseICSEvents(text);
    renderEvents(events);
    
}

function parseICSEvents(text) {
    const veventBlocks = text.split('BEGIN:VEVENT').slice(1);
    return veventBlocks.map(block => {
        const summary = getValue(block, 'SUMMARY');
        const start = parseICSDatetime(getValue(block, 'DTSTART'));
        const location = getValue(block, 'LOCATION');
        return { summary, start, location };
    })
}

function getValue(block, key) {
  const match = block.match(new RegExp(`${key}(?:;[^:]+)?:([^\\r\\n]+)`));
  return match ? match[1].trim() : '';
}

function parseICSDatetime(value) {
  if (!value) return null;
  const raw = value.trim();

  // date-only event
  if (/^\d{8}$/.test(raw)) {
    return new Date(
      parseInt(raw.slice(0, 4)),
      parseInt(raw.slice(4, 6)) - 1,
      parseInt(raw.slice(6, 8))
    );
  }

  const match = raw.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/);
  if (!match) return null;

  const [, year, month, day, hour, minute, second, z] = match;

  if (z) {
    return new Date(Date.UTC(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    ));
  }

  return new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
    parseInt(second)
  );
}

function renderEvents(events) {
  if (!events || events.length === 0) {
    eventList.textContent = 'No upcoming events.';
    return;
  }

  eventList.innerHTML = events
    .map(event => {
      const dateText = event.start instanceof Date && !isNaN(event.start)
        ? event.start.toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
          })
        : 'Time unknown';

      return `
        <article class="event-card">
          <h2>${event.summary || 'Untitled event'}</h2>
          <p class="event-date">${dateText}</p>
          <p class="event-location">${event.location || 'Location not listed'}</p>
        </article>
      `;
    })
    .join('');
}

loadCalendarEvents();