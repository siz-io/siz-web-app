var React = require('react');

module.exports = function () {

  return (
    <video ref="video" muted>
      <source src={this.props.video} type="video/mp4"/>
    </video>
  )
};
