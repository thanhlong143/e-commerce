import withBaseComponent from "hocs/withBaseComponent";
import React from "react"

const MyCart = (props) => {
  console.log(props);
  return (
    <div>MyCart</div>
  )
}

export default withBaseComponent(MyCart)