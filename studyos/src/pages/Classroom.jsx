import {useEffect, useState} from "react";

import {getCourses, getCourseWork,} from "../services/classroom";

function Classroom({token})
{
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);

    useEffect(() =>
    {
        async function load() 
        {
            if(!token)
            {
                return;
            }

            const courseList = await getCourses(token);
            setCourses(courseList);
            let work = [];

            for(const course of courseList)
            {
                const assignments = await getCourseWork(token, course.id);

                assignments.forEach((assignment) => 
                {
                    work.push({...assignment, courseName: course.name,});
                });
            }

            work.sort((a,b) => 
            {
                if(!a.dueDate)
                {
                    return 1;
                }  
                if(!b.dueDate)
                {
                    return -1;
                } 

                const dateA = new Date( a.dueDate.year, a.dueDate.month -1, a.dueDate.day);
                const dateB = new Date( b.dueDate.year, b.dueDate.month -1, b.dueDate.day);

                return dateA - dateB;
            });

            setAssignments(work);
        }

        load();
        
        const interval = setInterval(load, 15000); // every 15 seconds

        return () => clearInterval(interval);
    },[token]);

    return (
        <div id="container">
            <h1>Google Classroom</h1>

            <div id="card">
                <div id="courses">
                    {courses.map((course)=>(
                        <div key={course.id} id="cHeader">
                            <h3>{course.name}</h3>

                            <p>{course.section}</p>
                            <small>{course.room}</small>
                        </div>
                    ))}
                </div>

                <div id="assignment">
                    <h2>Upcoming Assignments</h2>

                    {assignments.length === 0?(
                        <p>No Assignments</p>
                    ):(
                        assignments.map((assignments)=>(
                            <div key={assignment.id} id="assignment-card">
                                <strong>
                                    {assignment.title}
                                </strong>

                                <br></br>

                                <small>
                                    {assignment.courseName}
                                </small>

                                <br></br>

                                {assignment.dueDate && (
                                    <span>
                                        Due{" "}

                                        {assignment.dueDate.month}/
                                        {assignment.dueDate.day}/
                                        {assignment.dueDate.year}
                                    </span>
                                )}
                            </div>
                        ))
                    )}

                </div>
            </div>
        </div>
    );
}

export default Classroom;