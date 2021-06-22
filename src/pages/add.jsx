import React, { Component } from 'react'
import Amplify, { API } from 'aws-amplify'
import awsConfig from '../aws-exports'
import '../App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import App from '../App'

Amplify.configure(awsConfig)

let apiName = 'collectionAPI'
let path = '/collection'

class add extends Component {
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
    e.preventDefault()

    const body = {
      id: Date.now().toString(),
      title: this.state.title,
      content: this.state.content,
      filter: this.state.filter
    }

    try {
      const res = await API.post(apiName, path, { body })
      console.log(res)
    } catch (err) {
      console.log(err)
    }

    this.setState({ title: '', content: '', filter: [{ label: '', value: '' }] })
    this.fetchList()
  }

  handleSelectItem = async id => {
    this.setState({ showDetail: true, selectedItem: {} })

    try {
      const res = await API.get(apiName, `${path + '/object/' + id}`)
      this.setState({ selectedItem: { ...res } })
      console.log("First :", res)
      console.log("Second :", res.filter[0].label, res.filter[0].value);
    } catch (err) {
      console.log(err)
    }
  }

  handleDelete = async id => {
    try {
      await API.del(apiName, `${path + '/object/' + id}`)
      this.setState({ showDetail: false })
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
    console.log("start handleAddFilter");
    this.setState({
      filter: this.state.filter.concat([{ label: '', value: '' }])
    });
    console.log("end handleAddFilter");
  };

  handleRemoveFilter = idx => () => {
    this.setState({
      filter: this.state.filter.filter((s, sidx) => idx !== sidx)
    });
  };

  async fetchList() {
    try {
      const res = await API.get(apiName, path)
      this.setState({ list: [...res] })
    } catch (err) {
      console.log(err)
    }
  }

  componentDidMount() {
    this.fetchList()
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
        <hr />
        
      </div>
    )
  }
}

export default withAuthenticator(add, true)