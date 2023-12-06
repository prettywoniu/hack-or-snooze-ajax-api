"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showdeletedBtn=false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // if a user is logged in, show favorite/not-favorite star
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${showdeletedBtn ? getDeleteBtnHTML() : ''}
        ${showStar ? getStarHTML(story, currentUser) : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Make delete button HTML for a story */

function getDeleteBtnHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

/** Make favorite or not-favorite star for a story */

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Added funciton: Get the data from the form and put that new story on the page */

async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  let $title = $('#title').val();
  let $author = $('#author').val();
  let $url = $('#url').val();
 
  let s = await storyList.addStory(currentUser, {title: $title, author: $author, url: $url});

  const $story = generateStoryMarkup(s);
  $allStoriesList.prepend($story);
  //$myStoriesList.prepend($story);
  
  $('#title').val('');
  $('#author').val('');
  $('#url').val('');
  $newStoryForm.hide();
}

$("#submit").on("click", submitNewStory)

/** ************************************************************************** 
 * Added function:
 * Functionality for favorites list and starr/un-starr a story */

/** Put favorite stories on page */

function putFavStoriesOnPage() {
  console.debug("putFavStoriesOnPage");

  $favStoriesList.empty();

  if (currentUser.favorites.length === 0) {
    $favStoriesList.append('<h5>No favorite story added!</h5>')
  } else {
    // loop through all of users favorites and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favStoriesList.append($story);
    }
  }
  
  $favStoriesList.show()
}

/** Handle favorite / un-favorite a story */

async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");

  const $tgt = $(evt.target);
  const storyId = $tgt.closest('li').attr('id')
  const story = storyList.stories.find(s => s.storyId === storyId);

  //See if the story is already favorited (checking by presence of star)
  if ($tgt.hasClass('fas')) {
    // Currently a favorite: remove from fav list and change star
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    // currently not a favorite: do the opposite
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on('click', '.star', toggleStoryFavorite)

/******************************************************************************
 *  Added function:
 * Functionality for list of user's own stories
 */

function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");

  $myStoriesList.empty();
  
  if (currentUser.ownStories.length === 0) {
    $myStoriesList.append('<h5>No stories added by user yet!</h5>');
  } else {
    // loop through all of our stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story, true);
      $myStoriesList.append($story);
    }
  }
  
  $myStoriesList.show();
}

/******************************************************************************
 * Added function
 * Functionality for removing a story from stories list and user's stories list
 */

async function deleteStory(evt) {
  const $tgt = $(evt.target);
  const $li = $tgt.closest('li');
  const storyId = $li.attr('id');

  await storyList.removeStory(currentUser, storyId);
  //console.log(currentUser);
  
  putMyStoriesOnPage();
  
}

$myStoriesList.on('click', '.trash-can', deleteStory)