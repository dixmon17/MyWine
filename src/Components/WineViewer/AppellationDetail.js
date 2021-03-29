// Components/Search.js

import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { getAppellationWithDependencies } from '../../orm/selectors'
import { colorLabel } from '../../data/color'
import CustomButton from '../Global/CustomButton'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome5'
import globalStyles from '../Global/globalStyles'
import CustomTextInput from '../Global/TextInput'
import Shadow from '../Global/Shadow'

class AppellationDetail extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      widthCursor:undefined,
      millesime:new Date().getFullYear()-1
    }

    this.color = colorLabel.find(c => c.value === this.props.appellation.color)
  }

  _addOneWine = () => {
    // this.props.updateWine({
    //   quantity: parseInt(this.props.wine.quantity)+1,
    //   id: this.data.id
    // })
  }

  _drawTemp() {
    let text
    if (this.props.appellation.tempmin && this.props.appellation.tempmax) {
      text = 'Servir entre '+this.props.appellation.tempmin+'°C et '+this.props.appellation.tempmax+'°C'
    } else if (this.props.appellation.tempmin || this.props.appellation.tempmax) {
      text = 'Servir à '+(this.props.appellation.tempmin?this.props.appellation.tempmin:this.props.appellation.tempmax)+'°C'
    } else {
      return
    }

    return(<Shadow><View style={[styles.element,styles.margin,{flexDirection: 'row'}]}><Icon name='thermometer-half' size={20} color="black" style={styles.element_icon}/><Text>{text}</Text></View></Shadow>)
  }

  _drawAging() {
    if (!this.props.appellation.yearmin && !this.props.appellation.yearmax) return

    let gradient, label, desc, year = new Date().getFullYear()-parseInt(this.state.millesime,10)

    if (year >= this.props.appellation.yearmin || !this.props.appellation.yearmin) {
      if (year <= this.props.appellation.yearmax || !this.props.appellation.yearmax) {
        label = 'Prêt à boire'
      } else {
        label = 'Peut-être trop âgé'
      }
    } else {
      label = 'Peut-être trop jeune'
    }

    if (this.props.appellation.yearmin && this.props.appellation.yearmax) {
      gradient = (<LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} locations={[0,0.1,0.5,0.6,0.9,1]} colors={['#98BDD6', '#98BDD6', '#69DBA0', '#69DBA0', '#DB6558', '#DB6558']} style={globalStyles.flex1}></LinearGradient>)
      desc = 'Potentiel de garde entre '+this.props.appellation.yearmin+' et '+this.props.appellation.yearmax+(this.props.appellation.yearmax===1?' an':' ans')
    } else if (this.props.appellation.yearmin) {
      gradient = (<LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} locations={[0,0.1,0.5]} colors={['#98BDD6', '#98BDD6', '#69DBA0']} style={globalStyles.flex1}></LinearGradient>)
      desc = 'Boire après '+this.props.appellation.yearmin+(this.props.appellation.yearmin===1?' an':' ans')+' de garde'
    } else if (this.props.appellation.yearmax) {
      gradient = (<LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} locations={[0.6,0.9,1]} colors={['#69DBA0', '#DB6558', '#DB6558']} style={globalStyles.flex1}></LinearGradient>)
      desc = 'Potentiel de garde de '+this.props.appellation.yearmax+(this.props.appellation.yearmax===1?' an':' ans')
    }

    return (
      <Shadow>
      <View style={[styles.element,styles.margin]}>
        <CustomTextInput
          color='#053C5C'
          style={{backgroundColor: '#EDEDED'}}
          placeholder='millésime'
          defaultValue={this.state.millesime.toString()}
          keyboardType='numeric'
          onChangeText={(date) => this.setState({millesime:date})}
        />
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
    millesime=parseInt(this.state.millesime,10),
    yearmin=parseInt(this.props.appellation.yearmin,10),
    yearmax=parseInt(this.props.appellation.yearmax,10)

    if (this.props.appellation.yearmin && yearmax) {
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
          <View style={[globalStyles.row,globalStyles.mt30,{alignItems: 'flex-end'}]}>
            <Text style={styles.appellation}>{ this.props.appellation.name }</Text>
            <Text style={[globalStyles.h3,globalStyles.ml5,{bottom:3}]}>{(this.props.appellation.label?'('+this.props.appellation.label+')':null)}</Text>
          </View>
          <View style={ [styles.line,styles.margin] }></View>
          <Shadow>
          <View style={ [styles.element, styles.margin]}>
            <View style={{flexDirection: 'row',marginBottom: 20}}>
              <View style={styles.element_props}>
                <View style={styles.icon_props}><Icon name='university' size={15} color="black"/></View>
                <View style={styles.label_props_container}><Text style={styles.label_props}>Région</Text><Text>{this.props.appellation.region.name.replace(/-/g,' ')}</Text></View>
              </View>
              <View style={styles.element_props}>
                <View style={styles.icon_props}><Icon name='globe-europe' size={15} color="black"/></View>
                <View style={styles.label_props_container}><Text style={styles.label_props}>Pays</Text><Text>{this.props.appellation.country.name.replace(/-/g,' ')}</Text></View>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.element_props}>
                <View style={styles.icon_props}><Icon name='palette' size={15} color="black"/></View>
                <View style={styles.label_props_container}><Text style={styles.label_props}>Couleur</Text><Text>{this.color.label}</Text></View>
              </View>
              <View style={styles.element_props}>
              </View>
            </View>
          </View>
          </Shadow>
          {this._drawAging()}
          {this._drawTemp()}
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
  appellation: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: '#053C5C'
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
    appellation: getAppellationWithDependencies(state, props.route.params.appellationId),
  };
}

export default connect(
  mapStateToProps,
  null
)(AppellationDetail)
