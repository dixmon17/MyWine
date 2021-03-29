// Components/Search.js

import React from 'react'
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { getWine, countFreeWine, getCellarsByWine } from '../../orm/selectors'
import { colorLabel } from '../../data/color'
import CustomButton from '../Global/CustomButton'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome5'
import globalStyles from '../Global/globalStyles'
import Shadow from '../Global/Shadow'

class WineDetail extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      widthCursor:undefined
    }

    this.data = this.props.wine
    this.color = (this.props.wine.appellation?colorLabel.find(c => c.value === this.props.wine.appellation.color):'r')
  }

  _searchWineInCellars = () => {
    this.props.updateCurrentSearch(this.data.id)
    this.props.navigation.navigate('CellarTab', {
      screen: 'Cellar'
    });
    //TODO : AFFICHER UNIQUEMENT LES CAVES QUI CONTIENNENT LE VIN
  }

  _stockWineInCellars = () => {
    this.props.navigation.navigate('CellarTab', {
      screen: 'StockCellar',
      initial: false,
      params: {cellarId: this.props.cellars[0], stockId: this.data.id }
    })
  }

  _showStockButton() {
    if (!this.props.freeWine) return
    return(
      <CustomButton
        action={this._stockWineInCellars}
        text={ (this.props.freeWine>1?'Placer mes '+this.props.freeWine+' bouteilles':'Placer ma bouteille') }
        icon="dolly-flatbed"
        colorBg='#8AA29E'
      />
    )
  }

  _addOneWine = () => {
    this.props.updateWine({
      quantity: parseInt(this.props.wine.quantity)+1,
      id: this.data.id
    })
  }

  _drawTemp() {
    let text
    if (this.props.wine.tempmin && this.props.wine.tempmax) {
      text = 'Servir entre '+this.props.wine.tempmin+'°C et '+this.props.wine.tempmax+'°C'
    } else if (this.props.wine.tempmin || this.props.wine.tempmax) {
      text = 'Servir à '+(this.props.wine.tempmin?this.props.wine.tempmin:this.props.wine.tempmax)+'°C'
    } else {
      return
    }

    return(<Shadow><View style={[styles.element,styles.margin,{flexDirection: 'row'}]}><Icon name='thermometer-half' size={20} color="black" style={styles.element_icon}/><Text>{text}</Text></View></Shadow>)
  }

  _drawVarieties() {
    if (!this.props.wine.varieties || this.props.wine.varieties.length === 0) return

    return(
      <Shadow><View style={[styles.element,styles.margin,globalStyles.row,globalStyles.alignItemsCenter]}>
        <Icon name='seedling' size={20} color="black" style={styles.element_icon}/>
        <View>
        {this.props.wine.varieties.map(v => (
          <View key={v.id+'container'}style={globalStyles.row}>
            <Text key={v.id+'name'}>{v.name}</Text>
            {(v.percent&&v.percent>0?(<Text key={v.id+'percent'}> {v.percent} %</Text>):null)}
          </View>
        ))}
        </View>
      </View></Shadow>
    )
  }

  _drawAging() {
    if (!this.props.wine.yearmin && !this.props.wine.yearmax) return

    let gradient, label, desc, year = new Date().getFullYear()-parseInt(this.props.wine.millesime,10)

    if (year >= this.props.wine.yearmin || !this.props.wine.yearmin) {
      if (year <= this.props.wine.yearmax || !this.props.wine.yearmax) {
        label = 'Prêt à boire'
      } else {
        label = 'Peut-être trop âgé'
      }
    } else {
      label = 'Peut-être trop jeune'
    }

    if (this.props.wine.yearmin && this.props.wine.yearmax) {
      gradient = (<LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} locations={[0,0.1,0.5,0.6,0.9,1]} colors={['#98BDD6', '#98BDD6', '#69DBA0', '#69DBA0', '#DB6558', '#DB6558']} style={globalStyles.flex1}></LinearGradient>)
      desc = 'Potentiel de garde entre '+this.props.wine.yearmin+' et '+this.props.wine.yearmax+(this.props.wine.yearmax===1?' an':' ans')
    } else if (this.props.wine.yearmin) {
      gradient = (<LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} locations={[0,0.1,0.5]} colors={['#98BDD6', '#98BDD6', '#69DBA0']} style={globalStyles.flex1}></LinearGradient>)
      desc = 'Boire après '+this.props.wine.yearmin+(this.props.wine.yearmin===1?' an':' ans')+' de garde'
    } else if (this.props.wine.yearmax) {
      gradient = (<LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} locations={[0.6,0.9,1]} colors={['#69DBA0', '#DB6558', '#DB6558']} style={globalStyles.flex1}></LinearGradient>)
      desc = 'Potentiel de garde de '+this.props.wine.yearmax+(this.props.wine.yearmax===1?' an':' ans')
    }

    return (
      <Shadow>
      <View style={[styles.element,styles.margin]}>
        <Text style={styles.label}>{label}</Text>
        <View>
          <Shadow>
          <View
            style={styles.gradient}
            onLayout={(event) => {
              this.setState({widthCursor:event.nativeEvent.layout.width})
            }}
          >
            {gradient}
          </View>
          </Shadow>
          <View style={[{left:this._leftCursor()},styles.cursor]}/>
        </View>
        <View style={{flexDirection: 'row', marginTop: 20}}><Icon name='calendar' size={20} color="black" style={[{position: 'relative',top: -2},styles.element_icon]}/><Text>{desc}</Text></View>
      </View>
      </Shadow>
    )
  }

  _leftCursor() {
    let pourcent = 0,
    millesime=parseInt(this.props.wine.millesime,10),
    yearmin=parseInt(this.props.wine.yearmin,10),
    yearmax=parseInt(this.props.wine.yearmax,10)

    if (this.props.wine.yearmin && yearmax) {
      let moyen = (millesime+yearmin + millesime+yearmax)/2,
      ecart=new Date().getFullYear()-moyen,
      ecartT=(yearmax-yearmin)/2
      pourcent = ecart*(1/3/2*100)/ecartT+50
    } else if (yearmin) {
      let inf = millesime+yearmin,
      ecart=new Date().getFullYear()-inf,
      ecartT=(yearmin)/2
      pourcent = ecart*(1/3/2*100)/ecartT+(1/3*100)
    } else if (yearmax) {
      let sup = millesime+yearmax,
      ecart=new Date().getFullYear()-sup,
      ecartT=(yearmax)/2
      pourcent = ecart*(1/3/2*100)/ecartT+(2/3*100)
    }

    if (pourcent*this.state.widthCursor/100) {
      if (pourcent < 5) return (8)*this.state.widthCursor/100-5
      if (pourcent > 95) return (92)*this.state.widthCursor/100-5
      return pourcent*this.state.widthCursor/100-5
    }
    return 3
  }

  render() {
    return (
      <ScrollView vertical={true}>
        <View style={styles.main_container}>
          <Text style={ [styles.name,styles.margin] }>{ this.props.wine.domain.name } { this.props.wine.millesime }</Text>
          <View style={[globalStyles.row,globalStyles.mt5,{alignItems: 'flex-end'}]}>
            <Text style={styles.appellation}>{ this.props.wine.appellation.name }</Text>
            <Text style={[globalStyles.h3,globalStyles.ml5,{bottom:2}]}>{(this.props.wine.appellation.label?'('+this.props.wine.appellation.label+')':null)}</Text>
          </View>
          <View style={ [styles.line,styles.margin] }></View>
          <Shadow>
          <View style={ [styles.element, styles.margin]}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.element_props}>
                <View style={styles.icon_props}><Icon name='university' size={15} color="black"/></View>
                <View style={styles.label_props_container}><Text style={styles.label_props}>Région</Text><Text>{this.props.wine.region.name.replace(/-/g,' ')}</Text></View>
              </View>
              <View style={styles.element_props}>
                <View style={styles.icon_props}><Icon name='globe-europe' size={15} color="black"/></View>
                <View style={styles.label_props_container}><Text style={styles.label_props}>Pays</Text><Text>{this.props.wine.country.name.replace(/-/g,' ')}</Text></View>
              </View>
            </View>
            <View style={{flexDirection: 'row',marginTop: 20}}>
              <View style={styles.element_props}>
                <View style={styles.icon_props}><Icon name='palette' size={15} color="black"/></View>
                <View style={styles.label_props_container}><Text style={styles.label_props}>Couleur</Text><Text>{this.color.label}</Text></View>
              </View>
              <View style={styles.element_props}>
                <View style={styles.icon_props}><Icon name='wine-bottle' size={15} color="black"/></View>
                <View style={styles.label_props_container}><Text style={styles.label_props}>Taille</Text><Text>{this.props.wine.size/1000}L</Text></View>
              </View>
            </View>
            <View style={{flexDirection: 'row',marginTop: 20}}>
              <View style={styles.element_props}>
                <View style={styles.icon_props}><Icon name='soap' size={15} color="black"/></View>
                <View style={styles.label_props_container}><Text style={styles.label_props}>Pétillant</Text><Text>{(this.props.wine.sparkling?'Oui':'Non')}</Text></View>
              </View>
              <View style={styles.element_props}>
                <View style={styles.icon_props}><Icon name='leaf' size={15} color="black"/></View>
                <View style={styles.label_props_container}><Text style={styles.label_props}>Bio</Text><Text>{(this.props.wine.bio?'Oui':'Non')}</Text></View>
              </View>
            </View>
          </View>
          </Shadow>
          {this._drawAging()}
          <Shadow>
          <View style={ [styles.element, styles.margin]}>
            <Text style={styles.label}>{this.props.wine.quantity} bouteilles en réserve <Text style={styles.label_props}>{(this.props.freeWine>0?'dont '+(this.props.freeWine===1?'une':this.props.freeWine)+' en vrac':'')}</Text></Text>
            <CustomButton
              style={[{ marginBottom: 10 }]}
              action={this._searchWineInCellars}
              text={ 'Trouver mes bouteilles' }
              icon="search"
              colorBg='#8AA29E'
            />
            <CustomButton
              style={[{ marginBottom: 10 }]}
              action={this._addOneWine}
              text={ 'Ajouter une bouteille' }
              icon="plus"
              colorBg='#8AA29E'
            />
            {this._showStockButton()}
          </View>
          </Shadow>
          {this._drawTemp()}
          {this._drawVarieties()}
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    marginLeft: 30,
    marginRight: 30,
  },
  element: {
    padding: 30,
    backgroundColor:'white',
    borderRadius: 10,
    marginBottom: 20,
  },
    element_icon: {
      marginRight: 10,
    },
  label: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Bold',
    color:'#053C5C',
    marginBottom: 20
  },
  name: {
    textTransform: 'uppercase',
    marginTop: 20,
    fontSize: 20,
    fontFamily: 'Ubuntu-Bold',
    color: '#053C5C'
  },
  appellation: {
    fontSize: 18,
    color: '#686963',
  },
  line: {
    marginTop: 10,
    marginBottom: 20,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  gradient: {
    flex:1,
    height:20,
    backgroundColor:'white',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'grey',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cursor: {
    position: 'absolute',
    height: 30,
    top:-5,
    borderRadius: 100,
    width: 10,
    backgroundColor: 'lightgrey',
    borderWidth: 2,
    borderColor: '#053C5C',
  },
  icon_props: {
    flex:2,
    justifyContent: 'center'
  },
  element_props: {
    flexDirection: 'row',
    flex:1
  },
    label_props_container: {
      flex: 7
    },
      label_props: {
        textTransform:'uppercase',
        fontSize: 8,
        color: 'grey'
      }
})

const mapStateToProps = (state, props) => {
  return {
    wine: getWine(state, props.route.params.wineId),
    freeWine: countFreeWine(state, props.route.params.wineId),
    cellars: getCellarsByWine(state, props.route.params.wineId),
  };
}

const mapDispatchToProps = dispatch => {
	return {
    updateCurrentSearch: data => dispatch({type:'UPDATE_CURRENT_SEARCH', payload:data}),
    updateWine: data => dispatch({type:'UPDATE_WINE', payload:data}),
	}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WineDetail)
