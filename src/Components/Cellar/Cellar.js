import React from 'react'
import { StyleSheet, View, LayoutAnimation, Platform, UIManager, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import DrawCellar from '../Global/DrawCellar'
import { connect } from 'react-redux'
import { getCellar, countFreeWine, getFreeWine } from '../../orm/selectors'
import CustomButton from '../Global/CustomButton'
import Icon from 'react-native-vector-icons/FontAwesome5'
import globalStyles from '../Global/globalStyles'
import colors from '../Global/colors'
import Picker from '../Global/Picker'
import UUIDGenerator from 'react-native-uuid-generator'
import { colorLabel } from '../../data/color'
import { sort } from '../../method/object'
import Shadow from '../Global/Shadow'
import { Badge } from 'react-native-paper'

class Cellar extends React.Component {

  constructor(props) {
    super(props)

    
    this.state = {
      cellar: ( props.route.params && props.route.params.cellarId ? this.props.cellars.find(c => c.id === props.route.params.cellarId) : this.props.cellars[0] ),
      options:0
    }

    this.refresh=0
    this.select=this.state.cellar.id
    if (Platform.OS === 'android') { UIManager.setLayoutAnimationEnabledExperimental(true); }
  }

  //On arrête la recherche
  _stopSearch = () => {
    this.props.resetCurrentSearch()
  }

  //On affiche la liste de tous les vins
  _toSortList = () => {
    this.props.navigation.push("SortList")
  }

  //Boutton pour stopper la recherche
  _drawStopSearchButton() {
    if (this.props.currentSearch) {
      return(
        <CustomButton
          action={this._stopSearch}
          style={globalStyles.mb10}
          text="Arrêter la recherche"
          colorBg="#A3301C"
          icon="angle-left"
        />
      )
    }
  }

  //Choix de la cave
  _drawPicker() {
    if (this.props.cellars.length < 1 || !this.state.cellar) return

    let data = []
    this.props.cellars.map(c =>
      data.push({
        label:c.name,
        value:c.id,
        createdAt:c.createdAt
      })
    )

    return (
      <View style={[globalStyles.row]}>
        {(data.length>1?(<Badge style={[{backgroundColor:colors.blue,paddingLeft: 8,paddingRight: 8, alignSelf: 'center'},globalStyles.mr10]} size={20}>{data.length} caves</Badge>):null)}
        <Picker
          data={sort(data,'createdAt')}
          selectedValue={this.state.cellar.id}
          onChange={ (value) => this._onChangeCellar(value) }
          key={[this.state.cellar.id,this.select,this.refresh]}
        />
      </View>
    )
  }

  //Choix de la cave
  _onChangeCellar(cellarId) {
    if (cellarId === this.select) return
    this.select=cellarId
    this.setState({
      cellar: this.props.cellars.find(c => c.id === cellarId)
    })
  }

  _drawBody() {
    if (this.props.cellars.length < 1 || !this.state.cellar) {
      //On propose d'ajouter une cave
      return (
        <View style={[globalStyles.mt80,globalStyles.mb80,globalStyles.alignItemsCenter]} >
          <TouchableOpacity onPress={() => {
            UUIDGenerator.getRandomUUID().then((uuid) => {
              let cellar = {name:'Ma nouvelle cave', id: uuid, enabled:true}
              this.setState({cellar:cellar}, () => {
                this.props.createCellar(cellar)
                this.props.navigation.navigate('EditCellar')
              })
            })
          }}>
          <Shadow>
          <View style={[globalStyles.justifyContentCenter,globalStyles.alignItemsCenter]}>
            <Icon
              name='warehouse'
              color={colors.blue}
              size={70}
            />
            <Text style={[globalStyles.h1,globalStyles.mt20]}>Créer ma première cave</Text>
          </View>
          </Shadow>
          </TouchableOpacity>
        </View>
      )
    }
    return(
      <View>
        {this._drawPicker()}
        <View style={globalStyles.mb20}>
          <DrawCellar
            cellar={ this.state.cellar }
            toBlock={ this._toBlock }
            editCellar={ this._editCellar }
            navigation={this.props.navigation}
            search={ this.props.currentSearch }
            key={[this.state.cellar.id,this.props.nbFreeWine,this.select]}
          />
        </View>
      </View>
    )
  }

  componentDidUpdate() {
    //Si l'on a créé la première cave ou si l'on a supprimé la cave active
    if ((!this.state.cellar && this.props.cellars.length > 0) || (!this.props.cellars.find(c => c.id === this.state.cellar.id) && this.props.cellars.length > 0)) {
      this.setState({cellar:this.props.cellars[0]})
      return
    }

    //Si l'on a modifié la cave active
    this.refresh++
  }

  _toBlock = (blockId, searchId) => {
    this.props.navigation.navigate('Block', {blockId:blockId, searchId:searchId})
  }

  _editCellar = () => {
    this.props.navigation.navigate('EditCellar', {cellarId:this.state.cellar.id})
  }

  _toWineDetail = (wineId) => {
    this.props.navigation.push('WineDetail', { wineId: wineId });
  }

  _stockWineInCellars = (wineId, freeQuantity) => {
    this.props.navigation.navigate("StockCellar", { stockId: wineId, freeWine: freeQuantity, cellarId: this.state.cellar.id })
  }

  _drinkWine = (wineId) => {
    this.props.drinkWine(wineId)
  }

  _drawOptions(wineId, freeQuantity, color) {
    if (this.state.options===wineId) {
      return (
        <View style={[globalStyles.mt15,globalStyles.mb5,{height: 'auto'}]}>
          <CustomButton
            action={() => this._toWineDetail(wineId)}
            style={[globalStyles.mt5,globalStyles.mb5,globalStyles.mr10]}
            icon="info"
            colorBg={colors.greyblue}
            text="Voir la fiche de ce vin"
          />
          <CustomButton
            action={() => this._stockWineInCellars(wineId, freeQuantity)}
            style={[globalStyles.mt5,globalStyles.mb5,globalStyles.mr10]}
            icon="dolly-flatbed"
            colorBg={colors.greyblue}
            text="Ranger ce vin dans la cave"
          />
          <CustomButton
            action={() => this._drinkWine(wineId)}
            style={[globalStyles.mt5,globalStyles.mb5,globalStyles.mr10]}
            icon="glass-cheers"
            colorBg={colors.greyblue}
            text="Boire une bouteille en vrac"
          />
        </View>
      )
    }
  }

  _showOptions = (wineId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (wineId === this.state.options) {
      this.setState({
        options: 0
      })
      return
    }
    this.setState({
      options: wineId
    })
  }

  render() {
    return (
      <FlatList
        ListHeaderComponent={(
          <View style={globalStyles.main_container__withoutTabBar}>
            {this._drawBody()}
            {this._drawStopSearchButton()}

            <CustomButton
              action={this._toSortList}
              text="Voir tous mes vins"
              icon="wine-glass-alt"
              colorBg={colors.blue}
              style={globalStyles.mb20}
            />

            <Text style={[globalStyles.h1,globalStyles.mb10]}>{(this.props.nbFreeWine>0?this.props.nbFreeWine + (this.props.nbFreeWine>1?' bouteilles':' bouteille')+' en vrac':'')}</Text>
          </View>
        )}
        data={(this.props.freeWines?sort(this.props.freeWines.filter(fw => fw && fw.appellation && fw.domain),'millesime'):[])}
        key={this.props.currentSearch}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
         <Shadow>
         <View style={ styles.container_item }>
          <View style={[styles.color, {backgroundColor:colorLabel.find(c => c.value === item.appellation.color).hexa }]}></View>
          <View style={[globalStyles.p10,globalStyles.flex1]}>
            <TouchableOpacity
              onPress={() => this._showOptions(item.id)}
            >
              <View style={globalStyles.flex1}>
                <Text style={ styles.freewineName }>{item.domain.name} {item.millesime}</Text>
                <Text style={[globalStyles.h3,globalStyles.mt5,globalStyles.mb10]}>{item.appellation.name}</Text>
                <Badge size={20} style={{backgroundColor: colorLabel.find(c => c.value === item.appellation.color).hexa, alignSelf: 'flex-start'}}>{item.freeQuantity}</Badge>
              </View>
            </TouchableOpacity>
            {this._drawOptions(item.id, item.freeQuantity, colorLabel.find(c => c.value === item.appellation.color).hexa)}
          </View>
         </View>
         </Shadow>
       )}
       ListFooterComponent={() => (
         <View style={{height: 55}}/>
       )}
      />
    )
  }
}

const styles = StyleSheet.create({
  cellar_name: {
    fontSize: 16,
    color: "#2F6F8F",
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
    freewineName: {
      textTransform: 'uppercase',
      fontSize: 18,
      fontFamily: 'Ubuntu-Medium',
      color: '#053C5C'
    },
})

const mapStateToProps = state => {
  return {
    cellars: getCellar(state).filter(c => c.enabled),
    nbFreeWine: countFreeWine(state, state.currentSearch.id),
    currentSearch: state.currentSearch.id,
    freeWines: getFreeWine(state, state.currentSearch.id),
  };
}

const mapDispatchToProps = dispatch => {
	return {
    createCellar: data => dispatch({type:'CREATE_CELLAR',payload:data}),
    resetCurrentSearch: data => dispatch({type:'RESET_CURRENT_SEARCH'}),
    drinkWine: data => dispatch({type:'DRINK_WINE', payload:data}),
	}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cellar)
