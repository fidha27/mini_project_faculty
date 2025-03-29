$(document).ready(function () {
    $(".edit-btn").click(function () {
        let row = $(this).closest("tr");
        row.find(".advisor-name").hide();
        row.find(".advisor-select").removeClass("hidden");
        row.find(".edit-btn").hide();
        row.find(".save-btn").removeClass("hidden");
    });

    $(".save-btn").click(function () {
        let row = $(this).closest("tr");
        let batch = row.data("batch-id");
        let newAdvisor = row.find(".advisor-select").val();
        let oldAdvisor = row.find(".advisor-name").text();

        fetch("/edit-advisor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ batch: batch, old_advisor_id: oldAdvisor, new_advisor_id: newAdvisor })
        }).then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload();
        });
    });

    $(".delete-btn").click(function () {
        let row = $(this).closest("tr");
        let batch = row.data("batch-id");
        let advisor = row.find(".advisor-name").text();

        fetch("/delete-advisor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ batch: batch, advisor_id: advisor })
        }).then(response => response.json())
        .then(data => {
            alert(data.message);
            row.remove();
        });
    });

    $("#add-batch-btn").click(function () {
        let batch = prompt("Enter Batch ID:");
        let advisor = prompt("Enter Advisor's ID:");

        if (batch && advisor) {
            fetch("/add-advisor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ batch: batch, advisor_id: advisor })
            }).then(response => response.json())
            .then(data => {
                alert(data.message);
                location.reload();
            });
        }
    });

    $(".delete-mc-btn").click(function () {
        let row = $(this).closest("tr");
        let moduleName = row.data("module-id");

        fetch("/delete-mc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ module_name: moduleName })
        }).then(response => response.json())
        .then(data => {
            alert(data.message);
            row.remove();
        });
    });

    $("#add-module-btn").click(function () {
        let faculty = prompt("Enter Faculty ID:");
        let courses = prompt("Enter Course Codes (comma separated):").split(",");
        let moduleName = prompt("Enter Module Name:");

        if (faculty && courses.length > 0 && moduleName) {
            fetch("/add-mc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ faculty_id: faculty, courses: courses, module_name: moduleName })
            }).then(response => response.json())
            .then(data => {
                alert(data.message);
                location.reload();
            });
        }
    });
});
