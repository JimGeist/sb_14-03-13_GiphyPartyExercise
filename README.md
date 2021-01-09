# sb_14-03-13_GiphyPartyExercise

## AJAX Giphy Party

Assignment involved using AJAX and axios to build an application that returns gifs from GIPHY based on a search term. A light amount of bootstrap was added.

The application works, but not from github pages. The catch of the try/catch in the async function getGiphyGiphs(inSearch) generates a "An unexpected error (Network Error) happened while connecting to Giphy. Search for 'search-term' was not performed." Not sure if this is a Cross-Origin Resource Sharing (CORS) issue, a key issue, or something else. The error also occurs when the api_key in the assignment documentation is used. Please download the code and run it locally.

~~Please go to [GIPHY Party!](https://jimgeist.github.io/sb_14-03-13_GiphyPartyExercise/) for the application with bootstrap or [GIPHY Party! (no bootstrap)](https://jimgeist.github.io/sb_14-03-13_GiphyPartyExercise/index-nobootstrap.html) for the version without bootstrap.~~

## Assignment Details
Application displays gifs from GIPHY based on a search term. Five giphs are randomly selected for displayed.

Clicking on an individual gif removes the gif. Clicking 'Remove All giphs' will remove all gifs from the page.

I used this assignment as a proof-of-concepts and the JavaScript makes use of jQuery, bootstrap, localStorage, and classes.
