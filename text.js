
const nameInput = document.getElementById("name");
const reviewInput = document.getElementById("review");
const reviewIdInput = document.getElementById("review-id");
const submitBtn = document.querySelector(".Submit");
const reviewList = document.getElementById("review-list");

// Store reviews
let reviews = JSON.parse(localStorage.getItem("productReviews")) || [];

// Current star rating
let selectedRating = 0;

// Create rating section
const ratingSection = document.createElement("div");
ratingSection.className = "rating-section";

ratingSection.innerHTML = `
    <h3>Rate This Product</h3>
    <div class="star-input">
        ${[1, 2, 3, 4, 5].map(star =>
            `<span class="star" data-rating="${star}">★</span>`
        ).join("")}
    </div>
    <p id="rating-message">Select your rating</p>
    <div id="average-rating"></div>
`;

reviewList.before(ratingSection);

const stars = document.querySelectorAll(".star");

// Add star styling
const style = document.createElement("style");

style.textContent = `
    .rating-section {
        margin: 20px 0;
    }

    .star-input {
        display: flex;
        gap: 8px;
        margin: 10px 0;
    }

    .star {
        font-size: 35px;
        color: #d1d5db;
        cursor: pointer;
        transition: 0.2s;
    }

    .star.active {
        color: #f59e0b;
    }

    .star:hover {
        transform: scale(1.2);
    }

    #rating-message {
        color: #64748b;
        font-size: 14px;
    }

    .review-card {
        margin-top: 18px;
        padding: 18px;
    }

    .review-card p {
        line-height: 1.6;
        margin: 10px 0 15px;
        overflow-wrap: anywhere;
    }

    .review-stars {
        color: #f59e0b;
        font-size: 20px;
        margin: 8px 0;
    }

    .average-rating {
        margin-top: 15px;
        font-size: 17px;
        color: #16a34a;
        font-weight: bold;
    }

    .edit-btn, .delete-btn {
        margin: 5px 5px 5px 0;
    }
`;

document.head.appendChild(style);

// Select star rating
stars.forEach(star => {
    star.addEventListener("click", () => {
        selectedRating = Number(star.dataset.rating);
        updateStars();
    });
});

function updateStars() {
    stars.forEach(star => {
        const rating = Number(star.dataset.rating);

        star.classList.toggle(
            "active",
            rating <= selectedRating
        );
    });

    document.getElementById("rating-message").textContent =
        selectedRating + " out of 5 stars selected";
}

// Save reviews
function saveReviews() {
    localStorage.setItem(
        "productReviews",
        JSON.stringify(reviews)
    );
}

// Display average rating
function updateAverageRating() {
    const averageBox = document.getElementById("average-rating");

    if (reviews.length === 0) {
        averageBox.innerHTML = `
            <p class="average-rating">
                ⭐ No ratings yet
            </p>
        `;
        return;
    }

    const total = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
    );

    const average = (total / reviews.length).toFixed(1);

    averageBox.innerHTML = `
        <div class="average-rating">
            ⭐ ${average} / 5
            (${reviews.length} customer reviews)
        </div>
    `;
}

// Add or update review
submitBtn.addEventListener("click", () => {

    const name = nameInput.value.trim();
    const reviewText = reviewInput.value.trim();
    const editId = reviewIdInput.value;

    if (!name || !reviewText) {
        alert("Please enter your name and review!");
        return;
    }

    if (selectedRating === 0) {
        alert("Please select a star rating!");
        return;
    }

    if (editId) {

        // Edit existing review
        const index = reviews.findIndex(
            review => review.id === Number(editId)
        );

        if (index !== -1) {
            reviews[index].name = name;
            reviews[index].text = reviewText;
            reviews[index].rating = selectedRating;
        }

        submitBtn.textContent = "Submit review";
        reviewIdInput.value = "";

    } else {

        // Add new review
        const newReview = {
            id: Date.now(),
            name: name,
            text: reviewText,
            rating: selectedRating,
            date: new Date().toLocaleDateString()
        };

        reviews.unshift(newReview);
    }

    saveReviews();
    displayReviews();
    clearForm();
});

// Clear form
function clearForm() {
    nameInput.value = "";
    reviewInput.value = "";
    reviewIdInput.value = "";
    selectedRating = 0;

    updateStars();
    submitBtn.textContent = "Submit review";
}

// Display all reviews
function displayReviews() {

    reviewList.innerHTML = "";

    if (reviews.length === 0) {
        reviewList.innerHTML = `
            <p style="margin-top:20px;color:#64748b;">
                No reviews yet. Be the first to review!
            </p>
        `;
    }

    reviews.forEach(review => {

        const card = document.createElement("div");
        card.className = "review-card";

        const heading = document.createElement("h3");
        heading.textContent = review.name;

        const date = document.createElement("small");
        date.textContent = review.date || "";

        const rating = document.createElement("div");
        rating.className = "review-stars";
        rating.textContent =
            "★".repeat(review.rating) +
            "☆".repeat(5 - review.rating);

        const paragraph = document.createElement("p");
        paragraph.textContent = review.text;

        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            editReview(review.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteReview(review.id);
        });

        card.append(
            heading,
            date,
            rating,
            paragraph,
            editButton,
            deleteButton
        );

        reviewList.appendChild(card);
    });

    updateAverageRating();
}

// Edit review
function editReview(id) {

    const review = reviews.find(
        item => item.id === id
    );

    if (!review) return;

    nameInput.value = review.name;
    reviewInput.value = review.text;
    reviewIdInput.value = review.id;

    selectedRating = review.rating;
    updateStars();

    submitBtn.textContent = "Update Review";

    document.querySelector(".review-box").scrollIntoView({
        behavior: "smooth"
    });
}

// Delete review
function deleteReview(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) return;

    reviews = reviews.filter(
        review => review.id !== id
    );

    saveReviews();
    displayReviews();

    if (Number(reviewIdInput.value) === id) {
        clearForm();
    }
}

// Initial display
displayReviews();
