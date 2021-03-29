import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native'
import ScrollableTable from '../../Global/ScrollableTable'
import DrawCellar from '../../Global/DrawCellar'
import { connect } from 'react-redux'
import { getCellar } from '../../../orm/selectors'
import CustomButton from '../../Global/CustomButton'
import { StackActions } from '@react-navigation/native'
import {Picker} from '@react-native-community/picker'
import Icon from 'react-native-vector-icons/FontAwesome5'
import globalStyles from '../../Global/globalStyles'

class StockCellar extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      cellar: (props.route.params&&props.route.params.cellarId?props.cellars.find(c => c.id === props.route.params.cellarId):props.cellars[0])
    }
  }

  _toWineDetail = () => {
    this.props.navigation.push("WineDetail", { wineId: this.props.route.params.stockId })
  }

  _backToCellar = () => {
    this.props.navigation.dispatch(StackActions.popToTop())
    this.props.navigation.navigate("Cellar", { cellarId: (this.props.route.params&&this.props.route.params.cellarId ? this.props.route.params.cellarId : undefined) })
  }

  _drawPicker() {
    if (this.props.cellars.length < 1) return
    if (this.props.cellars.length === 1) return (
      <View style={styles.picker_container}>
        <Text style={styles.cellar_name}>{ this.state.cellar.name }</Text>
      </View>
    )
    return (
      <View style={styles.picker_container}>
        <Picker
          style={styles.picker}
          selectedValue={ this.state.cellar.id }
          onValueChange={ (value) => this._onChangeCellar(value) }
        >
          {this._cellarSelect()}
        </Picker>
      </View>
    )
  }

  _cellarSelect = () => {
    let items = []
    this.props.cellars.map(c =>
      items.push(
        <Picker.Item label={c.name} value={c.id} key={c.id}/>
      )
    )
    return items
  }

  _onChangeCellar(cellarId) {
    this.setState({
      cellar: this.props.cellars.find(c => c.id === cellarId)
    })
  }

  _drawBody() {
    if (!this.state.cellar) {
      return (
        <TouchableOpacity onPress={() => this.props.navigation.navigate('EditCellar')} style={styles.state_container}>
          <Icon
            name="warehouse"
            size={120}
            color="#053C5C"
          />
          <View style={styles.upload_button}>
            <Text style={styles.upload_button_text}>Créez votre première cave</Text>
          </View>
        </TouchableOpacity>
      )
    }
    return(
      <View>
        {this._drawPicker()}

        <View style={ styles.cellar_container }>
          <DrawCellar
            cellar={ this.state.cellar }
            toBlock={ this._toBlock }
            navigation={this.props.navigation}
            key={ this.state.cellar.id }
            redirection="StockBlock"
          />

          <CustomButton
            style={[globalStyles.mt20,globalStyles.mb10]}
            action={this._backToCellar}
            icon="angle-left"
            colorBg="#A3301C"
            size={20}
            text="Arreter le rangement"
          />
          <CustomButton
            style={globalStyles.mb20}
            action={this._toWineDetail}
            icon="info"
            colorBg='#2F6F8F'
            text="Voir la fiche de ce vin"
          />
        </View>
      </View>
    )
  }

  _toBlock = (blockId, searchId) => {
    this.props.navigation.navigate('StockBlock', {blockId:blockId, stockId:this.props.route.params.stockId})
  }

  render() {
    return (
      <ScrollView vertical={true}>
        <View style={ globalStyles.main_container }>
            {this._drawBody()}
        </View>
      </ScrollView>
    )
  }

}

const styles = StyleSheet.create({
  picker_container: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 16,
  },
    picker: {
      marginTop: -14,
      marginBottom: -14,
      marginLeft: -7,
      color: "#053C5C",
    },
    cellar_name: {
      fontSize: 16,
      color: "#053C5C",
    },
  state_container: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 80
  },
    upload_button: {
      backgroundColor: '#053C5C',
      borderRadius: 50,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10
    },
      upload_button_text: {
        color: 'white',
        fontFamily: 'OpenSans-Bold'
      },
})

const mapStateToProps = state => {
  return {
    cellars: getCellar(state).filter(c => c.enabled),
  };
}

const mapDispatchToProps = dispatch => {
	return {
    resetActiveStock: data => dispatch({type:'RESET_ACTIVE_STOCK'}),
	}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StockCellar)
