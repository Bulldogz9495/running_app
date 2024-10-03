The challenge screen is where users can see their teams and team scores. It is a navigable screen within the [[Mobile App]]. This screen is devoted to challenges, scores, and teams. It allows a user to view other users activity. This screen contains:
* A list of teams that the user is a member of and displays the team scores - Each team is expandable by clicking to see the team roster. The team components display Name, Motto, Last Challenge Score, Last Challenge Date, Team Size
* Create new team button that accesses the [[InviteMembersScreen]].
* If the team is owned by the user then an edit team button is available that accesses the [[InviteMembersScreen]].

## Buttons
When a team is clicked it will expand and show the list of users
When the edit team button is clicked a team form is rendered with the team info given and an edit team function that hits /Teams/{Team Id} with a patch request
When the create new team button is clicked a team form is rendered with blank team info and a create team function that hits /Teams with a post request