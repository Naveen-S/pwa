var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  if(deferredPrompt) {
    deferredPrompt.prompt();
    
    deferredPrompt.userChoice.then(choiceResult => {
      console.log(choiceResult.outcome);

      if(choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('Added to Home screen!');
      }
    });
    deferredPrompt = null;
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// On demand caching
/* function saveForLater(e) {
  console.log('clicked');
  if('caches' in window) {
    console.log('Inside ');
    caches.open('user-requested').then(cache => {
        cache.addAll(['https://httpbin.org/get','/src/images/sf-boat.jpg']);
    });
  }
} */
function clearCards() {
  while(sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.remove(sharedMomentsArea.lastChild);
  }
}

function createCard() {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url("/src/images/sf-boat.jpg")';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = 'San Francisco Trip';
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = 'In San Francisco';
  cardSupportingText.style.textAlign = 'center';
  // On demand caching
  /* var saveForLaterBtn = document.createElement('button');
  saveForLaterBtn.textContent = 'Save for Later';
  cardSupportingText.appendChild(saveForLaterBtn);
  saveForLaterBtn.addEventListener('click', saveForLater); */
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

var url = 'https://httpbin.org/get';
var isDataAlreadyLoadedFromNetwork = false;
fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    console.log('From web ', data);
    isDataAlreadyLoadedFromNetwork = true;
    clearCards();
    createCard();
  });

  if('caches' in window) {
    caches.match(url).then(response => {
      if(response) {
        return response.json();
      }
    }).then(data => {
      console.log('From cache ', data);
      if(!isDataAlreadyLoadedFromNetwork) {
        clearCards();
        createCard();
      }
    })
  }  