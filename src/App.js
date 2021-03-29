import React, { Component } from "react";
import List from "./List";
import Details from "./Details";

import Amplify, { API } from "aws-amplify";
import aws_exports from "./aws-exports";
import { withAuthenticator } from '@aws-amplify/ui-react';
Amplify.configure(aws_exports);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      title: "",
      list: [],
      item: {},
      showDetails: false
    };
  }

  async componentDidMount() {
    await this.fetchList();
  }
  handleChange = event => {
    const id = event.target.id;
    this.setState({ [id]: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    await API.post("csproduct", "/csproducts", {
      body: {
        id: Date.now().toString(),
        Name: this.state.title,
        Description: this.state.content
      }
    });

    this.setState({ content: "", title: "" });
    this.fetchList();
  };
  async fetchList() {
    const response = await API.get("csproduct", "/csproducts");
    this.setState({ list: [...response] });
  }

  loadDetailsPage = async id => {
    const response = await API.get("csproduct", "/csproducts/" + id);
    this.setState({ item: { ...response[0] }, showDetails: true });
  };

  loadListPage = () => {
    this.setState({ showDetails: false });
  };

  delete = async id => {
    //TODO: Implement functionality
  };

  render() {
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <legend>Add</legend>
          <div className="form-group">
            <label htmlFor="title">Product Name</label>
            <input
              type="text"
              className="form-control"
              id="title"
              placeholder="Title"
              value={this.state.title}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Description</label>
            <textarea
              className="form-control"
              id="content"
              placeholder="Content"
              value={this.state.content}
              onChange={this.handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
        <hr />
        {this.state.showDetails ? (
          <Details
            item={this.state.item}
            loadListPage={this.loadListPage}
            delete={this.delete}
          />
        ) : (
          <List list={this.state.list} loadDetailsPage={this.loadDetailsPage} />
        )}
      </div>
    );
  }
}

export default withAuthenticator(App, true);