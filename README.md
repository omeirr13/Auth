# Authorization vs Authentication

## Authentication(logging in)
- proving we are who we say we are.
- essentially step of logging into a website, we give email and password it verifies our email and password are correct, and now the site know we are who we say we are.

## Authorization(permissions we have)
- do you have permission to do this thing?
- there are levels of users(different roles and permissions)
- we could be admin user, guest, normal user

- that the user who is sending request to the server, is the same user who logged in.

- Once we are authenticated as our self, then the server can authorize us to do certain things.
- who idea of auth is: it happens on the server because we cannot trust the client.

- the way server and the client communicate with each other is by request.
- if we want to login client is going to send request to the server with your email and password, is this person a valid user..who is this person with these credentials, and server returns this is who they are.
- when server will send the response, if credentials are correct, the server will create a session

### Session:
- a unique id specifically associated with a specific person
- this unique id is how the server determines this is always you when you make further requests, it will send that id to client in response.
- the client will save that unique id in a cookie, that way everytime we mmake a future request that requires authorization, that cookie that has specific id is going to be sent along with the request.


### Scenario:
- lets say we click on a button to try and delete someone elses youtube channel, the owner of that youtube channel has that permission and nobody else...with the request its gonna send that cookie with the id to the server, and says does john have permission to delete that youtube channel..and proceeds according to that.

- important thing: everything that is validation that the user can do what they want to do, or validating that the user is who they say they are is happening on the server, we wont check email and passwords on the client, and we wont apply people to delete youtube channels from the client, all the validations, all the source of truths must come from the client, because we cannot trust the client

- its perfectly okay to show and hide ui, but actual authentication and authorization needs to be done on the server.

- even if we tried to do something on the client, we would be authorized first on the server with our session id in the cookie, and would proceed according to that.



### What is JWT
- JSON web token, is used for authorization, authorization is normally done using session



### Why to use JWT:
- lets say we have two different servers
1) a bank: that has runs all banking application, website etc
2) retirement: retirement plans on a separate web application

- we want if user logged in bank, automatically logged in retirement 
- this is really common in large scale applications

- if we were using session based authorization: session stored in the bank and not in retirement server, and not in retirement server, so user needs to log back in, because session id from the client is not found on the retirement server..

- but using jwt, if we use the same secret key, between both bank and retirement server, we just need to send same jwt from client to both, and we will be authenticated without logging in.