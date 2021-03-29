import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import CustomButton from '../../Global/CustomButton'
import Vision from './Vision'
import globalStyles from '../../Global/globalStyles'

class Add extends React.Component {

  render() {
    return (
      <View style={{flex:1}}>
        <Vision navigation={this.props.navigation}/>
      </View>
    )
  }
}

export default Add
