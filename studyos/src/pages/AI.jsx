function AI(){
    async function loadSummary() {
                if (events.length === 0) return;
    
                try {
    
                    const prompt = `
                        You are StudyOS, an AI student assistant.
    
                        Your job is to create a daily student briefing from the user's calendar.
    
                        IMPORTANT RULES:
                        - Only use the events provided below.
                        - Do NOT invent holidays, assignments, tests, birthdays, or tasks.
                        - Only include events happening within the next 7 days.
                        - Pay special attention to deadlines, due dates, exams, meetings, and important tasks.
                        - If something important is coming soon, warn the student.
                        - Keep the briefing short and easy to scan.
    
                        Format:
    
                        🌅 Good Morning!
                        Give a 1-2 sentence overview of the day.
    
                        📅 Today's Schedule:
                        List today's events with times.
    
                        ⚠️ Watch Out For:
                        Mention upcoming deadlines, tests, assignments, or important events in the next 7 days.
    
                        🎯 Today's Focus:
                        Give 1-2 productivity suggestions based on the schedule.
    
                        💡 Motivation:
                        Give a short encouraging message.
    
                        Calendar events for the next 7 days:
    
                        ${events.length > 0 
                            ? events.map(e => {
                                const start = new Date(e.start?.dateTime || e.start?.date);
    
                                return `
                        Event: ${e.summary}
                        Date: ${start.toLocaleDateString()}
                        Time: ${start.toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit"
                        })}
                        Description: ${e.description || "None"}
                        `;
                            }).join("\n")
                            : "No events scheduled for the next 7 days."
                        }
    
                        Generate the briefing now.
                        `;
    
                    const response = await generateSummary(prompt);
    
                    setSummary(response);
    
                } catch (err) {
                    console.error(err);
                    setSummary("Failed to load AI summary.");
                }
            }
}

export default AI;