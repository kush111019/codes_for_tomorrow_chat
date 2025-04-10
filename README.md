Description : User can register and after register he can login and logout. Till the time he is login he can see his own user profile and in the same way we can write other apis with are secured and thus required user to authenticate first . We are also doing the session management(Locally) and caching the data locally so to give user a better experience in terms of speed. If the user tries to login from other device he will be logout from the current device and the session will also be destroyed and the new session will be created for the second device . We are using session-only cookie and the jwt token will be sent in session-only cookie and that token will be sent in other secured apis which requires authentication. Along with this user can do chatting also . For that open the multiple cmd pannel equal to the number of user that will be involved in chat. They will be asked to input their userId and then roomId after that they can send message to all the users who are present in the room , means server will broadcast the message.

In order to run the apis first clone the project and then run the following commands
1) npm i
2) npx typeorm-ts-node-commonjs migration:run
3) npm run dev


In order to do test the chatting logic start the server first by giving the following commands from the root directory of the project folder
npm run dev
then open more than one cmd pannel and run the following command
npx tsc test-client.ts --outDir dist
node dist/test-client.js

and then you are good to go for chatting and hitting the api as well simultaneously

*I am also sharing the postman collection with it for your reference . Kindly check it also.

