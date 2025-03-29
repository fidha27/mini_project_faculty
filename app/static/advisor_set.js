$(document).ready(function () {
    $("#addAdvisorBtn").click(function () {
        let batch = $("#batchInput").val().trim();  // Get batch value
        let advisor_id = $("#advisorSelect").val(); // Get selected advisor ID

        if (!batch || !advisor_id) {
            alert("Please select a batch and an advisor.");
            return;
        }

        fetch('/add-advisor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ batch: batch, advisor_id: advisor_id })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload();
        })
        .catch(error => console.error("Error:", error));
    });

    $(document).on("click", ".remove-advisor-btn", function () {
        let advisor_id = $(this).data("id");
        let batch = $(this).data("batch");  // Get batch from button

        if (!confirm("Are you sure you want to remove this advisor?")) return;

        fetch('/remove-advisor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ advisor_id: advisor_id, batch: batch })  // Pass batch
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload();
        })
        .catch(error => console.error("Error:", error));
    });
});
