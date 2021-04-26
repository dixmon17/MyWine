import React from 'react'
import { ScrollView, View, Text, Alert } from 'react-native'
import { connect } from 'react-redux'
import { getRegions, getCountry, getAppellations, getDomains, getSimplyWines, getVarieties } from '../../orm/selectors'
import UUIDGenerator from 'react-native-uuid-generator'
import globalStyles from '../Global/globalStyles'
import InputSearch from '../Global/InputSearch'
import AppellationForm from './Form/AppellationForm'
import WineForm from './Form/WineForm'
import { CommonActions } from '@react-navigation/native'
import { validateCountry, validateRegion, validateAppellation, validateDomain, validateWine } from './validation'

class DispatchContainer extends React.Component {

  constructor(props) {
    super(props)

    this.initial = props.initial
    this.root = {
      appellation: props.appellation,
      region: props.region,
      country: props.country,
      appellationMore: props.appellationMore,
      domain: props.domain,
      wine: props.wine
    },

    this.state={
      screen: this.initial
    }

    this.appellation=(props.dataAppellation?props.dataAppellation:{})
    this.domain=(props.dataDomain?props.dataDomain:{})
    this.region=(props.dataRegion?props.dataRegion:{})
    this.country=(props.dataCountry?props.dataCountry:{})
    this.wine=(props.dataWine?props.dataWine:{})
    this.varieties=(props.dataVarieties?props.dataVarieties:[])
  }

  _countRoot() {
    let count = 0
    this.root.map(r => (r?count++:null))
    return
  }

  _leave() {
    if(this.props.onSubmit) {
      this.props.onSubmit({
        appellation:this.appellation,
        region:this.region,
        country:this.country,
        domain:this.domain,
        wine:this.wine
      })
    }

    if (!this.props.navigation) return
    this.setState({screen:'leave'}, () => this.props.navigation.dispatch(CommonActions.goBack()))
  }

  _navigateTo(target) {
    if (this.root[target]) {
      this.setState({screen:target})
    } else {
      this._flush()
    }
  }

  _submitAppellation = (values) => {
    if (!values.entityId) {
      this.appellation = {
        name: values.entityName.toLowerCase(),
        color: 'r'
      }
      this._navigateTo('region')
    } else {
      this.appellation = this.props.appellationsData.find(a => a.id === values.entityId)
      this.region = this.props.regionsData.find(r => r.id === this.appellation.region)
      this.country = this.props.countriesData.find(c => c.id === this.region.country)

      if (!this.wine.id) {
        this.wine = {
          tempmin:(this.appellation.tempmin?this.appellation.tempmin.toString():null),
          tempmax:(this.appellation.tempmax?this.appellation.tempmax.toString():null),
          yearmin:(this.appellation.yearmin?this.appellation.yearmin.toString():null),
          yearmax:(this.appellation.yearmax?this.appellation.yearmax.toString():null)
        }
      }
      this._navigateTo('domain')
    }
  }

  _submitRegion = (values) => {
    if (!values.entityId) {
      this.region={
        name: values.entityName
      }
      this._navigateTo('country')
    } else {
      this.region = this.props.regionsData.find(r => r.id === values.entityId)
      this.country = this.props.countriesData.find(c => c.id === this.region.country)
      this._navigateTo('appellationMore')
    }
  }

  _submitCountry = (values) => {
    if (!values.entityId) {
      this.country={
        name: values.entityName
      }
    } else {
      this.country = this.props.countriesData.find(c => c.id === values.entityId)
    }
    this._navigateTo('appellationMore')
  }

  _submitAppellationMore = (values) => {

    if (values.temp) {
      values.tempmin = values.temp.valuemin
      values.tempmax = values.temp.valuemax
      delete values.temp
    }
    if (values.range) {
      values.yearmin = values.range.valuemin
      values.yearmax = values.range.valuemax
      delete values.range
    }

    if (!this.wine.id) {
      this.wine = {
        tempmin:(this.appellation.tempmin?this.appellation.tempmin.toString():null),
        tempmax:(this.appellation.tempmax?this.appellation.tempmax.toString():null),
        yearmin:(this.appellation.yearmin?this.appellation.yearmin.toString():null),
        yearmax:(this.appellation.yearmax?this.appellation.yearmax.toString():null)
      }
    }

    this.appellation = {
      ...values,
      name: values.name.toLowerCase()
    }

    this._navigateTo('domain')
  }

  _submitDomain = (values) => {
    if (!values.entityId) {
      this.domain={
        name: values.entityName
      }
    } else {
      this.domain = this.props.domainsData.find(d => d.id === values.entityId)
    }

    this._navigateTo('wine')
  }

  _submitWine = (values) => {
    if (values.temp) {
      values.tempmin = values.temp.valuemin
      values.tempmax = values.temp.valuemax
      delete values.temp
    }
    if (values.range) {
      values.yearmin = values.range.valuemin
      values.yearmax = values.range.valuemax
      delete values.range
    }
    if (values.varieties) {
      values.varieties.map(v => {
        delete v.selected
      })
    }

    // let existingWines = this.props.winesData.find(ew => ew.appellation === this.appellation.id && ew.domain === this.domain.id && ew.millesime === values.millesime && ew.size === values.size)
    //
    // if (existingWines) {
    //   if (values.id && values.id!==existingWines.id) values.quantity=parseInt(existingWines.quantity,10)+parseInt(values.quantity,10)
    //   values.id=existingWines.id.toString()
    //   values.editedAt=Date.now()
    // }

    this.wine = {
      ...values,
      millesime:parseInt(values.millesime,10),
      tempmin:(values.tempmin?parseInt(values.tempmin,10):null),
      tempmax:(values.tempmax?parseInt(values.tempmax,10):null),
      yearmin:(values.yearmin?parseInt(values.yearmin,10):null),
      yearmax:(values.yearmax?parseInt(values.yearmax,10):null),
    }

    this._flush()
  }


  _flush() {
    if (this.root.appellation || this.root.country) {
      this._flushCountry()
    } else if (this.root.region) {
      this._flushRegion()
    } else if (this.root.appellationMore) {
      this._flushAppellation()
    } else if (this.root.domain) {
      this._flushDomain()
    } else if (this.root.wine) {
      this._flushWine()
    }
  }

  _flushCountry() {
    if (this.country.id) {
      if (!validateCountry(this.country)) return
      if (!this.country.verified) this.props.updateCountry(this.country)
      if (this.root.region) {
        this._flushRegion()
      } else {
        this._leave()
      }
    } else {
      UUIDGenerator.getRandomUUID((uuidCountry) => {
        this.country={
          ...this.country,
          id:uuidCountry,
          enabled:true,
        }
        if (!validateCountry(this.country)) return
        this.props.createCountry(this.country)
        if (this.root.region) {
          this._flushRegion()
        } else {
          this._leave()
        }
      });
    }
  }

  _flushRegion() {
    if (this.region.id) {
      if (!validateRegion(this.region)) return
      if (!this.region.verified) this.props.updateRegion(this.region)
      if (this.root.appellation) {
        this._flushAppellation()
      } else {
        this._leave()
      }
    } else {
      UUIDGenerator.getRandomUUID((uuidRegion) => {
        this.region={
          ...this.region,
          id:uuidRegion,
          country:this.country.id,
          enabled:true,
        }
        if (!validateRegion(this.region)) return
        this.props.createRegion(this.region)
        if (this.root.appellation) {
          this._flushAppellation()
        } else {
          this._leave()
        }
      });
    }
  }

  _flushAppellation() {
    if (this.appellation.id) {
      if (!validateAppellation(this.appellation)) return
      if (!this.appellation.verified) this.props.updateAppellation(this.appellation)
      if (this.root.domain) {
        this._flushDomain()
      } else {
        this._leave()
      }
    } else {
      UUIDGenerator.getRandomUUID((uuidAppellation) => {
        this.appellation={
          region:this.region.id,
          ...this.appellation,
          id:uuidAppellation,
          enabled:true,
        }
        if (!validateAppellation(this.appellation)) return
        this.props.createAppellation(this.appellation)
        if (this.root.domain) {
          this._flushDomain()
        } else {
          this._leave()
        }
      });
    }
  }

  _flushDomain() {
    if (this.domain.id) {
      if (!validateDomain(this.domain)) return
      this.props.updateDomain(this.domain)
      if (this.root.wine) {
        this._flushWine()
      } else {
        this._leave()
      }
    } else {
      UUIDGenerator.getRandomUUID((uuidDomain) => {
        this.domain={
          ...this.domain,
          id:uuidDomain,
          enabled:true,
        }
        if (!validateDomain(this.domain)) return
        this.props.createDomain(this.domain)
        if (this.root.wine) {
          this._flushWine()
        } else {
          this._leave()
        }
      });
    }
  }

  _flushWine() {
    //TODO Si le vin existe déjà
    // if (!this.wine.id) {
    //   let existingWine = this.props.winesData.find(w => (
    //     w.appellation.id === this.appellation.id &&
    //     w.domain.id === this.domain.id &&
    //     w.millesime === this.wine.millesime &&
    //     w.quantity > 0
    //   ))
    //   if(existingWine) this.wine={...existingWine, appellation: this.appellation.id, domain: this.domain.id, quantity:existingWine.quantity+this.wine.quantity}
    // }

    if (this.wine.id) {
      if (!validateWine(this.wine)) return
      this.props.updateWine(this.wine)
    } else {
      UUIDGenerator.getRandomUUID((uuid) => {
        this.wine={
          ...this.wine,
          id:uuid,
          appellation:(this.appellation.id?this.appellation.id:this.wine.appellation),
          domain:(this.domain.id?this.domain.id:this.wine.domain),
          enabled:true
        }
        if (!validateWine(this.wine)) return
        this.props.createWine(this.wine)
      });
    }
    this._leave();
  }

  _askAppellation() {
    return(
      <InputSearch
        data={{appellations:this.props.appellationsData}}
        margin={globalStyles.main_container}
        h1="Ajouter un nouveau vin"
        h2={(<View style={[globalStyles.row,globalStyles.mb20]}><Text style={ globalStyles.h3 }>Choisir une </Text><Text style={[globalStyles.h3,globalStyles.bold]}>appellation</Text></View>)}
        cat="Appellation"
        placeholder="crozes-hermitage, monbazillac..."
        addLabel="Ajouter une nouvelle appellation"
        regions={this.props.regionsData}
        submit={this._submitAppellation}
        key={this.state.screen}
      />
    )
  }

  _askRegion() {
    return(
      <InputSearch
        data={{regions:this.props.regionsData}}
        margin={globalStyles.main_container}
        h1="Ajouter une appellation"
        h2={(<View style={[globalStyles.row,globalStyles.mb20]}><Text style={ globalStyles.h3 }>Choisir une </Text><Text style={[globalStyles.h3,globalStyles.bold]}>région</Text></View>)}
        cat="Région"
        placeholder="Bordeaux, Vallée du Rhône..."
        addLabel="Ajouter une nouvelle région"
        submit={this._submitRegion}
        key={this.state.screen}
      />
    )
  }

  _askCountry() {
    return(
      <InputSearch
        data={{countries:this.props.countriesData}}
        margin={globalStyles.main_container}
        h1="Ajouter une appellation"
        h2={(<View style={[globalStyles.row,globalStyles.mb20]}><Text style={ globalStyles.h3 }>Choisir un </Text><Text style={[globalStyles.h3,globalStyles.bold]}>pays</Text></View>)}
        cat="Pays"
        placeholder="France, Chili..."
        addLabel="Ajouter un nouveau pays"
        submit={this._submitCountry}
        key={this.state.screen}
      />
    )
  }

  _askAppellationMore() {
    return(
      <ScrollView vertical={true} keyboardShouldPersistTaps={'handled'}>
        <View style={globalStyles.main_container}>
          <Text style={ [globalStyles.h1, globalStyles.mt20] }>Ajoutez l'appellation de votre vin</Text>
          <Text></Text>
          <View>
          <AppellationForm
            region={this.region}
            country={this.country}
            varieties={this.props.varietiesData}
            onSubmit={this._submitAppellationMore}
            initialValues={this.appellation}
            key={this.state.screen}
          />
          </View>
  			</View>
      </ScrollView>
    )
  }

  _askDomain() {
    return(
      <InputSearch
        data={{domains:this.props.domainsData}}
        margin={globalStyles.main_container}
        h1="Ajouter un nouveau vin"
        h2={(<View style={[globalStyles.row,globalStyles.mb20]}><Text style={ globalStyles.h3 }>Choisir un </Text><Text style={[globalStyles.h3,globalStyles.bold]}>domaine</Text></View>)}
        cat={this.region.name}
        placeholder="Château Margaux, Château Latour..."
        addLabel="Ajouter un nouveau domaine"
        customOptions={{ ignoreLocation: true }}
        submit={this._submitDomain}
        key={this.state.screen}
      />
    )
  }

  _askWine() {
    let initialValues = {
      varieties:this.varieties,
      appellation:this.appellation.id,
      domain:this.domain.id,
      millesime:(this.wine.millesime?this.wine.millesime:new Date().getFullYear()-1),
      size:750,
      quantity:6,
      sparklink:false,
      bio:false,
      tempmin:(this.wine.tempmin?this.wine.tempmin.toString():(this.appellation.tempmin?this.appellation.tempmin:null)),
      tempmax:(this.wine.tempmax?this.wine.tempmax.toString():(this.appellation.tempmax?this.appellation.tempmax:null)),
      yearmin:(this.wine.yearmin?this.wine.yearmin.toString():(this.appellation.yearmin?this.appellation.yearmin:null)),
      yearmax:(this.wine.yearmax?this.wine.yearmax.toString():(this.appellation.yearmax?this.appellation.yearmax:null)),
      // varieties:(this.varieties.length>0?this.varieties.length:this.appellation.varieties),
      ...this.wine
    }

    return(
      <WineForm
        initialValues={initialValues}
        varieties={this.props.varietiesData}
        appellationName={this.appellation.name}
        appellationColor={this.appellation.color}
        appellationRegion={this.appellation.region}
        domainName={this.domain.name}
        onSubmit={this._submitWine}
        removeWine={this._removeWine}
      />
    )
  }

  _removeWine = () => {
    this.setState({screen:'leave'}, () => {
      this.props.removePositions(this.props.positions)
      this.props.removeWine(this.wine.id)
      this.props.navigation.popToTop()
    })
  }

  _dispatch() {
    switch (this.state.screen) {
      case 'appellation':
        return(this._askAppellation())
        break;
      case 'region':
        return(this._askRegion())
        break;
      case 'country':
        return(this._askCountry())
        break;
      case 'appellationMore':
        return(this._askAppellationMore())
        break;

      case 'domain':
        return(this._askDomain())
        break;

      case 'wine':
        return(this._askWine())
        break;

      default:
        return(<View/>)
    }
  }

  render() {
    return (
      <View style={globalStyles.flex1}>{this._dispatch()}</View>
    )
  }

  componentDidMount() {
    if (!this.props.navigation) return

    this.props.navigation.addListener('beforeRemove', e => {
      if (this.state.screen === 'leave') {
        return;
      }

      e.preventDefault()

      Alert.alert(
        'Modifications non enregistrées',
        'Si vous quittez cet écran, toutes vos modifications seront perdues. Êtes-vous sûr de partir ?',
        [
          { text: "Annuler",
            style: 'cancel'
          },
          {
            text: 'Quitter',
            style: 'destructive',
            // If the user confirmed, then we dispatch the action we blocked earlier
            // This will continue the action that had triggered the removal of the screen
            onPress: () => this.props.navigation.dispatch(e.data.action),
          },
        ]
      );
    });
  }

}

const mapStateToProps = state => {
  return {
    appellationsData: getAppellations(state).filter(a => a.enabled),
    regionsData: getRegions(state).filter(a => a.enabled),
    countriesData: getCountry(state).filter(a => a.enabled),
    domainsData: getDomains(state).filter(a => a.enabled),
    varietiesData: getVarieties(state).filter(a => a.enabled),
    winesData: getSimplyWines(state).filter(a => a.enabled),
  }
}

const mapDispatchToProps = dispatch => {
	return {
		updateCountry: data => dispatch({type:'UPDATE_COUNTRY', payload:data}),
		updateRegion: data => dispatch({type:'UPDATE_REGION', payload:data}),
		updateAppellation: data => dispatch({type:'UPDATE_APPELLATION', payload:data}),
		updateDomain: data => dispatch({type:'UPDATE_DOMAIN', payload:data}),
  	updateWine: data => dispatch({type:'UPDATE_WINE', payload:data}),
		createCountry: data => dispatch({type:'CREATE_COUNTRY', payload:data}),
		createRegion: data => dispatch({type:'CREATE_REGION', payload:data}),
		createAppellation: data => dispatch({type:'CREATE_APPELLATION', payload:data}),
		createDomain: data => dispatch({type:'CREATE_DOMAIN', payload:data}),
  	createWine: data => dispatch({type:'CREATE_WINE', payload:data}),
		removePositions: data => dispatch({type:'DELETE_POSITION_BY_ARRAY', payload:data}),
		removeWine: data => dispatch({type:'DELETE_WINE', payload:data})
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DispatchContainer)
