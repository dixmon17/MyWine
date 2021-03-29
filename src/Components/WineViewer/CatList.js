// Components/Search.js

import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native'
import { colorLabel } from '../../data/color'
import { List } from 'react-native-paper'

class CatList extends React.Component {

  render() {
    return (
      <View style={ styles.results_container }>
        {(this.props.reset?(<List.Item  onPress={() => this.props.action()} title='Réinitialiser ce filtre'/>):null)}
        {this.props.data.filter(i => i && i.id).map(item => (
          <List.Item onPress={() => this.props.action(item.id,item.name)} key={item.id.toString()} title={item.name+' '+(item.color?colorLabel.find(c => c.value === item.color).label:'')}/>
        ))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
    results_container: {
      marginBottom: 10
    },
      results: {
        maxHeight: 300,
      },
      result_container: {
        marginLeft: 15,
        paddingTop: 10,
        paddingBottom: 10,
      },
        result_name: {
          textTransform: 'uppercase',
          fontSize: 15,
          fontFamily: 'OpenSans-Bold'
        }
})

export default CatList
