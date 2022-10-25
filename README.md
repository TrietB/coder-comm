# Requirement:

[]User can delete a Post that he/she is the author.
   # API: DELETE /api/posts/:id 
[]User can edit his/her Posts.
   # API: PUT /api/posts/:id 
[]User can delete the Comment that he/she wrote.
   # API: DELETE /api/comments/:id 
[]After User decided to delete a Post/Comment, a window will pop up asking for confirmation.
[]User can see a list of requests that he/she has sent. On the list, User can cancel the requests.
   # API: GET /api/friends/requests/outgoing