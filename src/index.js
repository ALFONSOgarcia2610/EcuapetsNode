if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();   
}

const express = require ('express');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const router = require('./routes/index');
// Inicialisaciones 
const app = express();
require('./database');
require('./config/passport');
// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');
// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});
app.use(multer({storage}).single('image'));
app.use(methodOverride('_method'));
app.use(session({
secret: 'myappsecreta',
resave: false,
saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
// Routes
app.use(require('./routes/index'));
app.use(require('./routes/mascotas'));
app.use(require('./routes/users'));
// Static Files
app.use(express.static(path.join(__dirname, 'public')));
// Iniciar Servidor 
app.listen(app.get('port'), () => {
 console.log('Server on port', app.get('port'));
 console.log('Entorno', process.env.NODE_ENV);   
});

module.exports = router;
