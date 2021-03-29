// Components/Search.js

import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import ScrollableTable from '../../Global/ScrollableTable'
import DrawBlock from '../../Global/DrawBlock'
import { connect } from 'react-redux'
import { getBlock, getWine, countFreeWine } from '../../../orm/selectors'
import CustomButton from '../../Global/CustomButton'
import { StackActions } from '@react-navigation/native'
import { prepareStyleCircleForStock } from '../../Global/prepareStyleCircle'
import Loader from '../../Global/Loader'
import globalStyles from '../../Global/globalStyles'

class StockBlock extends React.Component {

  constructor(props) {
    super(props)

    this.state={
      activeStock:[],
    }
    // isLoading:false

    this.stocked = 0
  }

  _toWineDetail = () => {
    this.props.navigation.push("WineDetail", { wineId: this.props.route.params.stockId })
  }

  _stockWine = () => {
    // this.setState({isLoading:true})

    let positions = this.state.activeStock,
    nbToStock = positions.length,
    nbStocked = 0

    this.setState({
      activeStock:[]
    })

    positions.map(p => {
      let id = 'x'+p.x+'y'+p.y+this.props.block.id
      this.props.addPosition({
        id: id,
        wine: this.props.route.params.stockId,
        block: this.props.block.id,
        enabled:true,
        x: p.x,
        y: p.y
      })
      nbStocked++
      this.stocked--

      // if (nbStocked === nbToStock) this.setState({isLoading:false})
    })
  }

  _showStockButton() {
    if (this.state.activeStock.length === 0) return
    return (
      <CustomButton
        action={this._stockWine}
        style={[globalStyles.mb10]}
        text={(this.state.activeStock.length===1?'Placer ma bouteille':'Placer mes '+this.state.activeStock.length+' bouteilles')}
        icon="dolly-flatbed"
        colorBg='#2F6F8F'
      />
    )
  }

  _backToBlock = () => {
    this.props.navigation.dispatch(StackActions.popToTop())
    this.props.navigation.navigate("Block", { blockId: this.props.route.params.blockId })
  }

  _addActiveStock = (wine, x, y) => {
    if (wine) return

    let index = this.state.activeStock.findIndex(as => as.x === x && as.y === y)

    if (index !== -1) {
      this.state.activeStock.splice(index, 1)
      this.setState({
        activeStock: this.state.activeStock
      })
      this.stocked--
      return
    }

    if (this.stocked === this.props.quantity) return

    this.stocked++
    this.setState({
      activeStock: [...this.state.activeStock, {x: x, y: y}]
    })
  }

  componentDidUpdate() {
    if (!this.props.quantity) this._backToBlock()
  }

  render() {
    return (
    <ScrollView vertical={true}>
      <View style={ globalStyles.main_container }>

        {/*<Loader
          isLoading={this.state.isLoading}
        />*/}

        <View>
          <ScrollableTable style={{marginTop: 20,marginBottom: 20}}>
            <DrawBlock
              block={ this.props.block }
              size={40}
              navigation={ this.props.navigation }
              touchable={ (this.props.route.params.stockId?'stock':true) }
              action={ this._addActiveStock }
              activeStock={ this.state.activeStock }
              prepareStyleCircle={ prepareStyleCircleForStock }
              key={ this.state.activeStock.length }
            />
          </ScrollableTable>
          <Text style={ [globalStyles.h1,globalStyles.mb20] }>{this.state.activeStock.length} / {this.props.quantity}</Text>
          {this._showStockButton()}
          <CustomButton
            style={[globalStyles.mb10]}
            action={this._backToBlock}
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
    </ScrollView>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    block: getBlock(state, props.route.params.blockId),
    wine: getWine(state, props.route.params.stockId),
    quantity: countFreeWine(state, props.route.params.stockId),
  };
}

const mapDispatchToProps = dispatch => {
	return {
    addPosition: data => dispatch({type:'CREATE_POSITION', payload:data}),
	}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StockBlock)
