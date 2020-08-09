import React from 'react';

class GameTile extends React.Component {
  render() {
    return (
      <div
        className={`tile ${ this.props.value === 0 ? 'hidden' : ''}`}
        onClick={(evt) => this.props.onClick(evt)}>
        {this.props.value}      
      </div>
    );
  }
}

export default GameTile;
