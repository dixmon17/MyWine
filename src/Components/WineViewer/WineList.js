import React from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native'
import { colorLabel } from '../../data/color'
import Shadow from '../Global/Shadow'
import { Badge } from 'react-native-paper'
import globalStyles from '../Global/globalStyles'
import Icon from 'react-native-vector-icons/FontAwesome'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true
}

class WineList extends React.Component {

  _toWineDetail(wineId) {
    this.props.navigation.push('WineDetail', { wineId: wineId });
  }

  _drawListEmptyComponent() {
    // if (this.props.filters.region || this.props.filters.appellation || this.props.filters.domain || this.props.filters.size || this.props.filters.color || this.props.filters.age) {
    //   return (
    //     <View style={[globalStyles.p20,globalStyles.mt10]}>
    //       <Text style={globalStyles.h1}>Aucun vin ne répond à vos critères de recherche</Text>
    //       <Text style={[globalStyles.h3,globalStyles.mt5]}>Toucher Filtrer / Trier pour changez vos filtres</Text>
    //     </View>
    //   )
    // }
    return (
      <View style={[globalStyles.p20,globalStyles.mt10]}>
        <Text style={globalStyles.h1}>Vous n'avez pas encore de vin</Text>
        <Text style={[globalStyles.h3,globalStyles.mt5]}>N'attendez plus et allez ajouter vos premières bouteilles !</Text>
      </View>
    )
  }

  _drawListHeaderComponent() {
    if (this.props.appellationSearch) {
      return (
        <TouchableOpacity
          onPress={() => {
            ReactNativeHapticFeedback.trigger("selection", options);
            this.props.navigation.push('AppellationDetail', { appellationId: this.props.appellationSearch.id})
          }}
          style={[globalStyles.p20,globalStyles.mt10,globalStyles.row]}
        >
          <View style={[globalStyles.mr10]}>
            <Icon name="tags" size={50} color='#2F6F8F'/>
          </View>
          <View>
            <Text style={globalStyles.h1}>{this.props.appellationSearch.name + ' ' + colorLabel.find(c => c.value === this.props.appellationSearch.color).label}</Text>
            <Text style={[globalStyles.h3,globalStyles.mt5]}>En savoir plus sur cette appellation</Text>
          </View>
        </TouchableOpacity>
      )
    } else {
      return (<View/>)
    }
  }

  render() {
    return (
      <View style={ styles.list_container }>
       <FlatList
          vertical
          style={ styles.list }
          data={this.props.wines }
          ListHeaderComponent={() => this._drawListHeaderComponent()}
          ListEmptyComponent={() => this._drawListEmptyComponent()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            <Shadow>
            <View style={ styles.container_item }>
              <View style={[styles.color, {backgroundColor:colorLabel.find(c => c.value === item.appellation.color).hexa }]}></View>
              <View style={ styles.container_right}>
                <TouchableOpacity
                  onPress={() => {
                    ReactNativeHapticFeedback.trigger("selection", options);
                    this._toWineDetail(item.id)
                  }}
                >
                  <View style={ styles.content }>
                    <Text style={ styles.name }>{item.domain.name} {item.millesime}</Text>
                    <Text style={ styles.appellation }>{item.appellation.name}</Text>
                    <Badge size={20} style={{backgroundColor: colorLabel.find(c => c.value === item.appellation.color).hexa, alignSelf: 'flex-start'}}>{item.quantity}</Badge>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            </Shadow>
          )}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  list_container: {
    flex: 1
  },
  list: {
    flex: 1,
  },
    container_item: {
      flexDirection: 'row',
      margin: 15,
      marginLeft: 20,
      marginRight: 20,
      backgroundColor: 'white',
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      borderTopLeftRadius: 3,
      borderBottomLeftRadius: 3,
      overflow: 'hidden'
    },
      color: {
        marginRight: 10,
        width: 7,
        borderRadius: 20,
      },
      container_right: {
        flex:1,
        padding: 10
      },
      content: {
        flex: 1,
      },
        name: {
          textTransform: 'uppercase',
          fontSize: 18,
          fontFamily: 'Ubuntu-Medium',
          color: '#053C5C'
        },
        appellation: {
          color: '#686963',
          fontSize: 15,
          marginBottom: 10,
          marginTop: 3
        },
        quantity: {
          color: '#053C5C',
        }
})

export default WineList
