// Components/Search.js

import React from 'react'
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native'

class Fallback extends React.Component {

  render() {
    return (
      <View style={styles.loader_container}>
        <ActivityIndicator size="large" color="#053C5C" />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  loader_container: {
    position: 'absolute',
    top:0,
    bottom:0,
    left:0,
    right:0,
    zIndex: 100,
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
  }
})

export default Fallback
