const tagline = document.getElementById('tagline');
const icon = document.getElementById('navbar-toggler-label');
const screenWidth = window.innerWidth;
const accessKey = '38DPmfMnY0nrrjBWxt2BWcT3UYSCwuyhFHq1eATScJE';
const formElement = document.querySelector('form');
const inputElement = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');
const showMoreButton = document.getElementById('show-more-button');
let inputData = '';
let page = 1;

document.addEventListener('DOMContentLoaded', function () {
    tagline.style.setProperty('margin-top', screenWidth < 480 ? '4vh' : '13vh', 'important');

    document.querySelector('.navbar-toggler').addEventListener('click', function () {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    });

    if (formElement) {
        formElement.addEventListener('submit', function (event) {
            event.preventDefault();
            performSearch();
        });
    }
});

async function performSearch() {
    const inputData = inputElement.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;
    const response = await fetch(url);
    const data = await response.json();
    const results = data.results;
    updateResultCard(results);
}

function getMoreResults() {
    page++;
    performSearch();
}

function updateResultCard(results) {
    if (resultsContainer) {
        if (page === 1) {
            resultsContainer.innerHTML = '';
        }

        if (results.length === 0) {
            showResultModal();
        } else {
            hideTagline();
            results.forEach(result => {
                const card = createResult(result);
                resultsContainer.appendChild(card);
            });

            page++;
            showSeeMoreButton();
        }
    }
}

function createResult(result) {
    const card = document.createElement('div');
    card.className = 'col-sm g-5';
    card.innerHTML = `
        <div class="card mx-auto shadow" style="width: 18rem;">
            <div class="card-header text-center text-dark fw-bold">${result.alt_description}</div>
            <a href="#" data-bs-toggle="modal" data-bs-target="#imageModal" data-src="${result.urls.small}" alt="${result.alt_description}">
                <img class="card-img-top img-fluid" src="${result.urls.small}" alt="${result.alt_description}">
            </a>
        </div>
    `;
    return card;
}

function showSeeMoreButton() {
    if (showMoreButton) {
        showMoreButton.style.display = 'block';
    }
}

function showResultModal() {
    const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
    resultModal.show();
    tagline.style.display = 'block';
    tagline.style.setProperty('margin-top', screenWidth < 480 ? '4vh' : '13vh', 'important');
}

function hideTagline() {
    tagline.style.display = 'none';
    tagline.style.removeProperty('margin-top');
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.onscroll = function () {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    scrollTopBtn.style.display = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20 ? 'block' : 'none';
};

document.getElementById('imageModal').addEventListener('show.bs.modal', function (event) {
    const imageSrc = event.relatedTarget.getAttribute('data-src');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageSrc;
    modalImage.alt = event.relatedTarget.getAttribute('alt');
});

document.getElementById('imageModal').addEventListener('hide.bs.modal', function () {
    document.getElementById('modalImage').src = '';
});
