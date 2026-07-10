export async function getCalendarEvents(accessToken) {
  const now = new Date().toISOString();

  try {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&maxResults=50&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await res.json();

    return data.items || [];
  } 
  catch (err) {
    console.error("Calendar error:", err);
    return [];
  }
}

export async function getAllCalendarEvents(accessToken) {
  const calendars = await getCalendars(accessToken);

  let allEvents = [];

  const currentYear = new Date().getFullYear();

  // January 1 of this year
  const timeMin = new Date(currentYear, 0, 1).toISOString();

  // March 1 of next year (exclusive, so includes all of February)
  const timeMax = new Date(currentYear + 1, 2, 1).toISOString();

  for (const calendar of calendars) {
    try {
      console.log("Loading:", calendar.summary);

      let pageToken = "";
      let calendarEvents = [];

      do {
        const url =
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
            calendar.id
          )}/events` +
          `?singleEvents=true` +
          `&orderBy=startTime` +
          `&timeMin=${encodeURIComponent(timeMin)}` +
          `&timeMax=${encodeURIComponent(timeMax)}` +
          `&maxResults=250` +
          (pageToken ? `&pageToken=${pageToken}` : "");

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();

        if (data.error) {
          console.error(calendar.summary, data.error);
          break;
        }

        const events = (data.items || []).map((event) => ({
          ...event,
          calendarName: calendar.summary,
          calendarId: calendar.id,
        }));

        calendarEvents.push(...events);

        pageToken = data.nextPageToken || "";

      } while (pageToken);

      console.log(calendar.summary, calendarEvents.length);

      allEvents.push(...calendarEvents);

    } catch (err) {
      console.error(calendar.summary, err);
    }
  }

  return allEvents.sort((a, b) => {
    const aDate = new Date(a.start?.dateTime || a.start?.date);
    const bDate = new Date(b.start?.dateTime || b.start?.date);
    return aDate - bDate;
  });
}

export async function getCalendars(token) {
    const res = await fetch(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await res.json();
    return data.items || [];
}

export async function createEvent(token, calendarId = "primary", event)
{
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  );

  return await res.json();
}

export async function updateEvent( token, calendarId, eventId, updates) 
{
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    }
  );

  return await res.json();
}

export async function deleteEvent(token, calendarId, eventId) 
{
  await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function searchEvents(token, query) {
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?q=${encodeURIComponent(query)}&singleEvents=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  return data.items || [];
}
