var React = require('react');
var ReactSlider = require('./react-slider-patched');
var Gif = require('./gif-youtube');
var c = require('./constants');

module.exports = function () {

  var s = this.state.data;
  var gifs = s.get('gifs');
  var activeGif = this.getActiveGif(gifs);
  var video = this.props.video;
  var gif0 = gifs.get(0);
  var gif1 = gifs.get(1);
  var gif2 = gifs.get(2);
  var gif3 = gifs.get(3);

  return (
    <div className="editor">
      <div className="preview">
        <div ref="preview"></div>
        <div className="gif-selectors">
          <a href="#" onClick={this.onClickSelector.bind(this, 0)} className={'btn gif-selector gif-selector1 ' + this.getGifSelectorClass(gif0)}><img src="/static/img/scissors.png"/><span>1</span></a>
          <a href="#" onClick={this.onClickSelector.bind(this, 1)} className={'btn gif-selector gif-selector2 ' + this.getGifSelectorClass(gif1)}><img src="/static/img/scissors.png"/><span>2</span></a>
          <a href="#" onClick={this.onClickSelector.bind(this, 2)} className={'btn gif-selector gif-selector3 ' + this.getGifSelectorClass(gif2)}><img src="/static/img/scissors.png"/><span>3</span></a>
          <a href="#" onClick={this.onClickSelector.bind(this, 3)} className={'btn gif-selector gif-selector4 ' + this.getGifSelectorClass(gif3)}><img src="/static/img/scissors.png"/><span>4</span></a>
        </div>
      </div>
      <div className="gifs">
        <div className="gif gif1">
          <a className={'btn ' + this.getGifSelectorClass(gif0)} href="#">1</a>
          {(gif0.get('endMs') > 0) &&
            <div className="gif-hover-container" onClick={this.onClickGif.bind(this, 0)} onMouseEnter={this.onMouseEnterGif.bind(this, 0)} onMouseLeave={this.onMouseLeaveGif.bind(this, 0)}>
              <Gif startMs={gif0.get('startMs')} endMs={gif0.get('endMs')} playing={gif0.get('playing')} video={video}/>
            </div>
          }
        </div>
        <div className="gif gif2">
          <a className={'btn ' + this.getGifSelectorClass(gif1)} href="#">2</a>
          {(gif1.get('endMs') > 0) &&
            <div className="gif-hover-container" onClick={this.onClickGif.bind(this, 1)} onMouseEnter={this.onMouseEnterGif.bind(this, 1)} onMouseLeave={this.onMouseLeaveGif.bind(this, 1)}>
              <Gif startMs={gif1.get('startMs')} endMs={gif1.get('endMs')} playing={gif1.get('playing')} video={video}/>
            </div>
          }
        </div>
        <div className="gif gif3">
          <a className={'btn ' + this.getGifSelectorClass(gif2)} href="#">3</a>
          {(gif2.get('endMs') > 0) &&
            <div className="gif-hover-container" onClick={this.onClickGif.bind(this, 2)} onMouseEnter={this.onMouseEnterGif.bind(this, 2)} onMouseLeave={this.onMouseLeaveGif.bind(this, 2)}>
              <Gif startMs={gif2.get('startMs')} endMs={gif2.get('endMs')} playing={gif2.get('playing')} video={video}/>
            </div>
          }
        </div>
        <div className="gif gif4">
          <a className={'btn ' + this.getGifSelectorClass(gif3)} href="#">4</a>
          {(gif3.get('endMs') > 0) &&
            <div className="gif-hover-container" onClick={this.onClickGif.bind(this, 3)} onMouseEnter={this.onMouseEnterGif.bind(this, 3)} onMouseLeave={this.onMouseLeaveGif.bind(this, 3)}>
              <Gif startMs={gif3.get('startMs')} endMs={gif3.get('endMs')} playing={gif3.get('playing')} video={video}/>
            </div>
          }
        </div>
        <a href="#" onClick={this.onClickCreateStrip} className="btn valid create-btn">Create strip</a>
      </div>
      <div className={'scissors-indicator ' + (this.getGifIndicator(gifs) ? '' : 'hidden')}>
        <img src="/static/img/scissors.png"/>
        <span>{this.getGifIndicator(gifs)}</span>
      </div>
      <div className="gif-preview">
        <div className="tutorial">
          <p>1. Navigate in the video</p>
          <p>2. Click on a number to capture a highlight</p>
          <p>3. Adjust it with the tool below</p>
        </div>
        {
          activeGif &&
          <Gif
            startMs={activeGif.get('startMs')}
            endMs={activeGif.get('endMs')}
            playing={!s.get('seeking') && this.isPreviewPlaying(gifs)}
            video={video}/>
        }
      </div>
      <div className="timeline">
        <svg className="pointy-cursor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10" preserveAspectRatio="none">
          <polygon points="10 0 20 10 0 10" fill="#222"/>
        </svg>
        <div className={'track ' + (activeGif ? '' : 'disabled')}>
          <ReactSlider
            value={s.get('timeline').get('value').toJS()}
            max={c.MAX_FRAMES-1}
            minDistance={c.MIN_FRAMES}
            pearling
            withBars
            onChange={this.onTimelineChange}
            onAfterChange={this.onTimelineRelease}>
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
  )
};
