var React = require('React');
var ReactSlider = require('./react-slider-patched');

module.exports = function () {

var s = this.state.data;
var gifs = s.get('gifs');

return (
<div className="editor">
  <div className="preview">
    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/LWOYM9R7QGE?autoplay=0&autohide=1&controls=1&enablejsapi=1&iv_load_policy=3" frameBorder="0"></iframe>
    <div className="gif-selectors">
      <a href="#" onClick={this.onClickSelector.bind(this, 0)} className={'btn gif-selector gif-selector1 ' + gifs.get(0).get('status')}><img src="/static/img/scissors.png"/><span>1</span></a>
      <a href="#" onClick={this.onClickSelector.bind(this, 1)} className={'btn gif-selector gif-selector2 ' + gifs.get(1).get('status')}><img src="/static/img/scissors.png"/><span>2</span></a>
      <a href="#" onClick={this.onClickSelector.bind(this, 2)} className={'btn gif-selector gif-selector3 ' + gifs.get(2).get('status')}><img src="/static/img/scissors.png"/><span>3</span></a>
      <a href="#" onClick={this.onClickSelector.bind(this, 3)} className={'btn gif-selector gif-selector4 ' + gifs.get(3).get('status')}><img src="/static/img/scissors.png"/><span>4</span></a>
    </div>
  </div>
  <div className="gifs">
    <div className="gif gif1">
      <a className="btn" href="#">1</a>
    </div>
    <div className="gif gif2">
      <a className="btn" href="#">2</a>
    </div>
    <div className="gif gif3">
      <a className="btn" href="#">3</a>
    </div>
    <div className="gif gif4">
      <a className="btn" href="#">4</a>
    </div>
    <a href="#" onClick={this.onClickCreateStrip} className="btn valid create-btn">Create strip</a>
  </div>
  <div className={'scissors-indicator ' + (s.get('gifIndicator') ? '' : 'hidden')}>
    <img src="/static/img/scissors.png"/>
    <span>{s.get('gifIndicator')}</span>
  </div>
  <div className="gif-preview">
    <div className="tutorial">
      <p>1. Navigate in the video</p>
      <p>2. Click on a number to capture a highlight</p>
      <p>3. Adjust it with the tool below</p>
    </div>
  </div>
  <div className="timeline">
    <svg className="pointy-cursor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10" preserveAspectRatio="none">
      <polygon points="10 0 20 10 0 10" fill="#222"/>
    </svg>
    <div className="track">
      <ReactSlider defaultValue={[30, 40]} max={69} minDistance={10} pearling withBars onChange={this.onTimelineChange}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 10" preserveAspectRatio="none">
          <polygon points="5 0 0 5 5 10" fill="#fff"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 10" preserveAspectRatio="none">
          <polygon points="0 0 5 5 0 10" fill="#fff"/>
        </svg>
      </ReactSlider>
    </div>
  </div>
</div>

)}
