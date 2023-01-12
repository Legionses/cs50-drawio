# CS50-Drawio

Github repo: https://github.com/Legionses/cs50-drawio

### Video Demo: https://youtu.be/9sBw7DBxNQE
### Description: 
The CS50-drawio is an WEB collaboration tool for sharing ideas or play mini-games on canvas by real-time interaction between users.

### Features:
- Impress yourselves on the canvas by drawing your ideas on it.
- Real-time connection between users, which gives possibility to exchange ideas with others immediately.
- Erase canvas on "Reset" button when your ideas overflowed available space and need a new one.
- Change color of your brush  by pressing color palette input. Make your ideas bright!

### How to start the project:
The project consist of two folders, which are two parts:
- The client;
- The server;

To start each part you should run following commands in root folder:
- `npm run install-project` to install project dependencies; 
- `npm run start-project` to start the project. Runs the app in the development mode. Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.;

### Project Architecture:
#### The Client Side
Client side is frontend web client developed using React.js library. Create-react-app is used as common platform for React.js application.
Why the React.js was used as Frontend library:
- Declarative. React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.
- Component-Based. Build encapsulated components that manage their own state, then compose them to make complex UIs. Since component logic is written in JavaScript instead of templates, you can easily pass rich data through your app and keep state out of the DOM.
- Versatile. you can develop new features in React without rewriting existing code.
  
React has been designed from the start for gradual adoption, and you can use as little or as much React as you need. Whether you want to get a taste of React, add some interactivity to a simple HTML page, or start a complex React-powered app, the links in this section will help you get started

#### The Server Side

Server side is Node.js simple server, which handles http queries and socket connection between server and clients.
The advantages of Node.js are:
- JavaScript. If you know javaScript well, you can easily develop server side for your web based application, no need to lear another language.
- Code sharing and reuse.
- Speed and performance.
- Rich ecosystem: Node.JS libraries and tools. One initialism – npm, a default Node.js package manager — also serves as a marketplace for open source JavaScript tools, which plays an important role in the advance of this technology.

#### Client - Server Interactions
The application idea required real-time interaction between users, the websocket helps us to do it.
Every client is connecting to the server via WebSocket API in the beginning. Dedicated to API communication, this protocol enabled bi-directional communication. It is capable of fetching real-time data.  Build over TCP, WebSocket makes real-time data push to a client. It used to display users canvas interactions on real-time on other clients.
