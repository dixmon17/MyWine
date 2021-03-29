import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome5'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Login from './Login'
import UUIDGenerator from 'react-native-uuid-generator'
import Loader from '../Global/Loader'
import globalStyles from '../Global/globalStyles'
import LogoLogin from '../Global/LogoLogin'
import initialData from '../../data/initialData.json'
import auth from '@react-native-firebase/auth'

class FirstStart extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      keyboard: 'close'
    }

  }

  _initializeData() {
    this.props.navigation.reset({
      index: 0,
      routes: [{ name: 'FirstStart' }],
    });

    this.props.resetWine()
    this.props.resetPosition()
    this.props.resetBlock()
    this.props.resetCellar()
    this.props.resetRegion()
    this.props.resetCountry()
    this.props.resetDomain()
    this.props.resetAppellation()

    this.props.restoreCountry(initialData.countries)
    this.props.restoreRegion(initialData.regions)
    this.props.restoreAppellation(initialData.appellations)

    this.props.firstStart()
  }

  componentDidMount() {
    if (this.props.oauth.firstStart) this._initializeData()
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount () {
    if (this.keyboardDidShowListener) this.keyboardDidShowListener.remove();
    if (this.keyboardDidHideListener) this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({keyboard:'open'})
  }

  _keyboardDidHide = () => {
    this.setState({keyboard:'close'})
  }

  _drawOfflineButton() {
    if (this.state.keyboard === 'close') {
      return(
        <View style={styles.bottom_container}>
          <TouchableOpacity onPress={() => {
            auth().signInAnonymously()
            .then(() => {
              this.props.setOffline()
            })
            .catch((error) => {
              console.log(error);
            });
          }}>
            <Text style={[styles.link,globalStyles.mb20]}>Commencer sans s'inscrire...</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  render() {
    return(
      <View style={globalStyles.flex1}>
        <Loader isLoading={this.state.isLoading}/>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={globalStyles.main_container__withoutTabBar}>
          <View style={styles.login_container}>
            <View style={styles.top_container}><LogoLogin/></View>
            <View style={styles.middle_container}>
              <Login
                navigation={this.props.navigation}
                startLoader={() => this.setState({isLoading:true})}
                stopLoader={() => this.setState({isLoading:false})}
              />
            </View>
          </View>
          {this._drawOfflineButton()}
        </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

}

const styles = StyleSheet.create({
    login_container: {
      flex:1,
      justifyContent: 'center',
      flexDirection: 'column',
    },
      top_container: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      middle_container: {
        marginTop: 30
      },
    bottom_container: {
    },
      link: {
        color: '#2F6F8F'
      }
})

const mapStateToProps = state => {
  return {
    oauth: state.oauth,
  }
}

const mapDispatchToProps = dispatch => {
	return {
    setOffline: data => dispatch({type:'SET_OFFLINE'}),
    createCellar: data => dispatch({type:'CREATE_CELLAR', payload:data}),
    createBlock: data => dispatch({type:'CREATE_BLOCK', payload:data}),
    firstStart: data => dispatch({type:'FIRST_START'}),
    restoreAppellation: data => dispatch({type:'FIXTURES_APPELLATION',payload:data}),
    restoreCountry: data => dispatch({type:'FIXTURES_COUNTRY',payload:data}),
    restoreRegion: data => dispatch({type:'FIXTURES_REGION',payload:data}),
		resetWine: data => dispatch({type:'RESET_WINE'}),
		resetBlock: data => dispatch({type:'RESET_BLOCK'}),
		resetCellar: data => dispatch({type:'RESET_CELLAR'}),
		resetDomain: data => dispatch({type:'RESET_DOMAIN'}),
		resetRegion: data => dispatch({type:'RESET_REGION'}),
		resetCountry: data => dispatch({type:'RESET_COUNTRY'}),
		resetAppellation: data => dispatch({type:'RESET_APPELLATION'}),
		resetPosition: data => dispatch({type:'RESET_POSITION'}),
	}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstStart)
