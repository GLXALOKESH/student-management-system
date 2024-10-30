const urlParams = new URLSearchParams(window.location.search)

const courseId = urlParams.get("courseId")


// Fetch course details from the backend
if (courseId) {
  fetch(`/api/getCourseContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ courseId: courseId })
  })
  .then(response => response.json())
  .then(data => {
    // Render course material on the page
    // document.getElementById('course-content').innerHTML = data.content;
  })
  .catch(error => console.error('Error fetching course content:', error));
}