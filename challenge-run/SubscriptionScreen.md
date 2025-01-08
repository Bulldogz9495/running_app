Implemented using revenue cat to manage apple subscriptions.
In apple subscriptions there are 4 products:
* Sponsor Tier
* Team Leader Tier
* Sponsor Tier Annual
* Challenge Team Leader Annual
These are connected to an offering in revenue cat called free_user_packages (not implemented for  good reasons. Simplifies revenue cat integration)
The free_user_packages offering contains 4 packages that are  linked to apple subscriptions:
* Challenge Team Leader - Monthly
* Challenge Team Leader - Annual
* Challenge Sponsor - Monthly
* Challenge Sponsor - Annual
This offering is received by the app and the products are displayed. Revenue cat also tracks current subscription level in a customer info object. This is used to hide the currently active subscription and to populate the active subscription / unsubscribe buttons.


### Next Step
When user makes payment must change role in mongo database
Need to add paywalls with redirects where they are required.
* Team Creation Button
* Send Challenge Button
Need  to add sponsor screen that can be navigated to.