# Tumblr Slideshow Web-App

## About
A Node.js application which displays photos from a tumblr user's dashboard as a slideshow. Completely free to use and extend.

![Example slideshow](http://i.imgur.com/UUfIqYL.png)

## Features
- Tumblr login system
- Like, re-blog, unsubscribe blogger, and subscribe original blogger.
- Background mimics pictures' dominant color.
- View individual users' posts as slideshow.

### Demo
[http://tumblrslideshow.herokuapp.com](http://tumblrslideshow.herokuapp.com)

### Getting Started
1. Clone it
   * `git clone --depth 1 https://github.com/jmbeach/TumblrSlideshow.git`
     * Note: `--depth` flag just makes it not get everything so it clones faster. If you think you'll need more of the history, just remove the flag
2. Switch to the new folder
   * `cd TumblrSlideShow`
3. Install dependencies
   * `npm install`
4. Add a file to the `config` folder named `default.json`. The contents should look something like the following:

```js
{
	"Tumblr": {
	"appKey": "<your-app-key>",
	"appSecret": "<your-app-secret>"
	},
	"Debug": {
	"port":<localhost-port-to-debug-on>
	}
}
```

   * You will need to have your own Tumblr app-key and app-secret. This is not hard to do, just go to [Tumblr's app registration page](https://www.tumblr.com/oauth/register) and create a new app with any name you like, some sort of description and a callback url of `http:localhost/auth/tumblr/callback` and you'll be all set.
   * After you create it, you can view it's app key (really called OAuth Consumer Key) and it's secret key [here](https://www.tumblr.com/oauth/apps).
4. Finally, run `node server.js` to start serving the app
