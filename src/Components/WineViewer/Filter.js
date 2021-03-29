// Components/Search.js

import React from 'react'
import { View } from 'react-native'
import CustomButton from '../Global/CustomButton'
import CatList from './CatList'
import { List } from 'react-native-paper';

class Filter extends React.Component {
  render() {
    return (
      <List.Accordion
        title={this.props.label}
        left={props => <List.Icon {...props} icon={this.props.icon} />}
        id={this.props.icon}
        onPress={() => this.props.expandAction(this.props.icon)}
        expanded={(this.props.expanded===this.props.icon?true:false)}
      >
        <CatList
          data={this.props.showList }
          action={this.props.search}
          reset={this.props.reset}
        />
      </List.Accordion>
    )
  }
}

export default Filter
