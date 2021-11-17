
## This is simple messenger that its API is written by Node js, and the Frontend written by React.

###### You can send text and audio message and also photo.

## Modules [Frontend]
this messenger uses a number of open source modules to work properly:
- [React-js] - for UI creation
- [React-Bootstrap] - for styling components
- [socket.io-client] - for client-side real-time communication

## Modules [Backend] api
- [Express] - fast [node.js](https://nodejs.org/) network app framework
- [MongoDB] - storing data
- [Socket.io] - for server-side real-time communication
- [Passport-js] - for user authentication

## How to run API

At first you should Install the api dependencies and devDependencies and start the server.

You should install MongoDB before.
```sh
cd messenger-master/server
npm i
mongod
npm run dev
```

## How to run Frontend

Now you should Install the frontend dependencies and run the Frontend.

```sh
cd messenger-master/client
npm i
npm start
```
The frontend is available at http://localhost:3000


![User one](https://github.com/alinowrouzii/messenger/blob/master/md/user-one.gif)





   [React-js]: <https://reactjs.org/>
   [React-Bootstrap]: <https://react-bootstrap.github.io/>
   [Socket.io]: <https://socket.io/>
   [Socket.io-client]: <https://www.npmjs.com/package/socket.io-client>
   [express]: <http://expressjs.com>
   [Passport-js]: <http://www.passportjs.org/>
   [MongoDB]: <https://www.mongodb.com/>
   