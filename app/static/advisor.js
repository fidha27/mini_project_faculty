document.addEventListener("DOMContentLoaded", function () {
    let subjectsList = [];
    let teachersList = [];
    let departmentsList = [];
    const courseForm = document.getElementById("course-form");
    const tableBody = document.getElementById("course-mapping-table");
    
    if (!courseForm || !tableBody) {
        console.error("Course form or table body not found!");
        return;
    }

    // Fetch dropdown options once
    fetch("/get-options")
        .then(response => response.json())
        .then(data => {
            subjectsList = data.subjects || [];
            teachersList = data.teachers || [];
            departmentsList = data.departments || [];
            console.log("Dropdown data loaded:", subjectsList, teachersList, departmentsList);
        })
        .catch(error => console.error("Error fetching dropdown options:", error));
    
        fetch(`/get-latest-batch`)
        .then(response =>{
           if(!response.ok){
            throw new Error("Failed to fetch the latest batch");
           }
        return response.json();
        })
        .then(data => {
            if (data.error) {
                console.error("Error fetching latest batch:", data.error);
                return;
            }
            let latestBatch = data.batch;
            let latestSemester = data.semester;

            console.log("Latest batch:", latestBatch, "Latest semester:", latestSemester);

            // Fetch & populate course mappings for this batch and semester
             return fetch(`/get-course-mappings?batch=${latestBatch}&semester=${latestSemester}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        console.error("Error fetching course mappings:", data.error);
                        return;
                    }
                    data.mappings.forEach(mapping => {
                        addMappingToTable(mapping._id, mapping.course_title, mapping.name, mapping.dept_code);
                    });
                })
                .catch(error => console.error("Error fetching mapped courses:", error));
        })
        .catch(error => console.error("Error fetching latest batch info:", error));

    // Add mapping to table
    function addMappingToTable(id, subject, teacher, department) {
        let newRow = document.createElement("tr");
        newRow.setAttribute("data-id", id);
        newRow.innerHTML = `
            <td>${subject}</td>
            <td>${teacher}</td>
            <td>${department}</td>
            <td>
                <button class="btn btn-warning btn-sm edit-btn">Edit</button>
                <button class="btn btn-danger btn-sm delete-btn">Delete</button>
            </td>
        `;

        tableBody.appendChild(newRow);
    }

    


    // Handle semester change to load subjects
    let semesterDropdown = document.getElementById("semester");
    if (semesterDropdown) {
        semesterDropdown.addEventListener("change", function () {
            let semester = this.value;
            let subjectDropdown = document.getElementById("subject");
            subjectDropdown.innerHTML = '<option value="">Select Subject</option>';

            if (semester) {
                fetch(`/get-subjects?semester=${semester}`)
                    .then(response => response.json())
                    .then(data => {
                        subjectDropdown.innerHTML=`<option value="">Select Subject</option>`;

                        if (data.subjects) {
                            data.subjects.forEach(subject => {
                                let option = document.createElement("option");
                                option.value = subject.course_title;
                                option.textContent = subject.course_title;
                                subjectDropdown.appendChild(option);
                            });
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching subjects:", error);
                        subjectDropdown.innerHTML=`<option value=''>Error loading subjects</option>`;
                    });
            }
        });
    }

    
    
    // Handle department change to load teachers
    document.getElementById("department").addEventListener("change", function () {
        let department = this.value;
        let teacherDropdown = document.getElementById("teacher");
        teacherDropdown.innerHTML =`<option value="">Loading...</option>`;

        fetch("/get-teachers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ department: department })
        })
            .then(response => response.json())
            .then(data => {
                teacherDropdown.innerHTML = `<option value="">Select Teacher</option>`;
                data.teachers.forEach(teacher => {
                    teacherDropdown.innerHTML += `<option value="${teacher.name}">${teacher.name}</option>`;
                });
            })
            .catch(error => {
                console.error("Error fetching teachers:", error);
                teacherDropdown.innerHTML = `<option value="">Error loading teachers</option>`;
            });
    });

    // Handle course mapping form submission
    courseForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let mappingData = {
            semester: document.getElementById("semester").value,
            subject: document.getElementById("subject").value,
            teacher: document.getElementById("teacher").value,
            department: document.getElementById("department").value,
        };

        if (!mappingData.semester || !mappingData.subject || !mappingData.teacher || !mappingData.department) {
            alert("Please fill in all fields before saving.");
            return;
        }

        fetch("/course_mapping", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mappingData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert("Error: " + data.error);
                } else {
                    alert("Course mapping added successfully!");
                    courseForm.reset();
                    location.reload(); // Reload page to update table
                }
            })
            .catch(error => console.error("Error:", error));
    });

    

    // Create dropdown dynamically
    function createDropdown(options, selectedValue, id) {
        return `<select class="form-control" id="${id}">
            ${options.map(option => `<option value="${option}" ${option === selectedValue ? "selected" : ""}>${option}</option>`).join("")}
        </select>`;
    }

    

});
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("semester").addEventListener("change", function () {
        let semester = this.value;
        let subjectDropdown = document.getElementById("subject");

        // Clear previous options
        subjectDropdown.innerHTML = '<option value="">Select Subject</option>';

        if (semester) {
            fetch(`/course_mapping?semester=${semester}`)
                .then(response => response.json())
                .then(data => {
                    if (data.subjects.length > 0) {
                        data.subjects.forEach(subject => {
                            let option = document.createElement("option");
                            option.value = subject.course_title;
                            option.textContent = subject.course_title;
                            subjectDropdown.appendChild(option);
                        });
                    }
                })
                .catch(error => console.error("Error fetching subjects:", error));
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("course-mapping-table").addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-btn")) {
            const row = event.target.closest("tr");
            const mappingId = row.dataset.id;
            const subject = row.dataset.subject;
            const teacher = row.dataset.teacher;
            const department = row.dataset.department;

            if (confirm(`Are you sure you want to delete the mapping for ${subject} taught by ${teacher} in ${department}?`)) {
                deleteMapping(row, mappingId);
            }
        }
    });

    function deleteMapping(row, mappingId) {
        fetch(`/delete-mapping/${mappingId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Error: " + data.error);
            } else {
                alert("Course mapping deleted successfully!");
                row.remove();  // Remove row from table after successful deletion
            }
        })
        .catch(error => console.error("Error:", error));
    }
});