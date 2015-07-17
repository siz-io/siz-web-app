/* beautify ignore:start */
import {Router} from 'express';
/* beautify ignore:end */
import useragent from 'useragent';
import apiMiddleware from './api';

const stripsRouter = Router(); // eslint-disable-line new-cap
export default stripsRouter;

stripsRouter.use(apiMiddleware);

// Trending strips
stripsRouter.get('/trending', (req, res, next) => {
  const page = Math.min(Math.max(Math.floor(Number(req.query.page)), 0), 10) || 1;
  req.apiCall('/stories?limit=' + page * 5)
    .then(body => res.render('trending', {
      stories: body.stories.slice((page - 1) * 5),
      currPage: page,
      nextPage: page === 10 ? 0 : page + 1,
      prevPage: page - 1
    }))
    .catch(next);
});

// Strip
stripsRouter.get('/stories/:slug', (req, res, next) => {
  req.apiCall('/stories?slug=' + req.params.slug)
    .then(body => {
      const story = body.stories;
      story.shareUrl = req.protocol + '://' + req.headers.host + '/stories/' + story.slug;
      story.encodedShareUrl = encodeURIComponent(story.shareUrl);
      story.JSON = JSON.stringify(story).replace(/\//g, '\\/');
      res.locals.isIOS = (useragent.lookup(req.headers['user-agent']).os.family === 'iOS');
      res.render('story', story);
    })
    .catch(err => {
      if (err.statusCode === 404) err.clientMsg = 'Strip not found...';
      next(err);
    });
});

// Embedded Strip
stripsRouter.get('/embed/:slug', (req, res, next) => {
  req.apiCall('/stories?slug=' + req.params.slug)
    .then(body => {
      const story = body.stories;
      if (!story) throw new Error();
      story.shareUrl = req.protocol + '://' + req.headers.host + '/stories/' + story.slug;
      story.embedUrl = req.protocol + '://' + req.headers.host + '/embed/' + story.slug;
      story.encodedShareUrl = encodeURIComponent(story.shareUrl);
      story.JSON = JSON.stringify(story).replace(/\//g, '\\/');
      res.render('embed', story);
    })
    .catch(err => {
      if (err.statusCode === 404) {
        err.view = 'black';
        err.clientMsg = 'Strip not found...';
      }
      next(err);
    });
});
