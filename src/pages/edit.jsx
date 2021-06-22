import React, { Component } from 'react'
import Amplify, { API } from 'aws-amplify'
import awsConfig from '../aws-exports'
import '../App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import App from '../App'

Amplify.configure(awsConfig)

let apiName = 'collectionAPI'
let path = '/collection'

class edit extends Component {


  state = {
    title: '',
    content: '',
    list: [],
    showDetail: false,
    selectedItem: {},
    filter: [{ label: '', value: '' }]
  }

  handleChange = e => {
    const { value, name } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit = async e => {
    console.log("this.state.title = ", this.state.title);
    e.preventDefault()
    const body = {
      id: this.state.id,
      title: this.state.title,
      content: this.state.content,
      filter: this.state.filter
    }

    try {
      const res = await API.put(apiName, path, { body })
      console.log(res)
    } catch (err) {
      console.log(err)
    }

    window.location.href = "/main";

  }

  handleSelectItem = async id => {
    this.setState({ showDetail: true, selectedItem: {} })

    try {
      const res = await API.get(apiName, `${path + '/object/' + id}`)
      this.setState({ ...res } )
      console.log("handleSelectItem success\n",res)
    } catch (err) {
      console.log(err)
    }
  }

  handleDelete = async id => {
    try {
      await API.del(apiName, `${path + '/object' + id}`)
      this.setState({ showDetail: true })
      this.fetchList()
    } catch (err) {
      console.log(err)
    }
  }

  handleBackList = () => {
    this.setState({ showDetail: false })
  }



  handleFilterLabelChange = idx => e => {
    const newFilter = this.state.filter.map((filter, sidx) => {
      if (idx !== sidx) return filter;
      return { ...filter, label: e.target.value };
    });

    this.setState({ filter: newFilter });
  };

  handleFilterValueChange = idx => e => {
    const newFilter = this.state.filter.map((filter, sidx) => {
      if (idx !== sidx) return filter;
      return { ...filter, value: e.target.value };
    });

    this.setState({ filter: newFilter });
  };

  handleAddFilter = () => {
    this.setState({
      filter: this.state.filter.concat([{ label: '', value: '' }])
    });
  };

  handleRemoveFilter = idx => () => {
    this.setState({
      filter: this.state.filter.filter((s, sidx) => idx !== sidx)
    });
  };

  async fetchList() {
    console.log("start fetchList")
    try {
      const res = await API.get(apiName, path)
      this.setState({ list: [...res] })
    } catch (err) {
      console.log(err)
    }
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.handleSelectItem(id)
  }

  render() {
    const {
      handleChange,
      handleSubmit,
      handleSelectItem,
      handleBackList,
      handleDelete,
    } = this
    const { title, content, list, showDetail, selectedItem, filter } = this.state



    return (
      <div className="App">


        <h2>Todo</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
            />
          </div>
          <div className="row">
            <label htmlFor="content">content</label>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={handleChange}
            />
          </div>
          <button className="btn" type="submit">
            Submit
          </button>
          <Link to={'/main'}>Cancel</Link>
          {this.state.filter.map((filter, idx) => (
            <div className="filter">
              <input name={`filter[${idx}].label`} type="text" placeholder={`Filter #${idx + 1} label`} value={filter.label} onChange={this.handleFilterLabelChange(idx)} />
              <input name={`filter[${idx}].value`} type="text" placeholder={`Filter #${idx + 1} value`} value={filter.value} onChange={this.handleFilterValueChange(idx)} />
              <button type="button" onClick={this.handleRemoveFilter(idx)}>
                Delete
              </button>
            </div>
          ))}

          <button type="button" onClick={this.handleAddFilter}>
            Add Filter
          </button>


        </form>
        
      </div>
    )
  }
}

export default withAuthenticator(edit, true)