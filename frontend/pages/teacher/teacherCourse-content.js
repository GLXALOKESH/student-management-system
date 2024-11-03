const urlParams = new URLSearchParams(window.location.search)

const courseId = urlParams.get("courseId")

console.log(courseId)
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

// Show the Add Video modal form
function showAddVideoForm() {
    document.getElementById('addVideoModal').style.display = 'flex';
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

    // Create form data to send to the backend
    const formData = new FormData();
    formData.append('title', videoTitle);
    formData.append('thumbnail', videoThumbnail);
    formData.append('video', videoFile);

const thumbnailUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlO6Ov678e8Aq3pN3k0IjYBemzUcand4FQg3DslBIDrXGDElwWvkZ1q74&s=10"
            addVideoToPage(videoTitle, thumbnailUrl,1);

            closeAddVideoForm();


    try {
        // Send form data to the backend
        const response = await fetch('/upload-video', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const data = await response.json();

            // Assuming backend returns thumbnail URL
            const thumbnailUrl = data.thumbnailUrl;
            const id = data.lessonId
            addVideoToPage(videoTitle, thumbnailUrl,id);

            closeAddVideoForm();
        } else {
            alert('Failed to upload video.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
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