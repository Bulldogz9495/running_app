This screen is for inviting new teammates to users team. It contains a picker spinner with multiple options for inviting new teammates. It has a search bar for searching for users by email or first and last name, a search button that will execute the search and populate the list of search results. Each result has an extend invitation button. Finally there is a back to team page button.

## Inputs
* Spinner - Contains 3 choices: email, name, contact. 
	* Email will set the invite screen to searching by existing users by email. 
	* Name will set the screen to search existing users by first and last name. 
	* Contact will open sms messages and the user can select from their contacts or insert a number. The message will be preloaded with an invitation link (challenge-run://invitation/${encodedInvitationId}) and a link to the app download in the app store.
* Input fields:
	* Email - Single field titled email that is used as the search keyword (saved in a state variable)
	* Name - 2 fields that are used as the search keyword (saved in state variables)
	* Contact - Open SMS ios messages
* Search Button - Triggers an api call to /search/Users?${urlParams.toString()} 
* Search Results - List populated by search button results
	* Invite Button - When clicked 2 api calls are made. Then the search state is reset.
		* a post call to /Teams/${teamId}/invitations/${user.id}?invitation_id=${encodedInvitationId}`
		* a post call to /Users/${user.id}/messages
* Back to team button send user back to the team form

#### Invite by Email:
When the invite user by email button is clicked 2 api calls are made. 
* /Users/${user.id}/messages - to post a message to the invited user
* /Teams/${teamId}/invitations/${user.id}?invitation_id=${encodedInvitationId} - to post the invitation to the team
#### Invite by Name
When the invite user by Name button is clicked 2 api calls are made. 
* /Users/${user.id}/messages - to post a message to the invited user
* /Teams/${teamId}/invitations/${user.id}?invitation_id=${encodedInvitationId} - to post the invitation to the team

#### Invite by contact (sms message)
When the invite user by sms button is clicked, the devices message app is opened (ios). This message is prepopulated with 2 links and some text. The two links are the link to download the app and the link to the invitation. The app will also send the "open ended" invitation to the team. Both the invitation link in the sms message and the team invitation api post contain the same invitation id.