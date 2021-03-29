import React from "react";

export default props => (
  <div>
    <legend>Products</legend>
    <div className="card" style={{ width: "25rem" }}>
      {renderListItem(props.list, props.loadDetailsPage)}
    </div>
  </div>
);

function renderListItem(list, loadDetailsPage) {
    console.log(list)
  const listItems = list.map(item => (
    <li
      key={item.id}
      className="list-group-item"
      onClick={() => loadDetailsPage(item.id)}
    >
      {item.Name}
    </li>
  ));

  return <ul className="list-group list-group-flush">{listItems}</ul>;
}