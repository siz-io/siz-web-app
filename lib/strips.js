/* beautify ignore:start */
import {Router} from 'express';
/* beautify ignore:end */
import useragent from 'useragent';
import apiMiddleware from './api';

const stripsRouter = Router(); // eslint-disable-line new-cap
export default stripsRouter;

stripsRouter.use(apiMiddleware);

const prepareStoryForRendering = (req, story) => {
  story.oneGifClass = (story.boxes.length === 1) ? 'one-gif' : '';
  story.embedUrl = req.protocol + '://' + req.headers.host + '/embed/' + story.slug;
  story.shareUrl = req.protocol + '://' + req.headers.host + '/stories/' + story.slug;
  story.encodedShareUrl = encodeURIComponent(story.shareUrl);
  story.JSON = JSON.stringify(story).replace(/\//g, '\\/');
  return story;
};

// Trending strips
stripsRouter.get('/trending', (req, res, next) => {
  const page = Math.min(Math.max(Math.floor(Number(req.query.page)), 0), 10) || 1;
  req.apiCall('/stories?limit=' + page * 5)
    .then(body => res.render('trending', {
      stories: body.stories.slice((page - 1) * 5).map(prepareStoryForRendering.bind(null, req)),
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
      res.locals.isIOS = (useragent.lookup(req.headers['user-agent']).os.family === 'iOS');
      res.render('story', prepareStoryForRendering(req, body.stories));
    })
    .catch(err => {
      if (err.statusCode === 404) err.clientMsg = 'Strip not found...';
      next(err);
    });
});

// Embedded Strip
stripsRouter.get('/embed/:slug', (req, res, next) => {
  req.apiCall('/stories?slug=' + req.params.slug)
    .then(body => res.render('embed', prepareStoryForRendering(req, body.stories)))
    .catch(err => {
      if (err.statusCode === 404) {
        err.view = 'black';
        err.clientMsg = 'Strip not found...';
      }
      next(err);
    });
});
