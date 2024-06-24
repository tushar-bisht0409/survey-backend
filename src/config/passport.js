var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;

var Admin = require("../models/admin");

module.exports = function (passport) {
    var opts = {};

    opts.secretOrKey = process.env.SECRET;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    
    passport.use(new JwtStrategy(opts, function(jwt_payload, done){
        Admin.find({
            id: jwt_payload.id
        }, function(err,admin){
            if(err){
                return done(err,false);
            }
            if(admin){
                return done(null, admin);
            }
            else{
                return done(null,false);
            }
        });
    })
    )
};