import React from 'react'
import { StyleSheet, FlatList, Platform, UIManager, LayoutAnimation, TouchableOpacity, View, Text } from 'react-native'
import { connect } from 'react-redux'
import { getAppellations, getDomains, getSimplyWines, getVarieties } from '../../../orm/selectors'
import ml from '@react-native-firebase/ml'
import { RNCamera } from 'react-native-camera'
import { getResults} from '../../../method/search'
import { sort, removeAccent } from '../../../method/object'
import Fuse from 'fuse.js'
import Modal from 'react-native-modal'
import colors from '../../Global/colors'
import globalStyles from '../../Global/globalStyles'
import CustomButton from '../../Global/CustomButton'
import LinearGradient from 'react-native-linear-gradient'
import InputSpinner from 'react-native-input-spinner'
import Icon from 'react-native-vector-icons/FontAwesome5'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Shadow from '../../Global/Shadow'
import { colorLabel } from '../../../data/color'
import { Button } from 'react-native-paper'
import Ellipsis from '../../../animation/Ellipsis'

async function processDocument(uri) {
  const processed = await ml().cloudDocumentTextRecognizerProcessImage(uri);

  return(processed)
}

class Vision extends React.Component {

  constructor(props) {
    super(props)

    this.state={
      appellation:{},
      varieties:{},
      selectedAppellation:null,
      millesime:null,
      flash:false,
      isModalVisible:false,
      state:'close',
      authorizationStatus:null
    }

    this.domain={}

    if (Platform.OS === 'android') { UIManager.setLayoutAnimationEnabledExperimental(true); }
  }

  _removeWord(string, word, direction) {
    const options = {
      // isCaseSensitive: false,
      includeScore: true,
      // shouldSort: true,
      includeMatches: true,
      // findAllMatches: false,
      // minMatchCharLength: 1,
      // location: 0,
      threshold: 0.3,
      // distance: 100,
      // useExtendedSearch: false,
      // ignoreLocation: false,
      // ignoreFieldNorm: false,
    }

    const fuse = new Fuse([string], options)

    let search=fuse.search(word)[0],
    local = {dif:0,l:0,m:0}

    if (search) {
      search.matches[0].indices.map(i => {
        if(i[1]-i[0]>local.dif) {
          local.dif=i[1]-i[0]
          local.l=i[0]
          local.m=i[1]
        }
      })

      if (direction === 'left') {
        //Left
        string = search.matches[0].value.slice(0,local.m+1)
      } else if (direction === 'right') {
        //Right
        string = search.matches[0].value.slice(local.l,string.length)
      } else {
        //Just the word
        string = search.matches[0].value.slice(local.l,local.m+1)
      }

      string = search.matches[0].value.replace(string,'')

      //Suppression des espaces au début et à la fin
      string = this._removeUselessSpace(string)
    }

    return string
  }

  _removeUselessSpace(string) {
    let first_character = string.charAt(0),
    last_character = string.substring(string.length-1)
    if (first_character == ' ' || first_character == '-') {
      string = string.slice(1)
    }
    if (last_character == ' ' || last_character == '-') {
      string = string.slice(0,-1)
    }
    return string
  }

  _processAppellation(l) {
    //Suppression des nombres
    l=l.replace(/\d+/g, '')
    //Mise en minuscule
    l=l.toLowerCase()
    //Suppression des espaces au début et à la fin
    l=this._removeUselessSpace(l)
    l=this._removeUselessSpace(l)
    //Isolation "Appellation {app} controlée"
    l=this._removeWord(l, 'appellation', 'left')
    l=this._removeWord(l, 'controlee', 'right')
    l=this._removeWord(l, 'protegee', 'right')
    return l
  }

  _processDomain(l) {
    l=this._removeWord(l, 'château')
    return l
  }

  _processMillesime(l) {
    //Recherche du millesime
    let re = new RegExp(/[1-2][901][0-9][0-9]/g);
    if(l.match(re)) {
      return l.replace(/\D/g,'')
    }
  }

  _setResultAppellation(resultsAppellation, resultsDomain, millesime) {
    if (resultsAppellation.length === 0 && resultsVarieties.length === 0) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      this.setState({state:'unfindable',isModalVisible:true})
    } else if (resultsAppellation.length === 0 && resultsVarieties.length > 0) {
      let varieties = resultsVarieties[0]

      if (resultsDomain[0]) {
        this.domain = resultsDomain[0].entity[0]
      } else {
        this.domain = {}
      }

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      this.setState({state:'found',appellation:{},selectedAppellation:{},varieties:{...varieties, entity: varieties.entity},millesime:(millesime?millesime:(new Date()).getFullYear()-1),isModalVisible:true})
    } else {
      let appellation
      if ((resultsAppellation[0].slug === 'bordeaux' || resultsAppellation[0].slug === 'alsace') && resultsAppellation[1].score < 0.2) {
        if (resultsAppellation[0].slug !== resultsAppellation[1].slug) {
          appellation = resultsAppellation[1]
        } else if (resultsAppellation[2] && resultsAppellation[2].score < 0.2 ) {
          appellation = resultsAppellation[2]
        } else {
          appellation = resultsAppellation[0]
        }
      } else {
        appellation = resultsAppellation[0]
      }

      // let tmpDomains = []

//       for (var i = 0; i < appellation.entity.length; i++) {console.log('y',resultsDomain.entity[0]);
//         let possibleDomains = []
//         this.props.wines.filter(w => w.appellation === appellation.entity[i].id).map(w => {
//           possibleDomains.push(w.domain)
//         })
// console.log('x',possibleDomains);
//         resultsDomain.filter(d => possibleDomains.includes(d.entity[0].id)).map(d => tmpDomains.push(d))
//       }
//       resultsDomain = sort(tmpDomains,'score')

      if (resultsDomain[0]) {
        this.domain = resultsDomain[0].entity[0]
      } else {
        this.domain = {}
      }

      appellation.entity = sort(appellation.entity,'number','desc')

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      this.setState({state:'found',appellation:{...appellation, entity: appellation.entity},varieties:resultsVarieties,selectedAppellation:appellation.entity[0].id,millesime:(millesime?millesime:(new Date()).getFullYear()-1),isModalVisible:true})
    }
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 1, base64: true };
      const data = await this.camera.takePictureAsync(options);
      this.setState({state:'loading',isModalVisible:true})

      processDocument(data.uri).then(
        (processed) => {
          let arrayTextAppellation = [],
          arrayTextDomain = [],
          millesime

          processed.blocks.forEach(block => {
            let regex = /(?:\r\n|\r|\n)/g,
            lineBreak = block.text.match(regex),
            line = block.text.replace(/(?:\r\n|\r|\n)/g, " ")

            millesime = (this._processMillesime(line)?this._processMillesime(line):millesime)

            if (lineBreak.length <= 1 || block.paragraphs[0].confidence < 0.8) return

            arrayTextAppellation.push(this._processAppellation(line))
            arrayTextDomain.push(this._processDomain(line))
          })

          let resultsAppellation=[],
          resultsDomain=[]

          arrayTextAppellation.map(l => {
            getResults(l, {appellations:this.props.appellations}, {levenshtein:true,threshold:0.2,ignoreLocation:true}).map(item => resultsAppellation.push(item))
            // getResults(l, {appellations:this.props.appellations}, {minMatchCharLength:2,threshold:0.001,ignoreLocation:true}).map(item => resultsAppellation.push({...item.item, score:item.score}))
          })
          resultsAppellation = sort(resultsAppellation,'score')

          //Analyse du domaine
          arrayTextDomain.map(l => {
            getResults(l, {domains:this.props.domains}, {levenshtein:true,threshold:0.2,removeWord:'château'}).map(item => resultsDomain.push(item))
            // getResults(l, {domains:this.props.domains}, {minMatchCharLength:2,threshold:0.001,ignoreLocation:true,removeWord:'château'}).map(item => resultsDomain.push({...item.item, score:item.score}))
          })
          resultsDomain = sort(resultsDomain,'score')

          //Analyse de l'appellation
          if (resultsDomain.length > 0) {console.log('first');
            // return
          } else {console.log('second');
            resultsDomain=[], arrayTextDomain=[]
            processed.blocks.forEach(block => {
              let lines = block.text.split("\n")

              lines.map(l => {
                arrayTextDomain.push(this._processDomain(l))
              })
            })

            arrayTextDomain.map(l => {
              getResults(l, {domains:this.props.domains}, {levenshtein:true,threshold:0.3,removeWord:'château'}).map(item => resultsDomain.push(item))
              // getResults(l, {domains:this.props.domains}, {minMatchCharLength:4,threshold:0.1,ignoreLocation:false,removeWord:'château'}).map(item => resultsDomain.push({...item.item, score:item.score}))
            })
            resultsDomain = sort(resultsDomain,'score')
          }

          //Analyse des cépages
          resultsVarieties=[], arrayTextVarieties=[]
          processed.blocks.forEach(block => {
            let lines = block.text.split("\n")

            lines.map(l => {
              arrayTextVarieties.push(l)
            })
          })

          arrayTextVarieties.map(l => {
            getResults(l, {varieties:this.props.varieties}, {levenshtein:true,threshold:0.2,removeWord:'château'}).map(item => resultsVarieties.push(item))
          })
          resultsVarieties = sort(resultsVarieties,'score')

          //Analyse de l'appellation
          if (resultsAppellation.length > 0 && (resultsAppellation[0].slug !== 'bordeaux' && resultsAppellation[0].slug !== 'alsace') && resultsAppellation[0].score < 0.0001) {
            this._setResultAppellation(resultsAppellation, resultsDomain, millesime)
          } else {
            resultsAppellation=[], arrayTextAppellation=[]
            processed.blocks.forEach(block => {
              let lines = block.text.split("\n")

              lines.map(l => {
                arrayTextAppellation.push(this._processAppellation(l))
              })
            })

            arrayTextAppellation.map(l => {
              getResults(l, {appellations:this.props.appellations}, {levenshtein:true,threshold:0.3}).map(item => resultsAppellation.push(item))
              // getResults(l, {appellations:this.props.appellations}, {minMatchCharLength:2,threshold:0.1,ignoreLocation:false}).map(item => resultsAppellation.push({...item.item, score:item.score}))
            })
            resultsAppellation = sort(resultsAppellation,'score')

            this._setResultAppellation(resultsAppellation, resultsDomain, millesime)
          }
        }
      );
    }
  };

  _loaderEllipsis() {
    return(
      <View style={globalStyles.row}>
        <Text style={{bottom: 0,fontSize: 25,color:'white'}}>. </Text>
        <Text style={{bottom: 6,fontSize: 25,color:'white'}}>. </Text>
        <Text style={{bottom: 3,fontSize: 25,color:'white'}}>.</Text>
      </View>
    )
  }

  render() {
    return(
      <View style={[globalStyles.flex1,{backgroundColor: colors.red}]}>
        <Modal animationOutTiming={500} animationIn="zoomInUp" useNativeDriver={true} onBackdropPress={() => this.setState({isModalVisible: !this.state.isModalVisible})} onBackButtonPress={() => this.setState({isModalVisible: !this.state.isModalVisible})} isVisible={this.state.isModalVisible}>
          <Shadow style={{flex:1}}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0.8}}
            colors={['#053C5C', '#541218']}
            style={{flex: 1, justifyContent: 'space-between', borderRadius: 20, overflow: 'hidden', marginTop: 20, marginBottom: 20}}
          >
            <View style={{flex:1, padding: 20}}>
              {(this.state.state==='loading'?(
                <View style={{flex:1, justifyContent: 'space-around'}}>
                  <View>
                    <View style={[globalStyles.row,globalStyles.justifyContentCenter]}><Icon name="camera-retro" color={'white'} size={60} /></View>
                    <View style={[globalStyles.mt20,globalStyles.row,{justifyContent: 'center',alignItems: 'flex-end'}]}><Text style={{color:'white', fontSize: 25}}>Analyse en cours </Text><Ellipsis/></View>
                  </View>
                </View>
              ):
                (this.state.state==='found'?(
                <View style={{flex:1, justifyContent: 'space-around'}}>
                  <View>
                    <View style={[globalStyles.row,globalStyles.justifyContentCenter]}><Icon name="camera-retro" color={'white'} size={60} /></View>
                    <View style={[globalStyles.mt20,globalStyles.row,{flexWrap: 'wrap'}]}>
                      <Text style={{color:'white', fontSize: 25, textAlign: 'center'}}>Votre vin est un <Text style={globalStyles.bold}>{this.state.appellation.name||this.state.varieties.name}</Text></Text>
                    </View>
                    <FlatList
                      horizontal
                      contentContainerStyle={[globalStyles.mt15,{flexGrow: 1, justifyContent: 'center'}]}
                      data={this.state.appellation.entity}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({item, index}) => (
                        <View style={globalStyles.row}>
                          <Button style={{marginRight: 10, borderColor: 'white', borderWidth: 1, backgroundColor: (this.state.selectedAppellation===item.id?'white':'rgba(255,255,255,0)')}} mode="outlined" color={(this.state.selectedAppellation===item.id?'#DB3625':'white')} onPress={() => this.setState({selectedAppellation:item.id})}>
                            {colorLabel.find(c => c.value === item.color).label.toLowerCase()}
                          </Button>
                        </View>
                      )}
                    />
                    <View style={[globalStyles.mt20,globalStyles.row,globalStyles.justifyContentCenter]}>
                      <InputSpinner
                        max={2300}
                        step={1}
                        width={200}
                        inputStyle={{fontSize: 25, fontFamily: 'OpenSans-Bold'}}
                        colorLeft={'white'}
                        colorRight={'white'}
                        colorPress={'#E6E6E6'}
                        buttonTextColor={'#053C5C'}
                        textColor={'white'}
                        buttonFontSize={35}
                        buttonStyle={{paddingBottom: 5}}
                        value={this.state.millesime}
                        onChange={(num) => this.setState({millesime:num})}
                      />
                    </View>
                  </View>
                  <View>
                    <CustomButton
                      action={() => {this.props.navigation.navigate('AutoAdd',{appellation: this.state.selectedAppellation, domain: this.domain, millesime:this.state.millesime, varieties: this.state.varieties.map(v => v.entity[0])});this.setState({state: 'close', isModalVisible: !this.state.isModalVisible})}}
          						isLoading={false}
                      colorBg='white'
                      labelStyle={{color:'#7D2515'}}
          	          style={[globalStyles.mb20]}
          	          text={this.props.submitText?this.props.submitText:"Ajouter ce vin"}
          	          icon={this.props.submitIcon?this.props.submitIcon:"plus"}
                    />
                    <TouchableOpacity onPress={() => {this.props.navigation.navigate('ManualAdd');this.setState({state: 'close', isModalVisible: !this.state.isModalVisible})}}>
                      <Text style={{color:'white', textAlign: 'right'}}>Ce n'est pas mon vin ?</Text>
                      <Text style={{color:'white', textAlign: 'right'}}>Je crée la fiche manuellement !</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ):(
                <View style={{flex:1, justifyContent: 'space-around'}}>
                  <View>
                    <View style={[globalStyles.row,globalStyles.justifyContentCenter]}><Icon name="camera-retro" color={'white'} size={60} /></View>
                    <View style={globalStyles.mt20}><Text style={{color:'white', fontSize: 25, textAlign: 'center'}}>Impossible de reconnaître votre vin 😥</Text></View>
                  </View>
                  <View>
                    <CustomButton
                      action={() => {this.props.navigation.navigate('ManualAdd');this.setState({state: 'close', isModalVisible: !this.state.isModalVisible})}}
          						isLoading={false}
                      colorBg='white'
                      labelStyle={{color:'#7D2515'}}
          	          style={[globalStyles.mb20]}
          	          text={this.props.submitText?this.props.submitText:"Créer la fiche manuellement"}
          	          icon={this.props.submitIcon?this.props.submitIcon:"plus"}
                    />
                  </View>
                </View>
              )))}
            </View>
            <TouchableOpacity style={[{padding: 10},globalStyles.row,globalStyles.justifyContentCenter]} onPress={() => this.setState({state: 'close', isModalVisible: !this.state.isModalVisible})}>
              <Icon name="angle-down" color={'white'} size={20} />
              <Text style={[{color: 'white'},globalStyles.ml5, globalStyles.bold]}>Fermer</Text>
            </TouchableOpacity>
          </LinearGradient>
          </Shadow>
       </Modal>
       <View style={styles.capture_container}>
          <RNCamera
             ref={ref => {
               this.camera = ref;
             }}
             onStatusChange={({cameraStatus}) => {this.setState({authorizationStatus:cameraStatus})}}
             style={styles.preview}
             type={RNCamera.Constants.Type.back}
             flashMode={(this.state.flash?RNCamera.Constants.FlashMode.on:RNCamera.Constants.FlashMode.off)}
             pendingAuthorizationView={(<View/>)}
             notAuthorizedView={(
               <View style={[globalStyles.flex1,globalStyles.justifyContentCenter,globalStyles.p20]}>
                <Text style={[globalStyles.h1,globalStyles.mb10,{textTransform:'none',textAlign: 'center'}]}>Vous n'avez pas autorisé MyWine a accéder à votre caméra 😥</Text>
                <Text style={[{textAlign: 'center'},globalStyles.h3]}>Veuillez modifier cette autorisation pour ajouter vos bouteilles en photographiant l'étiquette.</Text>
             </View>)}
             captureAudio={false}
          />
          <View style={{position: 'absolute',left: 0,right: 0,bottom: 75, alignItems: 'center'}}>
            {(this.state.authorizationStatus === 'READY'?(
            <View>
              <Shadow>
              <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
                <Icon name="camera-retro" color={'#DB5460'} size={25} />
              </TouchableOpacity>
              </Shadow>
              <Text style={{color: 'white',marginTop: 10, marginBottom: 20, alignSelf: 'center'}}>ou</Text>
            </View>
          ):null)}
            <CustomButton
             style={{marginBottom: 10}}
             action={() => this.props.navigation.navigate('ManualAdd')}
             icon='plus'
             colorBg='#DB5460'
             text='Ajouter un vin manuellement'
            />
          </View>
          {(this.state.authorizationStatus === 'READY'?(
            <View style={{position: 'absolute', right: 20, top: 20}}>
              <TouchableOpacity onPress={() => this.setState({flash:!this.state.flash})}>
                <Shadow><MaterialIcon name={(this.state.flash?'flash':'flash-off')} color={'white'} size={35} /></Shadow>
              </TouchableOpacity>
            </View>
          ):null)}
       </View>
     </View>
    )
  }

}

const styles = StyleSheet.create({
  capture_container: {
    position: 'absolute',
    width: '100%',
    height: '99%',
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fafafa'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    backgroundColor: '#fff',
    borderRadius: 50,
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

const mapStateToProps = state => {
  return {
    appellations: getAppellations(state),
    domains: getDomains(state),
    wines: getSimplyWines(state).filter(w => w.enabled),
    varieties: getVarieties(state)
  };
}

export default connect(mapStateToProps)(Vision)
