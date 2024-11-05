
  
  let courseId = "" ;
function  viewCourse(item){
  let sendId = item.closest("[data-id]").dataset.id
  window.location.href = `./studentCourse-content.html?courseId=${sendId}`
}
  // Function to fetch course data
function fetchCourses() {
    // Simulating fetching course data; replace with actual API call if needed
    const courses = [
        { courseId: "1", title: "Introduction to Programming" },
        { courseId: "2", title: "Data Structures" },
        { courseId: "3", title: "Web Development" }
    ];

    // Add each course using the addCourse function
    courses.forEach(course => addCourse(course.courseId, course.title));
}

// Function to dynamically add a course item
function addCourse(courseId, title) {
    const courseList = document.getElementById("course-list");
    const courseItem = document.createElement("div");
    
    courseItem.className = "course-item";
    courseItem.dataset.id = courseId;
    courseItem.innerHTML = `<span onclick="viewCourse(this)">${title}</span>`;
    
    courseList.appendChild(courseItem);
}

// Call fetchCourses when the page loads
document.addEventListener("DOMContentLoaded", fetchCourses);

const back =document.getElementById('back')
back.addEventListener('click', ()=>{
  
  window.location.href = `yourCourses.html`
})
