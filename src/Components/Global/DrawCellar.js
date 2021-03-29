import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Table, TableWrapper, Cell, Rows } from 'react-native-table-component'
import DrawBlock from './DrawBlock'
import { connect } from 'react-redux'
import { getBlocksByCellar } from '../../orm/selectors'
import { sort } from '../../method/object'
import { prepareStyleCircleForCellar } from './prepareStyleCircle'
import ScrollableTable from './ScrollableTable'

class DrawCellar extends React.Component {

  constructor(props) {
    super(props)

    this.refresh=0

    if (this.props.blocks.length === 0) {

      this.width = 20
      this.height = 20

      this.firstColumn = 0
      this.firstLine = 0

      this.lastColumn = 0
      this.lastLine = 0

      return
    }

    this.sizeIcon = (this.props.sizeIcon?this.props.sizeIcon:15)
    this.sizeMargin = (this.props.sizeMargin?this.props.sizeMargin:5)

    this.width = ((sort(this.props.blocks,'nbColumn','desc')[0].nbColumn)*(this.sizeIcon+2)+this.sizeMargin*2)*(this.props.blocks.find(b=>b.isAlternativ)?2:1)
    this.height = (sort(this.props.blocks,'nbLine','desc')[0].nbLine)*(this.sizeIcon+2)+this.sizeMargin*2

    this.firstColumn = parseInt(sort(this.props.blocks,'x')[0].x,10)
    this.firstLine = parseInt(sort(this.props.blocks,'y')[0].y,10)

    this.lastColumn = parseInt(sort(this.props.blocks,'x','desc')[0].x,10)
    this.lastLine = parseInt(sort(this.props.blocks,'y','desc')[0].y,10)
  }

  _drawCellar() {
    //Array temporaire avec les données
    let cellarData = [], nbCell = 0

    //Pour chaque ligne
    for (let l = (this.props.addBlock?this.lastLine+1:this.lastLine); l > (this.props.addBlock?this.firstLine-2:this.firstLine-1); l--) {
    // for (let l = this.lastLine; l > this.firstLine-1; l--) {
      //Données d'une ligne
      let rowData = []

      //Pour chaque colonne
      for (let c = (this.props.addBlock?this.firstColumn-1:this.firstColumn); c <= (this.props.addBlock?this.lastColumn+1:this.lastColumn); c++) {
      // for (let c = this.firstColumn; c <= this.lastColumn; c++) {
        //Index du block
        let block = this.props.blocks.find(element => element.x == c && element.y == l)

        //Si le block existe
        if (block) {
          nbCell++
          rowData.push(
            <View style={{width: this.width, height: this.height, alignItems: (block.horizontalAlignment?block.horizontalAlignment:'center'), justifyContent:(block.verticalAlignment?block.verticalAlignment:'center')}}>
            <TouchableOpacity onPress={() => this.props.toBlock(block.id, this.search)}>
              <DrawBlock
                block={ block }
                size={this.sizeIcon}
                margin={this.sizeMargin}
                search={this.props.search}
                stock={this.props.stock}
                prepareStyleCircle={ prepareStyleCircleForCellar }
                key={ this.props.search, this.refresh }
              />
            </TouchableOpacity>
            </View>
          )
        } else {
          //Si le block n'existe pas
          if (this.props.addBlock) {
            rowData.push(
              <TouchableOpacity style={{width: this.width, height: this.height, justifyContent: 'center', alignItems: 'center'}} onPress={() => this.props.addBlock(c,l)}>
                <Text style={{fontSize: 20,fontFamily: 'OpenSans-Bold'}}>+</Text>
              </TouchableOpacity>
            )
          } else {
            rowData.push(<View style={{width: this.width, height: this.height, justifyContent: 'center'}}/>)
          }
        }
      }
      //On ajoute les lignes au tableau
      cellarData.push(rowData)
    }

    if (nbCell === 0 && this.props.editCellar) cellarData[0][0] = (
      <TouchableOpacity style={{padding: 40, justifyContent: 'center', alignItems: 'center'}} onPress={() => this.props.editCellar()}>
        <Text style={{color: '#053C5C', textTransform: 'uppercase'}}>Composez votre cave</Text>
      </TouchableOpacity>
    )

    return cellarData
  }

  _resetConfiguration() {
    if (this.props.blocks.length === 0) {

      this.width = 20
      this.height = 20

      this.firstColumn = 0
      this.firstLine = 0

      this.lastColumn = 0
      this.lastLine = 0

      return
    }

    this.sizeIcon = (this.props.sizeIcon?this.props.sizeIcon:15)
    this.sizeMargin = (this.props.sizeMargin?this.props.sizeMargin:5)

    this.width = ((sort(this.props.blocks,'nbColumn','desc')[0].nbColumn)*(this.sizeIcon+2)+this.sizeMargin*2)*(this.props.blocks.find(b=>b.isAlternativ)?2:1)
    this.height = (sort(this.props.blocks,'nbLine','desc')[0].nbLine)*(this.sizeIcon+2)+this.sizeMargin*2

    this.firstColumn = parseInt(sort(this.props.blocks,'x')[0].x,10)
    this.firstLine = parseInt(sort(this.props.blocks,'y')[0].y,10)

    this.lastColumn = parseInt(sort(this.props.blocks,'x','desc')[0].x,10)
    this.lastLine = parseInt(sort(this.props.blocks,'y','desc')[0].y,10)
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('focus', () => {
      this._resetConfiguration()

      this.refresh++
    });
  }

  componentWillUnmount() {
    this._navListener()
  }

  render() {
    return (
      <ScrollableTable>
        <Table>
          <Rows data={this._drawCellar()} />
        </Table>
      </ScrollableTable>
    )
  }
}

const mapStateToProps = (state, props) => {
  let blocks = getBlocksByCellar(state, props.cellar.id)
  // (blocks&&Array.isArray(blocks)&&blocks.filter(b => b.enabled)?blocks=blocks.filter(b => b.enabled):blocks=[])
  return {
    blocks: (blocks&&Array.isArray(blocks)&&blocks.filter(b => b.enabled)?blocks.filter(b => b.enabled):[])
  };
}

export default connect(
  mapStateToProps,
  null
)(DrawCellar)
