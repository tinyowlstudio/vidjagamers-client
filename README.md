# Vidja Gamers App
This is an app that will allow users to view video games. They can register, login, and manage their user info and their favorite video games. Games themselves have a descriptions on the video game itself, including developers, release year, and genres. A search function is also included to help users filter and find the game they want to look at and add or remove from their favorites list. 

User and game info are stored on an API, and the app itself accesses said API so long as a JWT token is correct. Passwords are also encrypted on the API. The two databases were made specifically for this app.

**To view the API, go to this repository: https://github.com/Alioran/game_api**

**To view the live app, go to this link: https://vidjagamers.netlify.app/**

## Current bugs/issues
- Handle CORS issue in which specified URLs are causing issues (to allow the removal of using all origins)

## Possible Future Updates
- Increase game library to be more substantial OR use another Game API that already has a library of games
    - If using a different Game API, app functionality will need to be adjusted
- Work on branding and visual design of the app
- Add a featured/all games filter
- Add pagination for a list of games greater than 10-20 (testing will need to be done to see what number works best)
- Possibly a better list sorting mechanism (ie, listed games in a series should be by date)
- Add roll over for descriptions of developers and genres
- Allow users to click developers, series, genres, platforms and year to see a full list of games with the same field

## Versions
**Ver 0.8 (7-26-2023)**
- Updated to adapt local storage to work with Redux states, local storage data will dispatch to the Redux state if it exists

**Ver 0.7 (7-16-2023)**
- Changed user object stored in local storage to Redux
    - Adjusted all code that deals with the user accordingly
- Allowed for partial string searches (other than year since year is a Num) and case sensitivity 
- Fixed the login token issue where any logins after the initial one caused fetches to API to be unauthorized
- Fixed the empty list appearing on login rather than the full list of games

**Ver 0.6 (7-9-2023)**
- Changed favorited games function to work to see if the game is already favorited or not
- Changed the functionality of favoriting games so that the button to add or delete favorite games depends if it is already on the list
- Added same functionality of favoriting and checking favorite games to game cards
- Games list on the main page is now ordered based on series name
- Adjusted more of page styling to accomodate for responsive scren sizes and ensuring things are consistent and aligned
- Added more games onto the API to get a better feel of the functionality

**Ver 0.5 (7-30-2023)**
- Added navigation bar that changes based on if the user is logged in or not
- Added Route functionality and changed code accordingly so components use routes
- Added profile-view component to view user info and favorited gamse as well as functionality for changing user API for username, password, email, and birthday
- Added add and delete favorite game function to game-view, which pushes or deletes the game ID on the user's favoiteGame array

**Ver 0.4 (7-24-2023)**
- Added React Bootstrap Components and custom scss

**Ver 0.3 (7-23-2023)**
- Added loginview, signupview, updated mainview to accomodate for logins, signups, jwt tokens and local storage. Login/Signup appear as in the main view if users are not logged in, then once a user logs in, they will stay logged in with the jwt token and will see the list of games. Game and User APIs were also updated seperately to ensure everything was in camelCase

**Ver 0.2 (7-22-2023)**
- Added components mainview, gameview and gamecard so users can click and view details of games

**Ver 0.1 (7-17-2023)**
- Started up a new folder and git repository with packages, gitignore, and src files (index.html, index.scss, index.jsx)
- Installed Parcel and assigned the path to src/index.html and let it create the corresponding files
