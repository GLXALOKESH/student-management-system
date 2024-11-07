const urlParams = new URLSearchParams(window.location.search)

const courseId = urlParams.get("courseId")
console.log(courseId);

const token = getCookie("authToken")
// console.log(courseId)
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
    console.log(data);
    
    // Render video list on the page
        data.lessons.map(video => {
            addVideoToPage(video.lesson_name, video.image1, video.lesson_id);
        });
 
   }) 
}

// Close the Add Video modal form
function closeAddVideoForm() {
    document.getElementById('addVideoModal').style.display = 'none';
    document.getElementById('addVideoForm').reset();
}

// Handle Add Video functionality
async function addVideo() {
    const videoTitle = document.getElementById('videoTitle').value;
    const videoThumbnail = document.getElementById('videoThumbnail').files[0];
    const videoFile = document.getElementById('videoFile').files[0];
    const videoDesc = document.getElementById('videoDesc').value;
    const videoNo = document.getElementById('videoNo').value;

    // Optional: Rename files if needed
    const renamedVideoFile = new File([videoFile], `custom_video_${Date.now()}${generateRandomString(12)}.mp4`, { type: videoFile.type });
    const renamedThumbnail = new File([videoThumbnail], `custom_thumbnail_${Date.now()}${generateRandomString(12)}.jpg`, { type: videoThumbnail.type });

    // Create form data to send to the backend
    const formData = new FormData();
    formData.append('token', token);
    formData.append('data', JSON.stringify({
        courseId: courseId,
        lesson_name: videoTitle,
        lesson_num: videoNo,
        lesson_details: videoDesc
    }));
    formData.append('image1', renamedThumbnail); // Add renamed thumbnail
    formData.append('video', renamedVideoFile); // Add renamed video

    

    try {
        // Send form data to the backend
        const response = await fetch(`${urlport}/api/courses/upload-new-lesson`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);

            // Assuming backend returns thumbnail URL and lesson ID
            const thumbnailUrl = data.lesson.image1;
            const id = data.lesson.lesson_id;
            addVideoToPage(videoTitle, thumbnailUrl, id);

            closeAddVideoForm();
        } else {
            alert('Failed to upload video.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return result;
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
                            <a href="#">Play Video</a>
                            <a href="#">Edit Video</a>
                            <a href="#">Delete Video</a>
                        </div>
                    </div>
                </div>
    `;

    // Append the new video box to content
    contentDiv.appendChild(videoBox);
}

function videoplayer(item) {
    const lessonId = item.closest("[data-id]").dataset.id;
    console.log(lessonId);
    
    window.location.href = `./videoplayer.html?lessonId=${lessonId}&courseId=${courseId}`;
}