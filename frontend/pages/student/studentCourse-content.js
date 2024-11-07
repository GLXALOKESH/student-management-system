const urlParams = new URLSearchParams(window.location.search)

const courseId = urlParams.get("courseId")

const token = getCookie("authToken")
listVideos()



function listVideos() {
    // Fetch video list from the backend
    fetch(`${urlport}/api/courses/get-course-lessons`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "courseId": courseId , "token": token  })
    })
   .then(response => response.json())  
   .then(data => {
    
    // Render video list on the page
        data.lessons.map(video => {
            addVideoToPage(video.lesson_name, video.image1, video.lesson_id);
        });
 
   }) 
}


// Function to add the video box to the page
function addVideoToPage(title, thumbnailUrl,id) {
    const contentDiv = document.getElementById('video-container');

    // Create new video box element
    const videoBox = document.createElement('div');
    videoBox.className = 'video-box';
    videoBox.dataset.id = id
  
    videoBox.innerHTML = `
        <img src="${thumbnailUrl}" alt="Thumbnail" class="video-thumbnail" onclick="videoplayer(this)">
                <div class="video-info">
                    <p class="video-title">${title}</p>
                    <div class="video-options">
                        <i class="fas fa-ellipsis-v"></i>
                        <div class="video-options-menu">
                            <a onclick="markComplete(this)" style="cursor: pointer;">Mark As Complete</a>
                            
                        </div>
                    </div>
                </div>
    `;

    // Append the new video box to content
    contentDiv.appendChild(videoBox);
}
function markComplete(item){
    const lessonId = item.closest("[data-id]").dataset.id;
    fetch(`${urlport}/api/courses/mark-complete-lesson`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"data":{"courseId":courseId, "lessonId": lessonId,}, "token": token  })
    })
   .then(response => response.json())
   .then(data => {
    if(data.status === true){
        alert("Lesson marked as complete!");
      }else{
        alert(data.message);
      }
    
   })

}
function videoplayer(item) {
    const lessonId = item.closest("[data-id]").dataset.id;
    console.log(lessonId);
    
    window.location.href = `./studentVideoPlayer.html?lessonId=${lessonId}&courseId=${courseId}`;
}