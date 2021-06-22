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

class main extends Component {
  state = {
    title: '',
    content: '',
    list: [],
    filter: [{ label: '', value: '' }]
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
      handleFilterLabelChange,
      handleFilterValueChange,
      handleAddFilter,
      handleRemoveFilter
    } = this
    const { title, content, list, showDetail, selectedItem, filter } = this.state



    return (
      <div className="App">
        <Link to={'/add'}>Add</Link>
        <hr />
        <h3>List</h3>
        <ul style={{ display: showDetail ? 'none' : 'block' }}>
          {list.map(item => (
            <li key={item.id}>
              {item.title}
              <button><Link to={`/addSub/${item.id}`}>Add</Link> </button>
              <button><Link to={`/edit/${item.id}`}>Edit</Link></button>
              <button type="button" className="btn" onClick={() => handleDelete(item.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default withAuthenticator(main, true)