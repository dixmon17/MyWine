import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Table, Rows } from 'react-native-table-component'
import { connect } from 'react-redux'
import { getWineByBlock } from '../../orm/selectors'
import { colorLabel } from '../../data/color'
import Icon from 'react-native-vector-icons/FontAwesome5'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true
}

class DrawBlock extends React.Component {

  constructor(props) {
    super(props)

    //Id du vin sélectionné
    this.searched=0

    //Block alternatif
    this.isAlternativ = (this.props.block?this.props.block.isAlternativ:false)
  }

  _drawBlock() {
    if (!this.props.blockContent || !this.props.block) return

    //Dimensions du block
    let nbColumn = (this.props.block?this.props.block.nbColumn:0), nbLine = (this.props.block?this.props.block.nbLine:0), isAlternativ = (this.props.block?this.props.block.isAlternativ:false)

    //Array temporaire avec les données
    let blockData = []

    //Pour chaque ligne du block
    for (let l=nbLine; l > 0; l--) {
      //Données d'une ligne
      let rowBlockData = []

      //Pour chaque colonne du block
      for (let c=1; c <= nbColumn; c++) {

        //Vin à ces coordonnées
        let wine = this.props.blockContent.find(w => w.x == c && w.y == l), searched

        //Si le vin est recherché
        if (wine && wine.id == this.props.search) {
          searched = true
          this.searched=wine.id
        }

        //CREATION DU CERCLE

        let cellData

        //Cas particulier des cases touchables
        if (this.props.action) {
          cellData = (
            <TouchableOpacity
              onPress={() => {
                ReactNativeHapticFeedback.trigger("selection", options);
                this.props.action(wine, c, l)
              }}
              onLongPress={() => {
                if (this.props.changeMultipleMode) {
                  ReactNativeHapticFeedback.trigger("notificationSuccess", options);
                  this.props.changeMultipleMode(wine, c, l)
                } else {
                  this.props.action(wine, c, l)
                }
              }}
            >
                { this.props.prepareStyleCircle(this.props.search, this.props.currentWine, this.props.activeStock, this.props.size, wine,c,l,searched) }
            </TouchableOpacity>
          )
        } else {
          cellData = this.props.prepareStyleCircle(this.props.search, this.props.currentWine, this.props.activeStock, this.props.size, wine,c,l,searched)
        }

        //FIN DE LA CREATION DU CERCLE

        if ((isAlternativ===1 && (l%2)) || (isAlternativ===2 && !(l%2))) {
          rowBlockData.push(cellData)
          rowBlockData.push(<View style={{height: this.props.size+2, width: this.props.size+2}}/>)
        } else if ((isAlternativ===1 && !(l%2)) || (isAlternativ===2 && (l%2))) {
          rowBlockData.push(<View style={{height: this.props.size+2, width: this.props.size+2}}/>)
          rowBlockData.push(cellData)
        } else {
          rowBlockData.push(cellData)
        }
      }
      //On ajoute la ligne à l'array des données
      blockData.push(rowBlockData)
    }

    //On retourne les données
    return blockData
  }

  render() {
    return (
      <Table style={{margin: (this.props.margin?this.props.margin:5), width: (this.props.block&&Number.isInteger(this.props.block.nbColumn)?this.props.block.nbColumn:0)*((this.props.size?this.props.size:20)+2)*((this.props.block?this.props.block.isAlternativ:false)?2:1), height: (this.props.block&&Number.isInteger(this.props.block.nbLine)?this.props.block.nbLine:0)*((this.props.size?this.props.size:20)+2)}}>
        <Rows data={this._drawBlock()} />
      </Table>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    blockContent: getWineByBlock(state, (props.block?props.block.id:0)),
  };
}

export default connect(
  mapStateToProps,
  null
)(DrawBlock)
