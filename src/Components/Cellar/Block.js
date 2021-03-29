import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import ScrollableTable from '../Global/ScrollableTable'
import DrawBlock from '../Global/DrawBlock'
import { connect } from 'react-redux'
import { getBlock, getWineByBlock, getAppellations, getDomains } from '../../orm/selectors'
import CustomButton from '../Global/CustomButton'
import { colorLabel } from '../../data/color'
import { prepareStyleCircleForOptions } from '../Global/prepareStyleCircle'
import globalStyles from '../Global/globalStyles'
import FadeIn from '../../animation/FadeIn'

class Block extends React.Component {

  constructor(props) {
    super(props)

    this.state={
      currentWine:{}
    }

    this.multiple = false
  }

  _searchWineInBlock = () => {
    this.props.updateCurrentSearch(this.state.currentWine.wine.id)
    this.props.navigation.navigate('CellarTab', {
      screen: 'Block'
    });
    //TODO : AFFICHER UNIQUEMENT LES CAVES QUI CONTIENNENT LE VINne
  }

  //Arreter la recherche d'un vin
  _stopSearch = () => {
    this.props.resetCurrentSearch()
  }

  //Afficher la fiche d'un vin
  _toWineDetail = () => {
    this.props.navigation.push("WineDetail", { wineId: this.state.currentWine.wine.id })
  }

  //Suppression d'une bouteille
  _drinkWine = () => {
    //Si plusieurs bouteilles ou une seule
    if (this.multiple) {
      this.state.currentWine.map(cW => {
        //On supprime la position
        this.props.removePosition({block:this.props.block.id, x:cW.x, y:cW.y})
        //On supprime la bouteille
        this.props.drinkWine(cW.wine.id)
      })
    } else {
      //On supprime la position
      this.props.removePosition({block:this.props.block.id, x:this.state.currentWine.x, y:this.state.currentWine.y})
      //On supprime la bouteille
      this.props.drinkWine(this.state.currentWine.wine.id)
    }

    //On ne recherche plus ce vin
    this.setState({
      currentWine:{}
    })
  }

  //Sortir une bouteille de la cave
  _unstockWine = () => {
    //Si plusieurs bouteilles ou une seule
    if (this.multiple) {
      this.state.currentWine.map(cW =>
        this.props.removePosition({block:this.props.block.id, x:cW.x, y:cW.y})
      )
    } else {
      this.props.removePosition({block:this.props.block.id, x:this.state.currentWine.x, y:this.state.currentWine.y})
    }

    //On ne recherche plus ce vin
    this.setState({
      currentWine:{}
    })
  }

  _changeMultipleMode = (wine, c, l) => {
    this.multiple = !this.multiple
    this._currentWine(wine, c, l)
  }

  _currentWine = (wine,x,y) => {
    if (!wine) return

    if (this.multiple) {
      let tmp

      //SI déjà plusieurs bouteilles SINON
      if (Array.isArray(this.state.currentWine)) {
        tmp = this.state.currentWine

        //Si on a séléctionné une case déjà cochée
        let erase = this.state.currentWine.findIndex(cW => cW.x === x && cW.y === y)

        if (erase === -1) {
          //On ajoute
          tmp = [...tmp, {wine:wine, x: x, y: y}]
        } else {
          //On enléve
          tmp = tmp.filter(e => e.x !== x || e.y !== y)
        }

      } else {
        tmp = [{wine:wine, x: x, y: y}]
      }

      this.setState({
        currentWine: tmp
      })
      return
    }

    this.setState({
      currentWine: {wine:wine, x: x, y: y}
    })
  }

  //Affichage des boutons en fonction du vin
  _drawOptions() {
    //Si on a cliqué sur un vin
    if (this.state.currentWine) {
      let wine = this.state.currentWine.wine

      //Si le vin existe
      if (!wine && !Array.isArray(this.state.currentWine)) return

      return (
        <FadeIn>
          <View style={[globalStyles.flex1,globalStyles.mb20,globalStyles.ml15]}>
          {(wine ? (
            <View>
              <Text style={ globalStyles.h1 }>{ wine.domainName } { wine.millesime }</Text>
              <Text style={ globalStyles.h2 }>{ wine.appellationName }</Text>
            </View>
          ) : (
            <Text style={ globalStyles.h1 }>{this.state.currentWine.length} bouteilles sélectionnées</Text>
          ))}
          </View>
          {(wine ? (
            <View>
            <CustomButton
              action={this._toWineDetail}
              text='Voir la fiche de ce vin'
              icon="info"
              colorBg='#8AA29E'
              style={globalStyles.mb10}
            />
            <CustomButton
              action={this._searchWineInBlock}
              text='Trouver mes bouteilles'
              icon="search"
              colorBg='#8AA29E'
              style={globalStyles.mb10}
            />
            </View>
          ) : null)}
          <CustomButton
            action={this._drinkWine}
            text="Boire cette bouteille"
            icon="glass-cheers"
            colorBg='#8AA29E'
            style={globalStyles.mb10}
          />
          <CustomButton
            action={this._unstockWine}
            text="Mettre cette bouteille en vrac"
            icon="sign-out-alt"
            colorBg='#8AA29E'
            style={globalStyles.mb20}
          />
        </FadeIn>
      )
    }
  }

  _drawStopSearchButton() {
    //Si une recherche est en cours
    if (this.props.currentSearch) {
      return(
        <CustomButton
          action={this._stopSearch}
          style={globalStyles.mb20}
          text="Arrêter la recherche"
          colorBg="#A3301C"
          icon="angle-left"
        />
      )
    }
  }

  //Si on a supprimé le block
  componentDidUpdate() {
    if (!this.props.block) this.props.navigation.goBack()
  }

  render() {
    return (
    <ScrollView vertical={true}>
      <View style={globalStyles.main_container}>
        <ScrollableTable style={[globalStyles.mt20,globalStyles.mb20]}>
          <DrawBlock
            block={ this.props.block }
            size={40}
            action={ this._currentWine }
            currentWine={ this.state.currentWine }
            prepareStyleCircle={ prepareStyleCircleForOptions }
            search={ this.props.currentSearch }
            changeMultipleMode= { this._changeMultipleMode }
          />
        </ScrollableTable>
        {this._drawStopSearchButton()}
        {this._drawOptions()}
      </View>
    </ScrollView>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    block: getBlock(state, props.route.params.blockId),
    currentSearch: state.currentSearch.id,
  };
}

const mapDispatchToProps = dispatch => {
	return {
    updateCurrentSearch: data => dispatch({type:'UPDATE_CURRENT_SEARCH', payload:data}),
    removePosition: data => dispatch({type:'DELETE_POSITION', payload:data}),
    resetCurrentSearch: data => dispatch({type:'RESET_CURRENT_SEARCH'}),
    drinkWine: data => dispatch({type:'DRINK_WINE', payload:data}),
	}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Block)
