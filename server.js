// Run the application as follows to capture updates on the js and handlebars
//nodemon templateng-server.js -e js,hbs

const express = require('express');
// Including handlebars to help as template engine, all templates are stored in
// project/views
const hbs = require('hbs');
// print to file
const fs = require('fs');

// Making a new express App, just call the method
var app = express();
// Partials help us fill in code in our pages to avoid duplications
// takes the absolute path to the partial folder
hbs.registerPartials(__dirname + '/views/partials');
// Defining the view engine
app.set('viewengine', 'hbs');

// Adding express middleware, the order is executed in sequence

// Adding some custom middleware with app.use
// next tells express when the middleware function is done
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  // the following line adds content to a file
  fs.appendFile('server.log', log+'\n', (err) => {
    if (err) {
      console.log('A problem was found while saving the log');
    }
  });
  next(); // Always call next to let the server we are done with the middleware
});

// Check if we are on maintenance mode
// Adding a second middleware, in this case to set the site on maintenance mode
// app.use((req,res,next) => {
//   res.render('rightBack.hbs');
//   // If you don't call next then nothing else is displayed
// });

// __dirname takes the path where the files are located
app.use(express.static(__dirname + '/public'));

// Registering Handler Bars helpers are functions used to dynamically process
// updates. They take 2 args (name, function_to_execute)
hbs.registerHelper('getCurrentYear', () => {
  // this code will be executed inside the templates
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (theText) => {
  return theText.toUpperCase();
});

// Configuring a route handler for an http request
//app.get(url,function to run what will be sent back takes req and res as args)
app.get('/profile', (req,res) => {
  //res.send('<h1>Hello Express and Capucchino - Strong</h1>');
  // This is how easy you can send json data back
  res.send({
    name: 'Alex',
    lastname: 'Fraga',
    likes: [
      'Soccer',
      'Guitar',
      'Watching Movies'
    ],
    location: 'somewhere'
  });
});

// Adding a second route, notice the slash
app.get('/about', (req,res) => {
  // render is used to render the templates stored under /view
  res.render('about.hbs', {
    // this object will be used inside the hbs to dynamically update the page
    pageTitle: 'About Page',
    // removing so we use the helper function
    // currentYear: new Date().getFullYear()
  });
});

app.get('/', (req,res) => {
  res.render('home.hbs', {
    pageTitle: 'Home',
    welcomeMessage: 'You arrived to our home on the web',
    //currentYear: new Date().getFullYear(),
    callToAction: 'Start your trial today'
  })
})



// App.listen binds the application to a port in our machine, the second string
// is used to indicate a message
app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
