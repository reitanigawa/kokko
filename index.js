var fs            = require('fs'),
    path          = require('path'),
    util          = require('util'),
    http          = require('http'),
    express       = require('express'),
    emptyPort     = require('empty-port'),
    colors        = require('colors'),
    opn           = require('opn'),
    localIP       = require('./lib/localIP'),
    marked = require('marked');

var Kokko = function (root, opt) {
    colors.setTheme({
        info  : 'green',
        warn  : 'yellow',
        error : 'red'
    });

    if (!fs.existsSync(root)) {
        console.error('%s does\'nt exist.'.error, root);
        return;
    }
    console.log('document root\t: %s'.info, root);

    this.root     = root;
    this.openPath = opt.openPath;
    this.staticPort = opt.staticPort;
    this.encode = opt.encode;

};

Koko.prototype.start = function () {
    this.startServer(function (err) {
        if (err) {
            console.error((err + '').error);
            process.exit();
        }

        if (!this.openPath) {
            return;
        }

        this.open();
    }.bind(this));
};

Kokko.prototype.startServer = function (callback) {
    var encode = this.encode;
    var app  = express();

    app.use(express.static(this.root,{setHeaders: function (res, path, stat) {
            console.log('[open %s]'.info, `text/plain;charset=${encode}`);
            res.set('Content-Type', `text/plain;charset=${encode}`);
          }}));
    app.use(express.directory(this.root));
}
Koko.prototype.open = function (callback) {
    callback = callback || function () {};

    var openPath = this.openPath;

    var host = localIP()[0] || '127.0.0.1';
    var port = this.port;

    var openURL = [
        'http://' + host + ':' + port,
        openPath.replace ? openPath.replace(/^\//, '') : ''
    ].join('/');

    console.log('[open %s]'.info, openURL);
    opn(openURL).then(callback);

};

module.exports = Kokko;
