// Function to load a video
const urlParams = new URLSearchParams(window.location.search)

const lessonId = urlParams.get("lessonId")
const courseId = urlParams.get("courseId")
console.log(lessonId)
console.log(courseId)


function loadVideo(videoUrl, title) {
    const videoPlayer = document.getElementById('videoPlayer');
    const videoTitle = document.getElementById('videoTitle');

    // Set the video source and title
    videoPlayer.src = videoUrl;
    videoTitle.textContent = title;
}

// Example usage:
// Replace 'sample.mp4' with the URL of your video file and 'Sample Video Title' with the actual title
loadVideo('https://res.cloudinary.com/dwb1jtrym/video/upload/v1730607873/usr3xyt1pe04skdgigcz.mp4', 'Sample Video Title');
const back =document.getElementById('back')
back.addEventListener('click', ()=>{
  
  window.location.href = `teacherCourse-content.html?courseId=${courseId}`
})