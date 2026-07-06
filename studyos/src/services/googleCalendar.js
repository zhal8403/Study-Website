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

  for (const calendar of calendars) {
    try {
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
          calendar.id
        )}/events?singleEvents=true&orderBy=startTime&maxResults=250`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await res.json();

      const events = (data.items || []).map((event) => ({
        ...event,
        calendarName: calendar.summary,
        calendarId: calendar.id,
      }));

      allEvents.push(...events);
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

export async function getCalendars(accessToken) {
  try {
    const res = await fetch(
      "https://www.googleapis.com/calendar/v3/users/me/calendarList",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await res.json();

    return data.items || [];
  } catch (err) {
    console.error("Calendar list error:", err);
    return [];
  }
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
