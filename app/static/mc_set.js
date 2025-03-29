$(document).ready(function () {
    fetch('/get-modules')
        .then(response => response.json())
        .then(modules => {
            let moduleSelect = $("#moduleList");
            moduleSelect.empty();
            moduleSelect.append(new Option("Select a module", ""));

            modules.forEach(module => {
                moduleSelect.append(new Option(module.module_name, module._id));
            });
        })
        .catch(error => console.error("Error fetching modules:", error));

    $("#fetchCoursesBtn").click(function () {
        let scheme = $("#schemeSelect").val();

        fetch('/get-courses-by-batch', {  
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scheme: scheme })
        })
        .then(response => response.json())
        .then(courses => {
            let container = $("#courseCheckboxContainer");
            container.empty(); // Clear previous content

            if (courses.length === 0) {
                container.append("<p>No courses available.</p>");
            } else {
                courses.forEach(course => {
                    let checkbox = `
                        <label>
                            <input type="checkbox" class="courseCheckbox" value="${course.course_code}">
                            ${course.course_title}
                        </label><br>
                    `;
                    container.append(checkbox);
                });
            }
        })
        .catch(error => console.error("Error fetching courses:", error));
    });
    

    $("#addModuleBtn").click(function () {
        let selectedCourses = [];
        $(".courseCheckbox:checked").each(function () {
            selectedCourses.push($(this).val());
        });

        let moduleName = $("#moduleName").val();

        if (selectedCourses.length === 0 || !moduleName) {
            alert("Please select at least one course and enter a module name.");
            return;
        }

        fetch('/add-module', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ courses: selectedCourses, module_name: moduleName })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload();
        })
        .catch(error => console.error("Error adding module:", error));
    });

    $("#assignMCBtn").click(function () {
        let faculty_id = $("#facultySelect").val();
        let module_id = $("#moduleList").val();

        if (!faculty_id || !module_id) {
            alert("Please select a faculty and a module.");
            return;
        }

        fetch('/assignmc', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ faculty_id: faculty_id, module_id: module_id })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload();
        })
        .catch(error => console.error("Error:", error));
    });

    $(".remove-mc-btn").click(function () {
        let moduleId = $(this).data("id");
        let button = $(this); // Store reference to button for UI update

        if (!confirm("Are you sure you want to remove this module?")) {
            return;
        }

        fetch('/remove_module', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ module_id: moduleId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                button.closest("tr").remove(); // Remove row from UI
            } else {
                alert("Error: " + (data.error || "Failed to remove module"));
            }
        })
        .catch(error => console.log("Error:", error));
    });
});
