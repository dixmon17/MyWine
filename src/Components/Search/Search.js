// Components/Search.js

import React from 'react'
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Keyboard } from 'react-native'
import { getResults } from '../../method/search'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { getDomainsWithNumber, getRegionsWithNumber, getAppellationsWithNumber } from '../../orm/selectors'
import Icon from 'react-native-vector-icons/FontAwesome'
import { catLabel } from '../../data/label'
import { colorLabel } from '../../data/color'
import CustomButton from '../Global/CustomButton'
import globalStyles from '../Global/globalStyles'
import Shadow from '../Global/Shadow'
import FadeIn from '../../animation/FadeIn'
import { Badge } from 'react-native-paper'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true
}

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.searchedText = ""

    this.state = {
      results: [],
      subSearch: {},
    }
  }

  //Si l'on appuie directement sur une suggestion
  _toSortList(cat, catId, number) {
    if (!number) {
        this.props.navigation.push('AppellationDetail', { appellationId: catId })
        return
    }
    this.props.navigation.push('SortList', { cat: cat, catId: catId, origin: 'search' });
  }

  _drawSubSearch(searchId) {
    if (this.state.subSearch.id !== searchId) return
    return(
      <FlatList
        horizontal
        style={styles.subsearch_container}
        data={this.state.subSearch.entity}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item, index}) => (
          <View style={styles.subsearch_item_container}>
            <TouchableOpacity
              style={globalStyles.row}
              onPress={() => {
                ReactNativeHapticFeedback.trigger("selection", options)
                this._toSortList(this.state.subSearch.cat,item.id,item.number)
              }}
            >
              {(item.number>0?(<Badge size={18} style={[globalStyles.alignSelfStart,globalStyles.mr5,globalStyles.mt3,globalStyles.bold,{backgroundColor:'#053C5C',fontSize: 8}]}>{item.number}</Badge>):null)}
              <Text style={styles.subsearch_item}>{colorLabel.find(c => c.value === item.color).label.toLowerCase()}</Text>
            </TouchableOpacity><Text style={styles.subsearch_separator}>{(index < this.state.subSearch.entity.length-1?' / ':undefined)}</Text>
          </View>
        )}
      />
    )
  }

  //Redirection vers la liste de recherche quand on appuie sur le bouton recherche
  // _toSearchWine() {
  //   if (this.state.results.length > 0) this.props.navigation.navigate("SearchList", { list: this.state.results })
  // }

  //Mise à jour des states quand on tape du texte
  _searchTextInputChanged(text) {
    this.searchedText = text
    this.setState({
      results: getResults(this.searchedText, {regions: this.props.regions, appellations:this.props.appellations, domains:this.props.domains}),
    })
  }

  _countWine(entity) {
    let number=0
    entity.map(e => number+=e.number)
    return number
  }

  _onPress(item) {
    if (item.multiple && this.state.subSearch.id !== item.id) {
      Keyboard.dismiss()
      this.setState({subSearch: {id:item.id,cat:item.cat,entity:item.entity.reverse()}})
      return
    } else if (item.multiple && this.state.subSearch.id === item.id) {
      Keyboard.dismiss()
      this.setState({subSearch: {}})
      return
    }
    ReactNativeHapticFeedback.trigger("selection", options)
    this._toSortList(item.cat,item.entity[0].id,item.entity[0].number)
  }

  render() {
    return (
      <View style={ [globalStyles.main_container] }>
       <Text style={ [globalStyles.h1,globalStyles.mt30,globalStyles.mb10] }>Recherchez dans votre cave</Text>
       <Text style={ [globalStyles.h3,globalStyles.mb20] }>Une appellation, un domaine, une région ?</Text>

       <Shadow>
       <View style={ styles.search_container }>
         <TextInput
          style={ styles.input }
          autoComplete="off"
          onChangeText={(text) => this._searchTextInputChanged(text)}
          placeholder='bourgogne, saint-émilion...'
         />
         <View
          style={ styles.button_container }
         >
          <Text style={ styles.button_text }>
            <Icon
              name="search"
              size={23}
            />
          </Text>
         </View>
       </View>
       </Shadow>

       <FlatList
        vertical
        style={ styles.results }
        data={this.state.results}
        keyExtractor={(item) => item.refIndex.toString()}
        keyboardShouldPersistTaps={'handled'}
        renderItem={({item}) => this._renderItem(item)}
       />
     </View>
    )
  }

  _renderItem(item) {
    let search = item.item
    return(
      <FadeIn>
        <TouchableOpacity
          style={ styles.result_container }
          onPress={() => this._onPress(search)}
        >
          <View style={[globalStyles.row,{alignItems: 'flex-end', flexWrap: 'wrap'}]}>
            <Text style={ [styles.result_name] }>{search.nameWithSpace}</Text>
            <View style={globalStyles.row}>
              <Text style={globalStyles.h3}>{(search.label?' ('+search.label+')':null)}</Text>
              {(this._countWine(search.entity)>0?(<Badge style={[globalStyles.alignSelfStart,globalStyles.ml5,globalStyles.bold,{backgroundColor:'#053C5C'}]}>{this._countWine(search.entity)}</Badge>):null)}
            </View>
          </View>
          <Text style={ styles.result_cat }>{catLabel[search.cat] + (search.multiple?' / '+'plusieurs couleurs':(search.entity.length>0&&search.entity[0].color?' / '+colorLabel.find(c => c.value === search.entity[0].color).label:''))}</Text>
        </TouchableOpacity>
        {this._drawSubSearch(search.id)}
      </FadeIn>
    )
  }

  // componentDidMount() {
  //   this.props.navigation.dangerouslyGetParent().addListener('tabPress', e => {
  //     console.log(this.props.navigation.dangerouslyGetState())
  //   });
  // }
}

const styles = StyleSheet.create({
    search_container: {
      height: 50,
      backgroundColor: 'white',
      borderRadius: 50,
      flexDirection: 'row',
    },
      input: {
        flex:9,
        paddingLeft: 15
      },
      button_container: {
        backgroundColor: '#2F6F8F',
        justifyContent: 'center',
        alignItems: 'center',
        flex:2,
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50
      },
      button_text: {
        color:'#ffffff'
      },
    results: {
      flex:1,
      marginTop: 10,
    },
      result_container: {
        marginLeft: 8,
        paddingTop: 15,
        paddingBottom: 15
      },
        result_name: {
          fontFamily: 'Ubuntu-Medium',
          textTransform: 'uppercase',
          fontSize: 18,
          color: '#053C5C'
        },
        result_cat: {
          textTransform: 'lowercase',
          color: '#686963',
          fontSize: 13
        },
      subsearch_container: {
        marginLeft: 20,
      },
        subsearch_item_container: {
          flexDirection: 'row',
          marginTop: 10,
          marginBottom: 10
        },
          subsearch_item: {
              fontFamily: 'OpenSans-Regular',
              fontSize: 15,
              color:'#2F6F8F',
              textDecorationLine: 'underline'
          },
          subsearch_separator: {
              fontSize: 15,
              marginLeft: 5,
              marginRight: 5
          }
})

const mapStateToProps = state => {
  return {
    appellations: getAppellationsWithNumber(state),
    domains: getDomainsWithNumber(state).filter(d => d.number > 0),
    regions: getRegionsWithNumber(state).filter(r => r.number > 0),
  };
}

export default connect(mapStateToProps)(Search)
