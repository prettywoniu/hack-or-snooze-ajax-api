"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** Added function: Show new story submit form on click on "submit" */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt)
  hidePageComponents();
  $newStoryForm.show();
  $allStoriesList.show();
}

$('#nav-submit').on('click', navSubmitClick);

/** Added function: Show current user's favorite stories on click on "favorites" */

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt)
  hidePageComponents();
  putFavStoriesOnPage();
}

$('#nav-favorites').on('click', navFavoritesClick);

/** Added function: Show all stories current user posted, on click on "my stories" */

function navMyStoriesClick(evt) {
  console.debug("navMyStoriesClick", evt)
  hidePageComponents();
  putMyStoriesOnPage();
}

$('#nav-my-stories').on('click', navMyStoriesClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
