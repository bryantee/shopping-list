exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABABASE_URL || (process.env.NODE_ENV === 'production' ? 'mongodb://bryan:shoppylists123@ds023054.mlab.com:23054/shopping-list' : 'mongodb://localhost/shopping-list-dev');
exports.PORT = process.env.PORT || 8080;
