if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const Joi = require('joi');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const MongoStore = require('connect-mongo');


const { nextTick } = require('process');

const userRoutes = require('./routes/users');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');

const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

//'mongodb://localhost:27017/yelp-camp')

mongoose.connect(dbURL);
const db=mongoose.connection;
db.on('error', console.error.bind(console, 'connection error : '));
db.once('open', function (){ 
    console.log('MONGO CONNECTION OPEN!!!')
});

const app = express();
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))// realiza um parse no req.body do app.post
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());// protege o query de comandos externos

const secret = process.env.SECRET || 'thisismysecret';

const store = MongoStore.create({
    mongoUrl: dbURL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e )
})

const sessionConfig = {
    store,
    name: 'blahh',// nome para o cookie, fugir do padrão Connect_sid
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,//segurança do cookie
        //secure: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash());
//app.use(helmet());

// especificando locais permitidos para obtenção de imagens, fontes ... etc 

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/di5zsfn8r/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/di5zsfn8r/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/di5zsfn8r/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/di5zsfn8r/" ];
 
app.use(
    helmet({
        contentSecurityPolicy: {
            directives : {
                defaultSrc : [],
                connectSrc : [ "'self'", ...connectSrcUrls ],
                scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
                styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
                workerSrc  : [ "'self'", "blob:" ],
                objectSrc  : [],
                imgSrc     : [
                    "'self'",
                    "blob:",
                    "data:",
                    "https://res.cloudinary.com/di5zsfn8r/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                    "https://images.unsplash.com/"
                ],
                fontSrc    : [ "'self'", ...fontSrcUrls ],
                mediaSrc   : [ "https://res.cloudinary.com/di5zsfn8r/" ],
                childSrc   : [ "blob:" ]
            }
        },
        crossOriginEmbedderPolicy: false
    })
);

app.use(passport.initialize());// sempre inicializar passport embaixo da inicialização de session
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
    res.locals.currentUser = req.user;// usado para saber se há um current user, ous seja, ver se tem alguem logado
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);// definindo que todas as rotas em campgrounds comecem com /camgrounds
app.use('/campgrounds/:id/reviews', reviewsRoutes)
 
app.get('/', (req, res)=> {
    res.render('home')
})

//---------------------------------------------------------------------------------------------------------------------

app.all('*', (req, res, next) => {// *seginifica para todas as rotas, esse caso so roda caso nada acima rode.
    next(new ExpressError('Page not  Found', 404))
} )

app.use( (err, req, res, next) => {
    const { statusCode = 500} = err;
    if(!err.message) err.message = 'OH no, Something went wrong';
    res.status(statusCode).render('error', {err})
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})


