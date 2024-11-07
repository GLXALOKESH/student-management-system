// Function to load a video
const urlParams = new URLSearchParams(window.location.search)

const lessonId = urlParams.get("lessonId")
const courseId = urlParams.get("courseId")
const token = getCookie("authToken")
console.log(lessonId)
console.log(courseId)


function loadVideo(videoUrl, title) {
    const videoPlayer = document.getElementById('videoPlayer');
    const videoTitle = document.getElementById('videoTitle');

    // Set the video source and title
    videoPlayer.src = videoUrl;
    videoTitle.textContent = title;
}

function fetchVideo(){
  fetch(`${urlport}/api/courses/get-lesson/${lessonId}`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "token": token })
  })
   .then(response => response.json())
   .then(data => {
    console.log(data);
    
      const videoUrl = data.lesson.video_url
      const title = data.lesson.lesson_name
      loadVideo(videoUrl, title)
   })
   .catch(error => console.error('Error:', error));
}
// Example usage:
// Replace 'sample.mp4' with the URL of your video file and 'Sample Video Title' with the actual title
fetchVideo()
const back =document.getElementById('back')
back.addEventListener('click', ()=>{
  
  window.location.href = `course-content.html?courseId=${courseId}`
})