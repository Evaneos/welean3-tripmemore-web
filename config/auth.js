// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
	'facebookAuth' : {
		'clientID' 		: '936656436349374', // your App ID
		'clientSecret' 	: '47eb23264986f8dc3948d5b415776c69', // your App Secret
		'callbackURL' 	: 'http://tripmemore.com:8080/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'ZsUbOSbGyPhu0yi6NcXTVF90q',
		'consumerSecret' 	: 'c1saiaoYyM4HSYhURcbTOebaykWk4YflqBKWostC009xxDAdyC',
		'callbackURL' 		: 'http://tripmemore.com:8080/auth/twitter/callback'
	}
	/*,

	'googleAuth' : {
		'clientID' 		: 'your-secret-clientID-here',
		'clientSecret' 	: 'your-client-secret-here',
		'callbackURL' 	: 'http://localhost:8080/auth/google/callback'
	}*/

};