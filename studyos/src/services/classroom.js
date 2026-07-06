export async function getCourses(token) {
    const res = await fetch(
        "https://classroom.googleapis.com/v1/courses",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await res.json();

    return data.courses || [];
}

export async function getCourseWork(token, courseId) {
    const res = await fetch(
        `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await res.json();

    return data.courseWork || [];
}

export async function getAnnouncements(token, courseId) {
    const res = await fetch(
        `https://classroom.googleapis.com/v1/courses/${courseId}/announcements`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await res.json();

    return data.announcements || [];
}