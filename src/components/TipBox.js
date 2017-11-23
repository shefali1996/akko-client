import React from 'react';

class TipBox extends React.Component {
  render() {
    return(
      <div className="description-view margin-t-40 text-center">
        <span className="select-style-comment">
          <b><u>Tip:</u></b> COGS is the cost of buying one unit of the product from your vendor.
        </span>
      </div>
    )
  }
}

export default TipBox;
