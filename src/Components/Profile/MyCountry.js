import React from 'react'
import { View, Text, FlatList, Platform, UIManager, LayoutAnimation, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { getMyCountry } from '../../orm/selectors'
import { sort } from '../../method/object'
import globalStyles from '../Global/globalStyles'
import { List } from 'react-native-paper'
import { Badge } from 'react-native-paper'

class MyDomain extends React.Component {

  constructor(props) {
    super(props)

    this.state={
      expanded:null
    }

    if (Platform.OS === 'android') { UIManager.setLayoutAnimationEnabledExperimental(true); }
  }

  _deleteCountry(item) {
    this.props.deleteCountry(item.id)
  }

  render() {
    return (
      <View style={ globalStyles.main_container }>
        <FlatList
        vertical
        ListHeaderComponent={(<Text style={[globalStyles.mt30,globalStyles.mb10,globalStyles.ml10,globalStyles.h1]}>{this.props.countries.length} pays ajoutés :</Text>)}
        ListEmptyComponent={(<Text style={[globalStyles.h3,globalStyles.ml5]}>Vous n'avez pas encore ajouté de nouveaux pays</Text>)}
        style={globalStyles.flex1}
        data={sort(this.props.countries,'name')}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <List.Accordion
            id={item.id.toString()}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
              if (this.state.expanded === item.id.toString()) {
                this.setState({expanded:null})
              } else {
                this.setState({expanded:item.id.toString()})
              }
            }}
            expanded={(this.state.expanded===item.id.toString()?true:false)}
            style={globalStyles.mt5,globalStyles.mb5}
            title={item.name}
            titleStyle={globalStyles.bold}
            left={() => <Badge size={25} style={{backgroundColor: '#053C5C',top:-7,marginRight: 10}}>{item.quantity}</Badge>}
          >
            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('EditCountry', {countryId:item.id})
            }}>
              <List.Item
                style={{marginLeft: -25,padding: 0}}
                titleStyle={{textTransform:'uppercase',fontSize: 13}}
                title="modifier"
                left={props => <List.Icon {...props} style={{marginRight: 1}} icon="edit" />}
              />
            </TouchableOpacity>
            {item.quantity===0?(
              <TouchableOpacity onPress={() => this._deleteCountry(item)}>
                <List.Item
                  style={{marginLeft: -25,padding: 0}}
                  titleStyle={{textTransform:'uppercase',fontSize: 13}}
                  title="retirer"
                  left={props => <List.Icon {...props} style={{marginRight: 1}} icon="trash" />}
                />
              </TouchableOpacity>
            ):undefined}
          </List.Accordion>
        )}
        />
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    countries:getMyCountry(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deleteCountry: data => dispatch({type:'DELETE_COUNTRY', payload:data}),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyDomain)
