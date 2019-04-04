import React, { Component } from 'react'
import { Button } from "react-bootstrap";
import Spin from "antd/lib/spin";
import "antd/lib/spin/style";

export default class CostOfGoods extends Component {
  render() {
    const { data:{data}, data:{isLoading} } = this.props;
    const totalVariants = data.num_variants || 0;
    const variantsWithoutCogs = data.num_variants_missing_cogs || 0;
    const variantsWithCogs = totalVariants - variantsWithoutCogs;
    return (
      <div className="cogsof-good-container">
      <div>
         <div className="text-center">
            {isLoading ? <span className="update-style-text"><Spin /></span> : null}
            <span className="update-style-text margin-t-20">
              You have <strong>{totalVariants}</strong> products/variants.
            </span>
            <span className="update-style-text margin-t-20">
              <strong>{variantsWithCogs}</strong> products have COGS set.
            </span>
            <span className="update-style-text margin-t-20">
              <strong>{variantsWithoutCogs}</strong> products need COGS.
            </span>
          </div>
          <div className="text-center margin-t-50">
            <Button className="login-button" onClick={() => { this.props.history.push('/set-cogs'); }}>
                EDIT COGS
            </Button>
          </div>
      </div>
      </div>
    )
  }
}
