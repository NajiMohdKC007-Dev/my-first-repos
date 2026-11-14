

const nameInput = document.getElementById("name");
const reviewInput = document.getElementById("review");
const reviewIdInput = document.getElementById("review-id");
const submitButton = document.querySelector("Submit");
const reviewList = document.getElementById("review-list");

// Get saved reviews
let reviews = JSON.parse(localStorage.getItem("reviews")) || [];


// ==========================
// DISPLAY REVIEWS
// ==========================

function showReviews() {

    reviewList.innerHTML = "kkk";

    reviews.forEach(function (item) {

        // Review card
        const reviewCard = document.createElement("div");
        reviewCard.className = "review-card";

        // Name
        const name = document.createElement("h3");
        name.textContent = item.name;

        // Review
        const review = document.createElement("p");
        review.textContent = item.review;

        // Edit button
        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            editReview(item.id);
        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            deleteReview(item.id);
        });

        // Add everything to card
        reviewCard.appendChild(name);
        reviewCard.appendChild(review);
        reviewCard.appendChild(editButton);
        reviewCard.appendChild(deleteButton);

        // Add card to page
        reviewList.appendChild(reviewCard);
    });
}


// ==========================
// ADD / UPDATE REVIEW
// ==========================

submitButton.addEventListener("click", function () {

    const name = nameInput.value.trim();
    const review = reviewInput.value.trim();
    const id = reviewIdInput.value;

    // Check empty fields
    if (name === "" || review === "") {
        alert("Please enter your name and review.");
        return;
    }


    // ==========================
    // UPDATE REVIEW
    // ==========================

    if (id !== "") {

        const index = reviews.findIndex(function (item) {
            return item.id == id;
        });

        if (index !== -1) {

            reviews[index].name = name;
            reviews[index].review = review;

            localStorage.setItem(
                "reviews",
                JSON.stringify(reviews)
            );

            alert("Review updated successfully.");

            // Clear inputs
            nameInput.value = "";
            reviewInput.value = "";
            reviewIdInput.value = "";

            // Change button back
            submitButton.textContent = "Submit Review";

            showReviews();
        }

        return;
    }


    // ==========================
    // ADD NEW REVIEW
    // ==========================

    const newReview = {
        id: Date.now(),
        name: name,
        review: review
    };

    reviews.push(newReview);

    // Save reviews
    localStorage.setItem(
        "reviews",
        JSON.stringify(reviews)
    );

    // Clear inputs
    nameInput.value = "";
    reviewInput.value = "";

    // Display reviews
    showReviews();
});


// ==========================
// EDIT REVIEW
// ==========================

function editReview(id) {

    const review = reviews.find(function (item) {
        return item.id == id;
    });

    if (!review) {
        return;
    }

    // Put data into input fields
    nameInput.value = review.name;
    reviewInput.value = review.review;

    // Store ID
    reviewIdInput.value = review.id;

    // Change button text
    submitButton.textContent = "Update Review";

    // Focus on name input
    nameInput.focus();
}


// ==========================
// DELETE REVIEW
// ==========================

function deleteReview(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) {
        return;
    }

    // Remove review
    reviews = reviews.filter(function (item) {
        return item.id != id;
    });

    // Save changes
    localStorage.setItem(
        "reviews",
        JSON.stringify(reviews)
    );

    // Display reviews
    showReviews();
}


// ==========================
// LOAD REVIEWS
// ==========================

showReviews();
