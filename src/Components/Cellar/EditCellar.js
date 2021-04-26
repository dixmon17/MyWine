import React from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, TextInput } from 'react-native'
import ScrollableTable from '../Global/ScrollableTable'
import DrawCellar from '../Global/DrawCellar'
import { connect } from 'react-redux'
import { getCellar, getBlock, getPosition } from '../../orm/selectors'
import Picker from '../Global/Picker'
import Icon from 'react-native-vector-icons/FontAwesome5'
import CustomButton from '../Global/CustomButton'
import UUIDGenerator from 'react-native-uuid-generator'
import globalStyles from '../Global/globalStyles'
import colors from '../Global/colors'
import Shadow from '../Global/Shadow'
import { Badge } from 'react-native-paper'
import { sort } from '../../method/object'

class EditCellar extends React.Component {

  constructor(props) {
    super(props)

    
    let cellar = {}
    
    if (this.props.route.params && this.props.cellars.length > 0) {
      cellar=this.props.cellars.find(c => c.id === this.props.route.params.cellarId)
    } else if (this.props.cellars.length > 0) {
      cellar=this.props.cellars[0]
    }
    
    this.state={
      cellar:cellar
    }
    this.select = cellar.id
    this.cellarName=cellar.name
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
    data.push({
      label:"Créer une nouvelle cave",
      value:0,
      icon:'plus',
      color:colors.red
    })

    return (
      <View style={[globalStyles.row]}>
        {(data.length-1>1?(<Badge style={[{backgroundColor:colors.blue,paddingLeft: 8,paddingRight: 8, alignSelf: 'center'},globalStyles.mr10]} size={20}>{data.length-1} caves</Badge>):null)}
        <Picker
          style={styles.picker}
          data={sort(data,'createdAt')}
          selectedValue={ this.state.cellar.id }
          onChange={ (value) => this._onChangeCellar(value) }
          key={this.state.cellar.id}
        />
      </View>
    )
  }

  _onChangeCellar(cellarId) {
    if (cellarId === this.select) return
    this.select=cellarId
    if (cellarId === 0) {
      UUIDGenerator.getRandomUUID().then((uuid) => {
        let newCellar = {name:'Ma nouvelle cave', id: uuid, enabled:true}
        this.props.createCellar(newCellar)
        this.cellarName=newCellar.name
        this._onChangeCellar(uuid)
      })
      return
    }
    this.setState({
      cellar: this.props.cellars.find(c => c.id === cellarId)
    }, () => this.cellarName = this.state.cellar.name)
  }

  _nameTextInputChange(text) {
    this.cellarName = text
  }

  _updateCellar = () => {
    this.props.updateCellar({
      id: this.state.cellar.id,
      name: this.cellarName
    })
    this.props.navigation.goBack()
  }

  _removeCellar = () => {
    let blocks = this.props.blocks.filter(b => b.cellar === this.state.cellar.id), ids = []
    blocks.map(b => ids.push(b.id))
    let positions = this.props.positions.filter(p => ids.includes(p.block))

    this.props.removePositionByArray(positions)
    blocks.map(b => this.props.removeBlock(b.id))
    this.props.removeCellar(this.state.cellar.id)

    this._onChangeCellar(this.state.cellar.id === this.props.cellars[0].id?this.props.cellars[1].id:this.props.cellars[0].id)
  }

  _toBlock = (blockId, searchId) => {
    this.props.navigation.navigate('EditBlock', {blockId:blockId})
  }

  _addBlock = (c, l) => {
    let id = 'x'+c+'y'+l+this.state.cellar.id
    this.props.createBlock({
      id: id,
      x: c,
      y: l,
      cellar: this.state.cellar.id,
      nbColumn: 4,
      nbLine: 3
    })
    this.props.navigation.navigate('EditBlock', { blockId: id })
  }

  _drawBody() {
    if (this.props.cellars.length === 0) return (
      <View style={[globalStyles.p5,globalStyles.mt20]}>
        <Text style={globalStyles.h1}>Vous n'avez pas encore de cave</Text>
        <Text style={[globalStyles.h3,globalStyles.mt5]}>Créez-en une sur la page précédente</Text>
      </View>
    )
    return(
      <View>
        {this._drawPicker()}

        <Shadow>
        <View style={styles.text_input_container}>
          <Icon
            name="edit"
            color={colors.blue}
            size={18}
          />
          <TextInput
           style={styles.text_input}
           onChangeText={(text) => this._nameTextInputChange(text)}
           onSubmitEditing={() => {return}}
           placeholder='Nom de la cave'
           defaultValue={this.state.cellar.name}
          />
        </View>
        </Shadow>

        <DrawCellar
          cellar={ this.state.cellar }
          navigation={this.props.navigation}
          toBlock={ this._toBlock }
          addBlock={ this._addBlock }
          action="edit"
          key={[this.state.cellar.id,this.props.blocks.length, this.select]}
          sizeIcon={8}
          sizeMargin={1}
        />

        <CustomButton
          action={this._updateCellar}
          style={[globalStyles.mt20,globalStyles.mb10]}
          text="Valider les changements"
          colorBg={colors.blue}
          icon="check"
        />

        {(this.props.cellars.length>1 ? (
          <CustomButton
            action={this._removeCellar}
            style={globalStyles.mb20}
            text="Supprimer cette cave"
            icon="trash"
            colorBg={colors.red}
          />
        ) : null)}
      </View>
    )
  }

  render() {
    return (
      <ScrollView vertical={true}>
        <View style={globalStyles.main_container}>
          {this._drawBody()}
        </View>
      </ScrollView>
    )
  }

}

const styles = StyleSheet.create({
  picker: {
    marginTop: -14,
    marginBottom: -14,
    marginLeft: -7,
    color: "#2F6F8F",
  },

  text_input_container: {
    borderRadius: 50,
    padding: 10,
    paddingLeft: 20,
    backgroundColor: 'white',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
    text_input: {
      flex:1,
      marginLeft: 10,
      fontSize: 15,
      color: "#2F6F8F",
      fontFamily: 'OpenSans-Bold',
      padding: 0,
    },
})

const mapStateToProps = (state, props) => {
  return {
    cellars: getCellar(state).filter(c => c.enabled),
    blocks:getBlock(state).filter(b => b.enabled),
    positions:getPosition(state).filter(p => p.enabled),
  }
}

const mapDispatchToProps = dispatch => {
	return {
    createCellar: data => dispatch({type:'CREATE_CELLAR',payload:data}),
    createBlock: data => dispatch({type:'CREATE_BLOCK', payload:data}),
    updateCellar: data => dispatch({type:'UPDATE_CELLAR',payload:data}),
    removeCellar: data => dispatch({type:'DELETE_CELLAR',payload:data}),
    removePositionByArray: data => dispatch({type:'DELETE_POSITION_BY_ARRAY', payload:data}),
    removeBlock: data => dispatch({type:'DELETE_BLOCK', payload:data}),
	}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditCellar)
