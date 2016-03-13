//#region CCONSTANTS
var strParamId = 'id',
    strParamClient = 'client',
    strParamSecret = 'secret',
    strParamRegistered = 'registered',
    strParamIsGeneric = 'isGeneric',
    strParamBlogName = 'blogName';

function User(params) {
    this.id = params[strParamId];
    this.client = params[strParamClient];
    this.secret = params[strParamSecret];
    this.registered = params[strParamRegistered];
    this.isGeneric = params[strParamIsGeneric];
    this.blogName = params[strParamBlogName];
}

User.findOrCreate = function(options, callback) {
    switch (options['method']) {
        case 'tumblr':
            var options = {
                id: options['tumblrId'],
                client: options['tumblrToken'],
                secret: options['tumblrSecret'],
                isGeneric: false
            };
            console.log("user not found.");
            var user = new User(options);
            callback(null, user);
            break;
    }
};
module.exports = User;
