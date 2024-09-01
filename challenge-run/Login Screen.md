This screen is the starting point for the [[Mobile App]]. It contains 2 user inputs and 2 buttons. The 2 user inputs are:
* user email
* password
and the buttons are
* Login
* Create new user

## Inputs
Both inputs are stored as react state variables and the values default to "user1@example.com" and "test password"
## Buttons
When the login button is pressed, an api call is made to the backend endpoint /token with the state username and password. This token is then saved to async storage and can be accessed anywhere in the app. Then the token is used to access the user data with another api call to /Users/username with the access token in the headers. Then the user data is set as a global state variable to the global user state. Finally there is a useEffect hook monitoring the user state and on change navigates to main.

When the create new user button is pressed, a post api call is made to /User containing the desired username and password. Once this has succeeded the standard login process described above is executed.


## Future Steps
* Save user login information for future login
* Set up an auto checker for on startup does existing api key still work - If so autologin