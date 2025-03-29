document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".approve-btn").forEach(button => {
        button.addEventListener("click", function () {
            const coId = this.getAttribute("data-id");
            fetch("/approve_co", {
                method: "POST",
                body: JSON.stringify({ co_id: coId }),
                headers: { "Content-Type": "application/json" }
            }).then(response => response.json())
              .then(data => {
                  if (data.status === "approved") {
                      document.getElementById(`row-${coId}`).remove();
                      alert("CO Approved & Faculty Notified!");
                  }
              });
        });
    });

    document.querySelectorAll(".reject-btn").forEach(button => {
        button.addEventListener("click", function () {
            const coId = this.getAttribute("data-id");
            fetch("/reject_co", {
                method: "POST",
                body: JSON.stringify({ co_id: coId }),
                headers: { "Content-Type": "application/json" }
            }).then(response => response.json())
              .then(data => {
                  if (data.status === "rejected") {
                      document.getElementById(`row-${coId}`).remove();
                      alert("CO Rejected & Removed!");
                  }
              });
        });
    });

    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", function () {
            const coId = this.getAttribute("data-id");
            document.getElementById(`weightage-${coId}`).style.display = "none";
            document.getElementById(`input-weightage-${coId}`).style.display = "inline";
            document.getElementById(`edit-btn-${coId}`).style.display = "none";
            document.getElementById(`save-btn-${coId}`).style.display = "inline";
        });
    });

    document.querySelectorAll(".save-btn").forEach(button => {
        button.addEventListener("click", function () {
            const coId = this.getAttribute("data-id");
            const newThreshold = document.getElementById(`input-weightage-${coId}`).value;

            fetch("/edit_co_threshold", {
                method: "POST",
                body: JSON.stringify({ co_id: coId, threshold: newThreshold }),
                headers: { "Content-Type": "application/json" }
            }).then(response => response.json())
              .then(data => {
                  if (data.status === "edited") {
                      document.getElementById(`weightage-${coId}`).innerText = `Threshold: ${newThreshold}`;
                      document.getElementById(`weightage-${coId}`).style.display = "inline";
                      document.getElementById(`input-weightage-${coId}`).style.display = "none";
                      document.getElementById(`edit-btn-${coId}`).style.display = "inline";
                      document.getElementById(`save-btn-${coId}`).style.display = "none";
                      alert("Threshold Updated!");
                  }
              });
        });
    });
});