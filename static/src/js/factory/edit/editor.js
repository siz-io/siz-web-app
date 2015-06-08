var React = require('react/addons');
var PureRenderMixin = React.addons.PureRenderMixin;
var I = require('immutable');
var store = require('./store');
var dispatcher = require('./dispatcher');
var actions = require('./actions');

module.exports = React.createClass({
  displayName: 'Editor',
  mixins: [PureRenderMixin],

  getInitialState: function () {
    return {
      data: I.fromJS({
        gifs: [{
          status: 'pending'
        }, {
          status: 'pending'
        }, {
          status: 'pending'
        }, {
          status: 'pending'
        }],
        gifIndicator: ''
      })
    };
  },

  componentDidMount: function () {
    store.on('change', function () {
      var storeState = store.state;
      var activeGifIdx = storeState.get('activeGifIdx');
      this.setState(function (state) {
        return {
          data: state.data
            .set('gifIndicator', [1, 2, 3, 4][activeGifIdx])
            .set('gifs', storeState.get('gifs').map(function (gif) {
              return gif.set('status', gif.get('start', false) ? 'valid' : 'pending');
            }))
            .setIn(['gifs', activeGifIdx, 'status'], 'active')
        };
      });
    }.bind(this));
  },

  onClickSelector: function (selectorIdx, e) {
    e.preventDefault();
    dispatcher.dispatch({
      type: actions.SET_ACTIVE_GIF,
      index: selectorIdx
    });
  },

  onClickCreateStrip: function (e) {
    e.preventDefault();
    dispatcher.dispatch({
      type: actions.CREATE_STRIP
    });
  },

  onTimelineChange: function (value) {
    console.log('onTimelineChange: ', value);
  },

  render: require('./editor.jsx')
});
