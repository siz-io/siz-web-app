var React = require('react');

module.exports = function () {

  return (
    <video ref="video" muted>
      <source src={this.props.videoUrl} type="video/mp4"/>
    </video>
  )
};
