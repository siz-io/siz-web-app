var React = require('react'); // eslint-disable-line no-unused-vars

module.exports = function () {

  return (
    <video muted ref="video">
      <source src={this.props.video} type="video/mp4"/>
    </video>
  );
};
