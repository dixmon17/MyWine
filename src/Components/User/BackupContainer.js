import React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { getCountry, getRegions, getAppellations, getDomains, getSimplyWines, getCellar, getBlock, getPosition, getCountriesForBackup, getRegionsForBackup, getDomainsForBackup, getAppellationsForBackup, getWinesForBackup, getCellarsForBackup, getBlocksForBackup, getPositionsForBackup } from '../../orm/selectors'
import { renameProperty, sort } from '../../method/object'

import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import firestore from '@react-native-firebase/firestore'
import { getUniqueId } from 'react-native-device-info'

class BackupContainer extends React.Component {

  _convertObjectToArray(object) {
    let array = []
    Object.keys(object).map(function(key, index) {
      let entry = object[key]
      array.push({...entry, id:key})
    });
    return array
  }

  // _getRemoved(origin, save) {
  //   let removed = []
  //   origin.map(o => {
  //     if (save.find(s => s.id === o.id)) return
  //     removed.push(o)
  //   })
  //   return removed
  // }


  constructor(props) {
    super(props)

    this.fn = {
      cellars:{
        subscriber:'_subscribeCellarsListener',
        restorer:'restoreCellars',
        updater:'updateCellar',
        exec:firestore().collection('cellars')
      },
      blocks:{
        subscriber:'_subscribeBlocksListener',
        restorer:'restoreBlocks',
        updater:'updateBlock',
        exec:firestore().collectionGroup('blocks')
      },
      positions:{
        subscriber:'_subscribePositionsListener',
        restorer:'restorePositions',
        updater:'updatePosition',
        exec:firestore().collectionGroup('positions')
      },
      countries:{
        subscriber:'_subscribeCountriesListener',
        restorer:'restoreCountries',
        updater:'updateCountry',
        exec:firestore().collection('countries')
      },
      regions:{
        subscriber:'_subscribeRegionsListener',
        restorer:'restoreRegions',
        updater:'updateRegion',
        exec:firestore().collection('regions')
      },
      appellations:{
        subscriber:'_subscribeAppellationsListener',
        restorer:'restoreAppellations',
        updater:'updateAppellation',
        exec:firestore().collection('appellations')
      },
      domains:{
        subscriber:'_subscribeDomainsListener',
        restorer:'restoreDomains',
        updater:'updateDomain',
        exec:firestore().collection('domains')
      },
      wines:{
        subscriber:'_subscribeWinesListener',
        restorer:'restoreWines',
        updater:'updateWine',
        exec:firestore().collection('wines')
      }
    }

    //firestore-import --accountCredentials serviceAccountKey.json --backupFile all.json

    // gradlew signingReport

    //debug 70:0D:17:A0:EE:C8:7B:9B:7C:0D:88:CD:F6:13:17:28:8B:0D:0A:8B
    //release 0B:F8:B9:29:52:01:A6:E1:8D:4D:96:C7:9F:C2:96:4C:F4:5F:A4:CA

    // react-native bundle --platform android --dev false --entry-file App.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

    this.lastUpdate=this.props.lastUpdate

    this.sync = false
    this.userId
    this.state={userId:null}
  }

  render() {
    return true
  }


  _getLastEditedAt(data) {
    if(!data) return false

    const sortedRestore = sort(data, 'editedAt', 'desc')[0]

    return (sortedRestore?sortedRestore.editedAt:false)
  }

  _resubscribeListener(collection, listener) {
    listener()
    switch (collection) {
      case 'cellars':
        this._subscribeCellarsListener()
        break;
      case 'blocks':
        this._subscribeBlocksListener()
        break;
      case 'positions':
        this._subscribePositionsListener()
        break;
      case 'countries':
        this._subscribeCountriesListener()
        break;
      case 'regions':
        this._subscribeRegionsListener()
        break;
      case 'appellations':
        this._subscribeAppellationsListener()
        break;
      case 'domains':
        this._subscribeDomainsListener()
        break;
      case 'wines':
        this._subscribeWinesListener()
        break;
    }
  }

  _subscribeCellarsListener() {
    let cellars = []

    this.cellarsListener = firestore().collection('cellars')
    .where('owner', '==', this.userId)
    .where('editedAt', '>', this.lastUpdate.cellars)
    .onSnapshot(cellarsCollection => {
      cellars=[]
      if (!cellarsCollection) return
      cellarsCollection.forEach(documentCellar => {
        cellars.push({...documentCellar.data(), id:documentCellar.id})
      });

      let lastUpdate = this._getLastEditedAt(cellars)
      if (lastUpdate) {
        this.props.restoreCellars(cellars)
        this.lastUpdate.cellars = lastUpdate
        this.props.updateCellar(lastUpdate)
        this._resubscribeListener('cellars',this.cellarsListener)
      }
    });
  }

  _subscribeBlocksListener() {
    let blocks = []

    this.blocksListener = firestore().collectionGroup('blocks')
    .where('owner', '==', this.userId)
    .where('editedAt', '>', this.lastUpdate.blocks)
    .onSnapshot(blocksCollection => {
      blocks=[]
      if (!blocksCollection) return
      blocksCollection.forEach(documentBlock => {
        blocks.push({...documentBlock.data(), id:documentBlock.id})

      });

      let lastUpdate = this._getLastEditedAt(blocks)
      if (lastUpdate) {
        this.props.restoreBlocks(blocks)
        this.lastUpdate.blocks = lastUpdate
        this.props.updateBlock(lastUpdate)
        this._resubscribeListener('blocks',this.blocksListener)
      }
    });
  }

  _subscribePositionsListener() {
    let positions = []

    this.positionsListener = firestore().collectionGroup('positions')
    .where('editedAt', '>', this.lastUpdate.positions)
    .where('owner', '==', this.userId)
    .onSnapshot(positionsCollection => {
      positions=[]
      if (!positionsCollection) return
      positionsCollection.forEach(documentPosition => {
        if (documentPosition.data().device !== getUniqueId()) {
          positions.push({...documentPosition.data(), id:documentPosition.id})
        }
      });

      let lastUpdate = this._getLastEditedAt(positions)

      if (lastUpdate) {
        this.props.restorePositions(positions)
        this.lastUpdate.positions = lastUpdate
        this.props.updatePosition(lastUpdate)
        this._resubscribeListener('positions',this.positionsListener)
      }
    });
  }

  _subscribeCountriesListener() {
    let countries = []

    this.countriesListener = firestore().collection('countries')
    .where('owner', '==', this.userId)
    .where('editedAt', '>', this.lastUpdate.countries)
    .onSnapshot(countriesCollection => {
      countries=[]
      if (!countriesCollection) return
      countriesCollection.forEach(documentCountry => {
        countries.push({...documentCountry.data(), id:documentCountry.id})

      });

      let lastUpdate = this._getLastEditedAt(countries)
      if (lastUpdate) {
        this.props.restoreCountries(countries)
        this.lastUpdate.countries = lastUpdate
        this.props.updateCountry(lastUpdate)
        this._resubscribeListener('countries',this.countriesListener)
      }
    });
  }

  _subscribeRegionsListener() {
    let regions = []

    this.regionsListener = firestore().collection('regions')
    .where('owner', '==', this.userId)
    .where('editedAt', '>', this.lastUpdate.regions)
    .onSnapshot(regionsCollection => {
      regions=[]
      if (!regionsCollection) return
      regionsCollection.forEach(documentRegion => {
        regions.push({...documentRegion.data(), id:documentRegion.id})

      });

      let lastUpdate = this._getLastEditedAt(regions)
      if (lastUpdate) {
        this.props.restoreRegions(regions)
        this.lastUpdate.regions = lastUpdate
        this.props.updateRegion(lastUpdate)
        this._resubscribeListener('regions',this.regionsListener)
      }
    });
  }

  _subscribeAppellationsListener() {
    let appellations = []

    this.appellationsListener = firestore().collection('appellations')
    .where('owner', '==', this.userId)
    .where('editedAt', '>', this.lastUpdate.appellations)
    .onSnapshot(appellationsCollection => {
      appellations=[]
      if (!appellationsCollection) return
      appellationsCollection.forEach(documentAppellation => {
        appellations.push({...documentAppellation.data(), id:documentAppellation.id})

      });

      let lastUpdate = this._getLastEditedAt(appellations)
      if (lastUpdate) {
        this.props.restoreAppellations(appellations)
        this.lastUpdate.appellations = lastUpdate
        this.props.updateAppellation(lastUpdate)
        this._resubscribeListener('appellations',this.appellationsListener)
      }
    });
  }

  _subscribeDomainsListener() {
    let domains = []

    this.domainsListener = firestore().collection('domains')
    .where('owner', '==', this.userId)
    .where('editedAt', '>', this.lastUpdate.domains)
    .onSnapshot(domainsCollection => {
      domains=[]
      if (!domainsCollection) return
      domainsCollection.forEach(documentDomain => {
        domains.push({...documentDomain.data(), id:documentDomain.id})

      });

      let lastUpdate = this._getLastEditedAt(domains)
      if (lastUpdate) {
        this.props.restoreDomains(domains)
        this.lastUpdate.domains = lastUpdate
        this.props.updateDomain(lastUpdate)
        this._resubscribeListener('domains',this.domainsListener)
      }
    });
  }

  _subscribeWinesListener() {
    let wines = []

    this.winesListener = firestore().collection('wines')
    .where('owner', '==', this.userId)
    .where('editedAt', '>', this.lastUpdate.wines)
    .onSnapshot(winesCollection => {
      wines=[]
      if (!winesCollection) return
      winesCollection.forEach(documentWine => {
        wines.push({...documentWine.data(), id:documentWine.id})

      });

      let lastUpdate = this._getLastEditedAt(wines)
      if (lastUpdate) {
        this.props.restoreWines(wines)
        this.lastUpdate.wines = lastUpdate
        this.props.updateWine(lastUpdate)
        this._resubscribeListener('wines',this.winesListener)
      }
    });
  }

  _setFirebase(db, entity, owner) {
    if (!entity) return
    const { id, ...entityWithoutId } = entity

    firestore()
    .collection(db)
    .doc(entity.id)
    .set({...entityWithoutId, owner:owner})
  }

  componentDidMount() {

    auth().onAuthStateChanged((user) => {
      if (user) {

        console.log('Loading new data...')

        database()
        .ref('/countries')
        .orderByChild('editedAt')
        .startAt(this.props.fixtures.countries)
        .once('value')
        .then(snapshot => {
          let countries=snapshot.val()
          if (!countries) return
          countries=this._convertObjectToArray(countries)
          // this._getRemoved(this.props.countries,countries).map(removed => {
          //   this.props.deleteCountry(removed.id)
          // })
          // countries.map(c => c.enabled = true)
          this.props.updateFixturesCountry(this._getLastEditedAt(countries))
          this.props.restoreCountries(countries)
        });

        database()
        .ref('/regions')
        .orderByChild('editedAt')
        .startAt(this.props.fixtures.regions)
        .once('value')
        .then(snapshot => {
          let regions=snapshot.val()
          if (!regions) return
          regions=this._convertObjectToArray(regions)

          // this._getRemoved(this.props.regions,regions).map(removed => {
          //   this.props.deleteRegion(removed.id)
          // })
          // regions.map(r => r.enabled = true)
          this.props.updateFixturesRegion(this._getLastEditedAt(regions))
          this.props.restoreRegions(regions)
        });

        database()
        .ref('/appellations')
        .orderByChild('editedAt')
        .startAt(this.props.fixtures.appellations)
        .once('value')
        .then(snapshot => {
          let appellations=snapshot.val()
          if (!appellations) return
          appellations=this._convertObjectToArray(appellations)
          // this._getRemoved(this.props.appellations,appellations).map(removed => {
          //   this.props.deleteAppellations(removed.id)
          // })
          // appellations.map(a => (a.enabled = true))
          this.props.updateFixturesAppellation(this._getLastEditedAt(appellations))
          this.props.restoreAppellations(appellations)
        });

        database()
        .ref('/varieties')
        .orderByChild('editedAt')
        .startAt(this.props.fixtures.varieties)
        .once('value')
        .then(snapshot => {
          let varities=snapshot.val()
          if (!varities) return
          varities=this._convertObjectToArray(varities)
          // this._getRemoved(this.props.appellations,appellations).map(removed => {
          //   this.props.deleteAppellations(removed.id)
          // })
          // appellations.map(a => (a.enabled = true))
          this.props.updateFixturesVariety(this._getLastEditedAt(varities))
          this.props.restoreVarieties(varities)
        });

        //Si anonyme
        if (user.isAnonymous) return
        //Si pas vérifié
        if (!user.emailVerified) return
        this.userId=user.uid
        this.setState({userId:user.uid})

        //Si nouveau vérifié
        // if (user.emailVerified && !this.props.oauth.verified) {
        //   this.props.isVerified()
        //   this.props.wines.filter(e => !e.verified).map(e => this._setFirebase('wines',e,user.uid))
        //   this.props.countries.filter(e => !e.verified).map(e => this._setFirebase('countries',e,user.uid))
        //   this.props.regions.filter(e => !e.verified).map(e => this._setFirebase('countries',e,user.uid))
        //   this.props.appellations.filter(e => !e.verified).map(e => this._setFirebase('appellations',e,user.uid))
        //   this.props.domains.filter(e => !e.verified).map(e => this._setFirebase('domains',e,user.uid))
        //   this.props.cellars.filter(e => !e.verified).map(e => this._setFirebase('cellars',e,user.uid))
        //   this.props.blocks.filter(e => !e.verified).map(e => this._setFirebase('cellars/'+e.cellar+'/blocks',e,user.uid))
        //   this.props.positions.filter(e => !e.verified).map(e => this._setFirebase('cellars/'+this.props.blocks.find(b => b.id === e.block).cellar+'/blocks/'+e.block+'/positions',e,user.uid))
        //   return
        // }
// console.log('n');

        // //   this.sync = true
        // //   this._subscribeCellarsListener()
        // //   this._subscribeBlocksListener()
        // //   this._subscribePositionsListener()
        // //   this._subscribeCountriesListener()
        // //   this._subscribeRegionsListener()
        // //   this._subscribeAppellationsListener()
        // //   this._subscribeDomainsListener()
        // //   this._subscribeWinesListener()

      } else {
        // this.props.logout()
        this.userId=null
        this.setState({userId:null})
        console.log('Log Error');
      }
    })

  }

  _setFirebase(db, entity) {
    let user = auth().currentUser

    if (!user || !user.emailVerified) return

    if (!entity) return
    const { id, ...entityWithoutId } = entity

    firestore()
    .collection(db)
    .doc(entity.id)
    .set({...entityWithoutId, owner:user.uid})
  }

  _initializeFirestore(entity) {
    let entities = []

    this.fn[entity].exec
    .where('owner', '==', this.userId)
    .where('editedAt', '>', 0)
    .get().then(collection => {

      if (!collection) {
        this[this.fn[entity].subscriber]()
        return
      }

      collection.forEach(document => {
        entities.push({...document.data(), id:document.id})
      });

      let lastUpdate = this._getLastEditedAt(entities)
      if (lastUpdate) {
        // console.log(entity,this.props[this.fn[entity].restorer])
        this.props[this.fn[entity].restorer](entities)
        this.lastUpdate[entity] = lastUpdate
        this.props[this.fn[entity].updater](lastUpdate)
      }

      this[this.fn[entity].subscriber]()
    })
    .catch(error => console.error(error))
  }

  componentDidUpdate() {
    //Déconnexion
    if(this.sync && !this.state.userId) {console.log('logout');
      this.sync = false;
      (this.cellarsListener?this.cellarsListener():console.log('No listener'));
      (this.blocksListener?this.blocksListener():console.log('No listener'));
      (this.positionsListener?this.positionsListener():console.log('No listener'));
      (this.appellationsListener?this.appellationsListener():console.log('No listener'));
      (this.domainsListener?this.domainsListener():console.log('No listener'));
      (this.countriesListener?this.countriesListener():console.log('No listener'));
      (this.regionsListener?this.regionsListener():console.log('No listener'));
      (this.winesListener?this.winesListener():console.log('No listener'));
      this.lastUpdate={cellars:0, blocks:0, positions:0, wines:0, appellations:0, domains:0, regions:0, countries:0};
    }
    //Déjà connecté
    if(!this.sync && this.state.userId && !this.props.oauth.firstSync) {console.log('restlogged');
      this.sync = true

      this._subscribeCellarsListener()
      this._subscribeBlocksListener()
      this._subscribePositionsListener()
      this._subscribeCountriesListener()
      this._subscribeRegionsListener()
      this._subscribeAppellationsListener()
      this._subscribeDomainsListener()
      this._subscribeWinesListener()
    }
    //Vérification et/ou connexion
    if(!this.sync && this.state.userId && this.props.oauth.firstSync) {console.log('login');
      this.sync = true
      this.props.makeFirstSync()

      this.props.cellars.filter(e => e && !e.verified && e.enabled).map(e => this._setFirebase('cellars',e))
      this.props.blocks.filter(e => e && !e.verified && e.enabled).map(e => this._setFirebase('blocks',e))
      this.props.positions.filter(e => e && !e.verified && e.enabled).map(e => this._setFirebase('positions',e))
      this.props.wines.filter(e => e && !e.verified && e.enabled).map(e => this._setFirebase('wines',e))
      this.props.appellations.filter(e => e && !e.verified && e.enabled).map(e => this._setFirebase('appellations',e))
      this.props.domains.filter(e => e && !e.verified && e.enabled).map(e => this._setFirebase('domains',e))
      this.props.countries.filter(e => e && !e.verified && e.enabled).map(e => this._setFirebase('countries',e))
      this.props.regions.filter(e => e && !e.verified && e.enabled).map(e => this._setFirebase('regions',e))

      this._initializeFirestore('cellars')
      this._initializeFirestore('blocks')
      this._initializeFirestore('positions')
      this._initializeFirestore('wines')
      this._initializeFirestore('appellations')
      this._initializeFirestore('domains')
      this._initializeFirestore('countries')
      this._initializeFirestore('regions')
    }
  }
}

const mapStateToProps = state => {
  return {
    lastUpdate: state.update.lastUpdate,
    fixtures: state.fixtures.lastUpdate,
    oauth: state.oauth,
    countries: getCountry(state),
    regions: getRegions(state),
    appellations: getAppellations(state),
    domains: getDomains(state),
    wines: getSimplyWines(state),
    cellars: getCellar(state),
    blocks: getBlock(state),
    positions: getPosition(state)
  }
}

const mapDispatchToProps = dispatch => {
	return {
    updateCellar: data => dispatch({type:'CELLAR',payload:data}),
    updateBlock: data => dispatch({type:'BLOCK',payload:data}),
    updatePosition: data => dispatch({type:'POSITION',payload:data}),
    updateWine: data => dispatch({type:'WINE',payload:data}),
    updateDomain: data => dispatch({type:'DOMAIN',payload:data}),
    updateAppellation: data => dispatch({type:'APPELLATION',payload:data}),
    updateRegion: data => dispatch({type:'REGION',payload:data}),
    updateCountry: data => dispatch({type:'COUNTRY',payload:data}),

    makeFirstSync: data => dispatch({type:'MAKE_FIRST_SYNC'}),
    isVerified: data => dispatch({type:'IS_VERIFIED'}),
    logout: data => dispatch({type:'LOGOUT'}),

    deleteCountry: data => dispatch({type:'DELETE_COUNTRY',payload:data}),
    deleteRegion: data => dispatch({type:'DELETE_REGION',payload:data}),
    deleteAppellations: data => dispatch({type:'DELETE_APPELLATION',payload:data}),

    restoreCountries: data => dispatch({type:'FIXTURES_COUNTRY',payload:data}),
    restoreRegions: data => dispatch({type:'FIXTURES_REGION',payload:data}),
    restoreAppellations: data => dispatch({type:'FIXTURES_APPELLATION',payload:data}),
    restoreDomains: data => dispatch({type:'FIXTURES_DOMAIN',payload:data}),
    restoreWines: data => dispatch({type:'FIXTURES_WINE',payload:data}),
    restoreCellars: data => dispatch({type:'FIXTURES_CELLAR',payload:data}),
    restoreBlocks: data => dispatch({type:'FIXTURES_BLOCK',payload:data}),
    restorePositions: data => dispatch({type:'FIXTURES_POSITION',payload:data}),
    restoreVarieties: data => dispatch({type:'FIXTURES_VARIETY',payload:data}),

    updateFixturesCountry: data => dispatch({type:'FIXTURES_COUNTRY_VERIFIED',payload:data}),
    updateFixturesRegion: data => dispatch({type:'FIXTURES_REGION_VERIFIED',payload:data}),
    updateFixturesAppellation: data => dispatch({type:'FIXTURES_APPELLATION_VERIFIED',payload:data}),
    updateFixturesVariety: data => dispatch({type:'FIXTURES_VARIETY_VERIFIED',payload:data}),
	}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BackupContainer)
