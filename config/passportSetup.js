const passport = require('passport');
const bcrypt = require('bcrypt');
const GoogleStrategy = require('passport-google-oauth20');
const LocalStrategy = require('passport-local');
const User = require('../models/userModel');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then(user => done(null, user));
});

passport.use(
	new GoogleStrategy(
		{
			// Options
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: '/auth/google/redirect'
		},
		async (accessToken, refreshToken, profile, done) => {
			// Callback function
			const user = await User.findOne({ googleId: profile.id });
			if (user == null) {
				// Create a new user
				const newUser = await new User({
					username: profile.displayName,
					googleId: profile.id,
					email: profile.emails[0].value
				})
					.save()
					.catch(err => {
						return done(null, false, {
							message: 'Email already taken.'
						});
					});
				return done(null, newUser);
			} else {
				// Check if email is taken
				return done(null, user);
			}
		}
	)
);

passport.use(
	new LocalStrategy(
		{ usernameField: 'email', passReqToCallback: true },
		async (req, email, password, done) => {
			const user = await User.findOne({ email: email });

			if (user) {
				if (
					user.password &&
					(await bcrypt.compare(password, user.password))
				) {
					// Successful login
					return done(null, user);
				} else {
					return done(
						null,
						false,
						req.flash('message', 'Incorrect password.')
					);
				}
			} else {
				return done(null, false, req.flash('message', 'Incorrect email.'));
			}
		}
	)
);
