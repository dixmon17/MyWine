// Components/Search.js

import React from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import Shadow from './Shadow'

class ScrollableTable extends React.Component {

  render() {
    return (
    <Shadow>
      <View style={[styles.cellar,this.props.style]}>
        <ScrollView horizontal={true} contentContainerStyle={{flexDirection: 'column'}}>
          <View style={{alignSelf: 'center'}}>
            {this.props.children}
          </View>
        </ScrollView>
      </View>
    </Shadow >
    )
  }
}

const styles = StyleSheet.create({
  cellar: {
    alignItems: 'center',
    borderRadius:20,
    backgroundColor: 'white',
    padding: 20,
  },
})

export default ScrollableTable
