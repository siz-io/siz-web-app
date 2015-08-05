/* beautify ignore:start */
import {Router} from 'express';
import {clientOs} from './utils';
/* beautify ignore:end */
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

stripsRouter.get('/stories/:slug', (req, res, next) => {
  req.apiCall('/stories?slug=' + req.params.slug)
    .then(body => {
      const os = clientOs(req);
      const forceStore = (req.app.get('tracking urls')[req.query.src] || {}).forceStore || false;
      if (os === 'android' && forceStore) return res.redirect('/get-the-app');
      res.locals.isIOS = (os === 'ios');
      res.locals.forceStore = forceStore;
      res.render('story', prepareStoryForRendering(req, body.stories));
    })
    .catch(err => {
      if (err.statusCode === 404) err.clientMsg = 'Strip not found...';
      next(err);
    });
});

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

stripsRouter.get('/ajax/rpc/check-strip/:id', (req, res, next) => {
  req.apiCall(`/stories/${req.params.id}`)
    .then(body => res.send({
      stories: [body.stories]
    }))
    .catch(err => {
      if (err.statusCode === 404) res.send({
        stories: []
      });
      else next(err);
    });
});
