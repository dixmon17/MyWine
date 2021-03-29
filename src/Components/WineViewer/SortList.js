// Components/Search.js

import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Text, Platform, UIManager, LayoutAnimation, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { getWines, getRegionsForSort, getAppellationsForSort, getDomainsForSort, getAppellations } from '../../orm/selectors'
import WineList from './WineList'
import CustomButton from '../Global/CustomButton'
import CheckButton from '../Global/CheckButton'
import Filter from './Filter'
import { makeUniq, sort } from '../../method/object'
import { size } from '../../data/size'
import { List } from 'react-native-paper';

class SortList extends React.Component {

  constructor(props) {
    super(props)

    this.wines

    this.sortList = [{name:'Millésime',id:'millesime'},{name:'Appellation',id:'appellation'},{name:'Domaine',id:"domain"}]
    this.colorList = [{name:'Blanc',id:'w'},{name:'Rosé',id:'p'},{name:'Rouge',id:'r'}]

    //Les labels par défaut des filtres
    this.labelRegionDefault = 'Sélectionner une région'
    this.labelAppellationDefault = 'Sélectionner une appellation'
    this.labelDomainDefault = 'Sélectionner un domaine'
    this.labelSizeDefault = 'Sélectionner une contenance'
    this.labelColorDefault = 'Sélectionner une couleur'

    this.state = {
      filters:{
        region:(this.props.cat === 'region' ? this.props.catId : null),
        appellations:(this.props.cat === 'appellation' ? [this.props.catId] : null),
        domain:(this.props.cat === 'domain' ? this.props.catId : null),
        size:null,
        color:null,
        sort:'millesime',
        age:[0,1,2]
      },
      choicesRegions: [],
      choicesAppellations: [],
      choicesDomains: [],
      choicesSizes: [],
      choicesColors: [],
      choicesSorts: [],
      labelRegion: (this.props.cat === 'region'?this._label('Region', this.props.regions.find(d => d.id === this.props.catId).name):'Sélectionner une région'),
      labelAppellation: (this.props.cat === 'appellation'?this._label('Appellation', this.props.appellations.find(d => d.id === this.props.catId).name):'Sélectionner une appellation'),
      labelDomain: (this.props.cat === 'domain'?this._label('Domain', this.props.domains.find(d => d.id === this.props.catId).name):'Sélectionner un domaine'),
      labelSize: this.labelSizeDefault,
      labelColor: this.labelColorDefault,
      labelSort: this._label('Trier par', 'millésime'),
      expanded:null
    }

    if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental(true)
  }

  _expandAction = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    if (this.state.expanded === id) {
      this.setState({expanded:null})
    } else {
      this.setState({expanded:id})
    }
  }

  //Affichage des filtres
  _displayButtons() {
    if (this.props.option) {
      return (
        <ScrollView style={ styles.button_popup_container }>
          {this._resetAllButton()}
          <Filter
            expanded={this.state.expanded}
            expandAction={this._expandAction}
            showList={this._showRegions()}
            label={this.state.labelRegion}
            icon="university"
            reset={(this.state.filters.region?true:false)}
            search={this._searchByRegion}
          />
          <Filter
            expanded={this.state.expanded}
            expandAction={this._expandAction}
            showList={this._showAppellations()}
            label={this.state.labelAppellation}
            icon="tags"
            reset={(this.state.filters.appellations?true:false)}
            search={this._searchByAppellation}
          />
          <Filter
            expanded={this.state.expanded}
            expandAction={this._expandAction}
            showList={this._showDomains()}
            label={this.state.labelDomain}
            icon="chess-rook"
            reset={(this.state.filters.domain?true:false)}
            search={this._searchByDomain}
          />
          <Filter
            expanded={this.state.expanded}
            expandAction={this._expandAction}
            showList={this._showSizes()}
            label={this.state.labelSize}
            icon="wine-bottle"
            reset={(this.state.filters.size?true:false)}
            search={this._searchBySize}
          />
          <Filter
            expanded={this.state.expanded}
            expandAction={this._expandAction}
            showList={this._showColors()}
            label={this.state.labelColor}
            icon="palette"
            reset={(this.state.filters.color?true:false)}
            search={this._searchByColor}
          />
          <Filter
            expanded={this.state.expanded}
            expandAction={this._expandAction}
            showList={this._showSorts()}
            label={this.state.labelSort}
            icon="sort"
            options={this.state.choicesSorts }
            search={this._sort}
          />
          <View style={{flexDirection: 'row',justifyContent: 'center', marginBottom: 20}}>
            <CheckButton
              selected={(!this.state.filters.age.includes(0)?true:false)}
              color='#DB5461'
              action={() => this._filterByAge(0)}
            >
              Jeune
            </CheckButton>
            <CheckButton
              selected={(!this.state.filters.age.includes(1)?true:false)}
              color='#DB5461'
              action={() => this._filterByAge(1)}
            >
              Apogée
            </CheckButton>
            <CheckButton
              selected={(!this.state.filters.age.includes(2)?true:false)}
              color='#DB5461'
              action={() => this._filterByAge(2)}
            >
              Âgé
            </CheckButton>
          </View>
          <CustomButton
            action={() => this.props.setOption(false)}
            style={{marginBottom: 50}}
            text="Filtrer"
            colorBg='#2F6F8F'
            icon="check"
          />
        </ScrollView>
      )
    }
  }

  //Mise à jour des labels après sélection d'un filtre (ex : REGION : Bordeaux)
  _label(cat, name) {
    return(
      <Text><Text style={{fontFamily: 'OpenSans-Bold', textTransform: 'uppercase'}}>{ cat } : </Text><Text>{ name }</Text></Text>
    )
  }

  //Affichage de la liste de tri
  _showSorts = () => {
    return this.sortList
  }

  //Affichage de la liste des régions
  _showRegions = () => {
    let regionsTmp = [], regions = []
    this._filter().map(w => {
      if (!regionsTmp.includes(w.appellation.region)) regionsTmp.push(w.appellation.region)
    })

    regionsTmp.map(rTmp => regions.push(this.props.regions.find(r => r.id === rTmp)))
    return sort(regions, 'name')
  }

  //Affichage de la liste des appellations
  _showAppellations = () => {
    let appellationsTmp = [], appellations = []
    this._filter().map(w => {
      if (!appellationsTmp.includes(w.appellation.id)) appellationsTmp.push(w.appellation.id)
    })

    appellationsTmp.map(aTmp => {
      let app = this.props.appellations.find(r => r.id === aTmp),
      index = appellations.findIndex(a => a.name === app.name && a.region === app.region)

      if (index > -1) {
        appellations[index].id.push(app.id)
        return
      }

      appellations.push({
        name: app.name,
        region: app.region,
        id: [app.id]
      })
    })

    return sort(appellations, 'name')
  }

  //Affichage de la liste des domaines
  _showDomains = () => {
    let domainsTmp = [], domains = []
    this._filter().map(w => {
      if (!domainsTmp.includes(w.domain.id)) domainsTmp.push(w.domain.id)
    })

    domainsTmp.map(dTmp => domains.push(this.props.domains.find(r => r.id === dTmp)))
    return sort(domains, 'name')
  }

  //Affichage de la liste des domaines
  _showSizes = () => {
    let sizesTmp = [], sizes = []
    this._filter().map(w => {
      if (!sizesTmp.includes(w.size)) sizesTmp.push(w.size)
    })

    sizesTmp.map(sTmp => sizes.push({id:sTmp, name:size.find(s => s.size === sTmp).name}))
    return sort(sizes, 'name')
  }

  //Affichage de la liste des régions
  _showColors = () => {
    let colorsTmp = [], colors = []
    this._filter().map(w => {
      if (!colorsTmp.includes(w.appellation.color)) colorsTmp.push(w.appellation.color)
    })

    colorsTmp.map(cTmp => colors.push({id:cTmp, name:this.colorList.find(c => c.id === cTmp).name}))
    return sort(colors, 'name')
  }

  //Filtrage par la région (réalisation de la liste)
  _searchByRegion = (regionId, regionName) => {
    this.setState({
      filters:{...this.state.filters,region:regionId},
      labelRegion: (regionName?this._label('Region', regionName):this.labelRegionDefault),
    }, () => this._filter())
  }

  //Filtrage par l'appellation (réalisation de la liste)
  _searchByAppellation = (appellationIds, appellationName) => {
    this.setState({
      filters:{...this.state.filters,appellations:appellationIds},
      labelAppellation: (appellationName?this._label('Appellation', appellationName):this.labelAppellationDefault),
    }, () => this._filter())
  }

  //Filtrage par le domaine (réalisation de la liste)
  _searchByDomain = (domainId, domainName) => {
    this.setState({
      filters:{...this.state.filters,domain:domainId},
      labelDomain: (domainName?this._label('Domaine', domainName):this.labelDomainDefault),
    }, () => this._filter())
  }

  //Filtrage par le domaine (réalisation de la liste)
  _searchBySize = (sizeId, sizeName) => {
    this.setState({
      filters:{...this.state.filters,size:sizeId},
      labelSize: (sizeName?this._label('Contenance', sizeName):this.labelSizeDefault),
    }, () => this._filter())
  }

  //Filtrage par la couleur (réalisation de la liste)
  _searchByColor = (colorId, colorName) => {
      this.setState({
        filters:{...this.state.filters,color:colorId},
        labelColor: (colorName?this._label('Couleur', colorName):this.labelColorDefault),
      }, () => this._filter())
  }

  _sort = (sortId) => {
    this.setState({
      filters:{...this.state.filters,sort:sortId},
      labelSort: this._label('Trier par', this.sortList.find(s => s.id === sortId).name),
    }, () => this._filter())
  }

  _filterByAge = (ageId) => {
    let index = this.state.filters.age.findIndex(a => a === ageId),
    list = this.state.filters.age
    if (list) (index > -1 ? delete list[index] : list.push(ageId))

    this.setState({
      filters:{...this.state.filters,age:list}
    }, () => this._filter())
  }

  _resetAll = () => {
    this.setState({
      filters:{region:null,appellations:null,domain:null,color:null,sort:this.state.filters.sort,age:this.state.filters.age},
      labelRegion:this.labelRegionDefault,
      labelAppellation:this.labelAppellationDefault,
      labelDomain:this.labelDomainDefault,
      labelSize:this.labelSizeDefault,
      labelColor:this.labelColorDefault,
    }, () => this._filter())
  }

  //Affichage du bouton pour tout réinitialiser
  _resetAllButton() {
    //Si un filtre a déjà été selectionné
    if (this.state.filters.region || this.state.filters.appellations || this.state.filters.domain || this.state.filters.size || this.state.filters.color) {
      return(
        <CustomButton
          style={{marginBottom: 20}}
          action={this._resetAll}
          text="Réinitialiser tous les filtres"
          icon="trash"
          colorBg="#A3301C"
        />
      )
    }
  }

  _getAgeState(millesime, yearmin, yearmax) {
    if (!yearmin && !yearmax) return 1

    let state, year = new Date().getFullYear()-parseInt(millesime,10)

    if (year >= yearmin || !yearmin) {
      if (year <= yearmax || !yearmax) {
        state = 1
      } else {
        state = 2
      }
    } else {
      state = 0
    }

    return state
  }

  _filter() {
    let wines = this.props.wines.filter(w => (
      w.appellation && w.domain &&
      (this.state.filters.region ? w.appellation.region === this.state.filters.region || w.domain.region === this.state.filters.region : true) &&
      (this.state.filters.appellations ? this.state.filters.appellations.includes(w.appellation.id) : true) &&
      (this.state.filters.domain ? w.domain.id === this.state.filters.domain : true) &&
      (this.state.filters.size ? w.size === this.state.filters.size : true) &&
      (this.state.filters.color ? w.appellation.color === this.state.filters.color : true) &&
      (this.state.filters.age.includes(this._getAgeState(w.millesime, w.yearmin, w.yearmax)))
    ))
    wines.map(w => {
      w.millesimeSort = w.millesime
      w.appellationSort = w.appellation.name
      w.domainSort = w.domain.name
    })

    this.wines = sort(wines,this.state.filters.sort+'Sort')
    return this.wines
  }

  _makeAppellationSearch() {
    let appellation

    if (this.state.filters.appellations && this.state.filters.appellations.length === 1) {
      appellation = this.props.appellationsAll.find(a => a.id === this.state.filters.appellations[0])
    } else if (this.state.filters.appellations && this.state.filters.color) {
      appellation = this.props.appellationsAll.find(a => this.state.filters.appellations.includes(a.id) && a.color === this.state.filters.color)
    }

    return appellation
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this._displayButtons()}
        <WineList
          appellationSearch={this._makeAppellationSearch()}
          wines={ this._filter() }
          navigation={ this.props.navigation }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
    button_popup_container: {
      padding: 20,
      position: 'absolute',
      top:0,
      bottom: 0,
      left:0,
      right:0,
      zIndex: 10,
      backgroundColor: '#fafafa',
    },
    reset_option: {
      marginLeft: 15,
      paddingBottom: 10,
    },
      reset_text: {
        textTransform: 'uppercase',
        fontSize: 15,
        fontFamily: 'OpenSans-Bold',
        color: '#053C5C'
      }
})

const mapStateToProps = state => {
  return {
    regions: getRegionsForSort(state).filter(r => r.enabled),
    appellations: getAppellationsForSort(state).filter(a => a.enabled),
    appellationsAll: getAppellations(state),
    domains: getDomainsForSort(state).filter(d => d.enabled),
    wines: getWines(state).filter(w => w.quantity > 0),
  };
}

export default connect(mapStateToProps)(SortList)
