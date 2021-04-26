// Components/Search.js

import React from 'react'
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Keyboard } from 'react-native'
import { getResults } from '../../method/search'
import Icon from 'react-native-vector-icons/FontAwesome'
import { colorLabel } from '../../data/color'
import globalStyles from './globalStyles'
import Shadow from './Shadow'
import FadeIn from '../../animation/FadeIn'

class InputSearch extends React.Component {

  constructor(props) {
    super(props)
    this.searchedText = ""

    this.state = {
      results: [],
      subSearch: {},
    }
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
            <TouchableOpacity onPress={() => this.props.submit({
              entityId:item.id,
              entityName: this.searchedText
            })}>
              <Text style={styles.subsearch_item}>{colorLabel.find(c => c.value === item.color).label.toLowerCase()}</Text>
            </TouchableOpacity>
            <Text style={styles.subsearch_separator}>{(index < this.state.subSearch.entity.length-1?' / ':undefined)}</Text>
          </View>
        )}
      />
    )
  }
  //Mise à jour des states quand on tape du texte
  _searchTextInputChanged(text) {
    this.searchedText = text

    let results = getResults(this.searchedText, this.props.data, this.props.customOptions)

    if ((results.length > 0 || results.length === 0) && this.searchedText.length > 0) results.push({item:{nameWithSpace:this.searchedText,entity:[],cat:this.props.addLabel,add:true},refIndex:-1})
    this.setState({
      results: results,
    })
  }

  _drawSubName(multiple, entity) {
    if (this.props.regions) {
      let region = this.props.regions.find(r => r.id === entity[0].region)
      return(
        ( region ? region.name : null ) + ' '
        +
        ( multiple ?
            ' / '+'plusieurs couleurs'
          : (
            entity.length===1 && entity[0].color ?
            colorLabel.find(c => c.value === entity[0].color).label.toLowerCase()
            : undefined
          )
        )
      )
    }
    return(this.props.cat)
  }

  _showName(name,cat,entity,multiple,add,label) {
    if (add) {
      return(
        <View style={globalStyles.row}>
          <View style={ styles.add_left }>
            <Icon
              name="plus"
              size={20}
              color='#DB5461'
            />
          </View>
          <View style={ styles.result_container_right }>
            <Text style={ styles.result_name_add }>{name}</Text>
            <Text style={ styles.result_cat_add }>{cat}</Text>
          </View>
        </View>
      )
    } else {
      return(
        <View>
          <View style={[globalStyles.row,{alignItems: 'flex-end', flexWrap: 'wrap'}]}>
            <Text style={ styles.result_name }>{name}</Text>
            {(label?(<Text style={globalStyles.h3}> ({label})</Text>):null)}
          </View>

          <Text style={ styles.result_cat }>{this._drawSubName(multiple, entity)}</Text>
        </View>
      )
    }
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

    this.props.submit({
      entityId:(item.entity.length>0?item.entity[0].id:null),
      entityName: this.searchedText
    })
  }

  render() {
    return (
      <View style={ [this.props.margin,globalStyles.flex1] }>
        {this.props.h1?(<Text style={ [globalStyles.h1,globalStyles.mt30,globalStyles.mb10] }>{this.props.h1}</Text>):<View/>}
        {this.props.h2?(<View style={globalStyles.row}>{this.props.h2}</View>):<View/>}

        <View style={globalStyles.flex1}>
          <Shadow>
          <View style={ styles.search_container }>
            <TextInput
              autoFocus={true}
              style={ styles.input }
              autoComplete="off"
              onChangeText={(text) => this._searchTextInputChanged(text)}
              onSubmitEditing={() => {return}}
              placeholder={this.props.placeholder}
              ref={input => { this.textInput = input }}
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
      </View>
    )
  }

  _renderItem(item) {
    let search = item.item

    return(
      <FadeIn>
        <View>
          <TouchableOpacity
            style={ styles.result_container }
            onPress={() => this._onPress(search)}
          >
            {this._showName(search.nameWithSpace,search.cat,search.entity,search.multiple,search.add,search.label)}
          </TouchableOpacity>
          {this._drawSubSearch(search.id)}
        </View>
      </FadeIn>
    )
  }
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
      marginBottom: 10,
    },
      result_container: {
        marginLeft: 8,
        paddingTop: 15,
        paddingBottom: 15
      },
        add_left: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingRight: 10
        },
        result_name: {
          fontFamily: 'Ubuntu-Medium',
          textTransform: 'uppercase',
          fontSize: 18,
          color: '#053C5C'
        },
        result_name_add: {
          textTransform: 'uppercase',
          fontSize: 15,
          fontFamily: 'OpenSans-Bold',
          color: '#DB5461'
        },
        result_cat: {
          color: '#686963',
          fontSize: 13
        },
        result_cat_add: {
          color: '#686963',
          fontSize: 11
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

export default InputSearch
