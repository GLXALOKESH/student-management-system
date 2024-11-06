let actionType = "";
let courseId = "";
let token = getCookie("authToken");
listCourse()
function openPasswordModal(action, item) {
   actionType = action;
   courseId = item.closest(".course-item").dataset.id;
console.log(courseId);

  // Display the modal
  $("#passwordModal").modal("show");


}

// password Authentication

document.getElementById("confirmAuthBtn").addEventListener("click", () => {
  const password = document.getElementById("authPassword").value;
  // const token = getCookie("authToken");
  const sendData = { token, password };
  
  try {
    fetch("http://192.168.0.29:8090/api/auth/validate-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sendData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data?.message == "Password is valid") {
          $("#passwordModal").modal("hide");
          document.getElementById("authError").classList.add("d-none");
          if (actionType === "editCourse") {
            openEditModal(courseId);
          } else if (actionType === "deleteCourse") {
            deleteCourse(courseId); 
          }
        } else {
          document
            .getElementById("authError")
            .classList.remove("d-none");
        }
        document.getElementById("authPassword").value = "";
      });
  } catch (error) {
    console.error("Error validating password:", error);
    alert("Failed to authenticate. Please try again later.");
  }
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

function listCourse(){
  // Fetch course data from backend
  fetch("http://192.168.0.29:8090/api/courses/all-courses")
   .then(response => response.json())
   .then(data => {
      data.forEach(course => {
        addCourseToPage(course.course_id, course.course_name);
      });
    })
   .catch(error => {
      console.error("Error:", error);
      alert("Failed to retrieve course list.");
    });
}
function addCourseToPage(courseId, courseName) {
  // Create the new course element
  const courseItem = document.createElement("div");
  courseItem.className = "course-item";
  courseItem.setAttribute("data-id", courseId); // Use the course ID from backend response

  courseItem.innerHTML = `
      <span>${courseName}</span>
      <div class="course-actions">
        <button class="btn btn-primary" onclick="openPasswordModal('editCourse', this)">Edit</button>
        <button class="btn btn-danger" onclick="openPasswordModal('deleteCourse', this)">Delete</button>
      </div>
    `;

  // Append the new course to the course list
  document.getElementById("course-list").appendChild(courseItem);
}

// Function to send course details to the backend
async function sendCourseToBackend(courseName) {
  // const token = getCookie("authToken");
  if (token) {
  try {
    const response = await fetch("http://192.168.0.29:8090/api/courses/new-course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({data:{ course_name: courseName}, token}),
    });
      
    if (!response.ok) throw new Error("Failed to save course to backend");

    const data = await response.json(); // Backend should respond with the new course ID
    console.log(data);
    
    return data.course.course_id; // Assuming response structure: { courseId: 123 }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to save course. Please try again.");
    return null;
  }
}
else{
  alert("You are not authenticated. Please login.");
  return null;
}
}

async function createCourse() {
  const courseName = document.getElementById("courseName").value.trim();

  if (courseName) {
    // Save course to backend
    const courseId = await sendCourseToBackend(courseName);
    // const courseId = 123; 

    console.log(courseId);
    
    if (courseId) {
      // Dynamically add course to the page if backend save was successful
      addCourseToPage(courseId, courseName);
      closeModal("createCourseModal"); // Close modal after course creation
    }
  }
}

async function updateCourse() {
    const name = document.getElementById("editCourseName").value.trim();
    const data = {};
    if (name) data.name = name;
  
    if (name) {
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
    console.log(token);
    
    try {
      const response = await fetch(`http://192.168.0.29:8090/api/courses/delete-course/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ "token":token }),
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

  function viewCourse(item) {
    const courseId = item.closest("[data-id]").dataset.id;
    console.log(courseId);
    
    window.location.href = `./teacherCourse-content.html?courseId=${courseId}`;
}

  
function validateForm() {
  const courseName = document.getElementById("courseName").value.trim();
  const createBtn = document.getElementById("createCourseBtn");
  createBtn.disabled = !(courseName);
}

function getCookie(name) {
  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );
  if (match) return match[2];
  return null;
}