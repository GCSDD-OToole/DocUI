# DocUI

This is a proof of concept Document UI intended to help manage C++ comments
for students in the UW Bothell GCSDD program.

This is not actually a productivity tool yet, but hopefully it will grow into
a useful project very soon.

## Creating a Personal Access Token
You need to create a Personal Access Token for your github account.

 * click on your profile icon and select settings
 * select "Developer Settings" on the left
 * select "Personal access tokens" on the left
 * Generate new token at the top
 * Notes: "Development token for DocUI"
 * Expiration: something less than 30 days, you can always make another one
 * Select Scopes
    * repo: all
    * user: only "read:user" so we can get your username for the comments
 * Generate token and copy and paste it somewhere safe! This is your only time you will see it

The only permissions that you need right now are:

 * repo: all
 * user: only "read:user" so we can get your username for the comments


## How to Use it
 * Copy in your Token in the first box
 * Type in the name of your project in the next box
 * Click "Try It!"

### Assumptions and Limitations
There are a couple of assumptions that this very limited tool needed to make
 * all of your files need to be in the top level (i think?)
 * you need to own the repo that you want to check
 * it only generates some pretty boring comments

## Other
If there are any questions, let me know. I will try to keep this document up
to date as I get questions.
