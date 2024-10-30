let actionType = "";
let courseId = "";

function openPasswordModal(action, item) {
   actionType = action;
   courseId = item.closest(".course-item").dataset.id;

  // Display the modal
  $("#passwordModal").modal("show");


}

// password Authentication

document.getElementById("confirmAuthBtn").addEventListener("click", () => {
  const password = document.getElementById("authPassword").value;

  // Replace this with actual password verification API call
  if (password === "correctPassword") {
    // Simulating authentication success
    $("#passwordModal").modal("hide");
    document.getElementById("authError").classList.add("d-none");

    if (actionType === "editCourse") {
      openEditModal(courseId);
    } else if (actionType === "deleteCourse") {
      deleteCourse(courseId);
    }
  } else {
    document.getElementById("authError").classList.remove("d-none");
  }
  document.getElementById("authPassword").value = "";
});
// open models
 
function openEditModal(id) {
    // Retrieve course details from backend
    fetch(`https://your-backend-url.com/api/courses/${id}`)
      .then(response => response.json())
      .then(data => {
        document.getElementById("editCourseName").value = data.name;
        document.getElementById("editCourseDesc").value = data.description;
        $("#editCourseModal").modal("show");
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Failed to retrieve course details.");
      });
  }

function openModal(modalId) {
  // document.getElementById(modalId).style.display = "block";
  $("#" + modalId).modal("show");
}

function closeModal(modalId) {
  // document.getElementById(modalId).style.display = "none";
  // document.getElementById(modalId).style.display = "none";
  $("#" + modalId).modal("hide");
}


function addCourseToPage(courseId, courseName, courseDesc) {
  // Create the new course element
  const courseItem = document.createElement("div");
  courseItem.className = "course-item";
  courseItem.setAttribute("data-id", courseId); // Use the course ID from backend response

  courseItem.innerHTML = `
      <span>${courseName}</span>
      <div class="course-actions">
        <button class="btn btn-primary" onclick="openPasswordModal('editCourse', '${courseId}')">Edit</button>
        <button class="btn btn-danger" onclick="openPasswordModal('deleteCourse', '${courseId}')">Delete</button>
      </div>
    `;

  // Append the new course to the course list
  document.getElementById("course-list").appendChild(courseItem);
}

// Function to send course details to the backend
async function sendCourseToBackend(courseName, courseDesc) {
  try {
    const response = await fetch("https://your-backend-url.com/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: courseName, description: courseDesc }),
    });

    if (!response.ok) throw new Error("Failed to save course to backend");

    const data = await response.json(); // Backend should respond with the new course ID
    return data.courseId; // Assuming response structure: { courseId: 123 }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to save course. Please try again.");
    return null;
  }
}

async function createCourse() {
  const courseName = document.getElementById("courseName").value.trim();
  const courseDesc = document.getElementById("courseDesc").value.trim();

  if (courseName && courseDesc) {
    // Save course to backend
    const courseId = await sendCourseToBackend(courseName, courseDesc);
    // const courseId = 123; 

    if (courseId) {
      // Dynamically add course to the page if backend save was successful
      addCourseToPage(courseId, courseName, courseDesc);
      closeModal("createCourseModal"); // Close modal after course creation
    }
  }
}

async function updateCourse() {
    const name = document.getElementById("editCourseName").value.trim();
    const description = document.getElementById("editCourseDesc").value.trim();
  
    if (name && description) {
      try {
        const response = await fetch(`https://your-backend-url.com/api/courses/${courseId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description }),
        });
  
        if (!response.ok) throw new Error("Failed to update course.");
  
        // Update course item on the page
        const courseItem = document.querySelector(`.course-item[data-id="${courseId}"] span`);
        if (courseItem) courseItem.textContent = name;
        
        closeModal("editCourseModal");
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to update course. Please try again.");
      }
    }
    else{
      
      throw new Error("Name or Description is invalid")
      
    }
  }
  

  async function deleteCourse(id) {
    try {
      const response = await fetch(`https://your-backend-url.com/api/courses/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) throw new Error("Failed to delete course.");
  
      // Remove course item from the page
      const courseItem = document.querySelector(`.course-item[data-id="${id}"]`);
      if (courseItem) courseItem.remove();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete course. Please try again.");
    }
  }

  function viewCourse(item){
    courseId = item.dataset.id

    window.location.href="./teacherCourse-details.html?courseId=${courseId}"
  }

  
function validateForm() {
  const courseName = document.getElementById("courseName").value.trim();
  const courseDesc = document.getElementById("courseDesc").value.trim();
  const createBtn = document.getElementById("createCourseBtn");
  createBtn.disabled = !(courseName && courseDesc);
}
