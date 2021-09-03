#  Movie Rating App

Movie rating app is Single Page Application used to rate the movie. It provides below features
* Login feature for user.
* User can Add/Delete the movie and provide ratings(1-5)for the movie.
* User can sort(ascending/descending) the movie list on the basis of ratings.Sorting survives other actions on page, such as adding/deleting items or changing the rating of an movie.
* Every user has distinct list of movies. If a user logs in on two different browsers, they will share a movie list.
* Application provides feature for polling.In every 5 seconds the page will fetch an updated list of movies from the server and display any changes.
* In memory data persistence.
* Data persist between the sessions.

## Tech Stack
* HTML
* CSS
* Client-side JS
* Express
* REST endpoints

## Implementation
 * Used webpack and babel for bundling and transpiling the code.
 * Their is separation of concern for Client side and Server side code.

## How to run 
* Navigate to root folder js-rest-login
* Run `npm install` for installing the dependency.
* Run `npm run build` for production build.
* Run `node server.js`, for running and then going to `http://localhost:3000/`

