import React from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import Config from "react-native-config"
import Icon from 'react-native-vector-icons/FontAwesome5'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import UUIDGenerator from 'react-native-uuid-generator'
import { colorLabel } from '../../data/color'
import { sort } from '../../method/object'

import { GoogleSignin } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import ModalWaitVerification from './ModalWaitVerification'

async function onGoogleButtonPress() {
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
}

class Login extends React.Component {

  constructor(props) {
    super(props)

    //Release on PlayStore
    // GoogleSignin.configure({
    //   webClientId: '698452890369-2qjd50o4mgtts2mj27h3ct9j6r7eij1v.apps.googleusercontent.com',
    // });
    //Release
    // GoogleSignin.configure({
    //   webClientId: '698452890369-gjmrf1vsquthnpmjsbn8oqok7dgg6uhq.apps.googleusercontent.com',
    // });
    // Debug
    GoogleSignin.configure({
      webClientId: Config.WEB_CLIENT_ID_FIREBASE,
    });

    this.emailText = ""
    this.passwordText = ""

    this.state = {
      waitVerificationModal: false,
      error: null
    }
  }

  _emailTextInputChanged(text) {
    this.emailText = text
  }

  _passwordTextInputChanged(text) {
    this.passwordText = text
  }

  _login() {
    if (this.emailText.length === 0 || this.passwordText.length === 0) return

    this.props.startLoader()

    let email = this.emailText,
    password = this.passwordText

    auth()
    .signInWithEmailAndPassword(email, password)
    .then(({user}) => {
      this.props.stopLoader()

      //Si pas vérifié
      if (!user.emailVerified) {
        this.setState({waitVerificationModal:true})
        var interval = setInterval(() => {
          const user = auth().currentUser

          if (!user) return
          if (!user.emailVerified) {
            user.reload()
            return
          }
          this.props.successLogin({email:email,id:user.uid,verified:true})
          this.props.navigation.replace('Tab', {
            screen: 'SearchTab',
          });
          clearInterval(interval)
        }, 3000);
        return
      }

      //Si vérifié
      this.props.successLogin({email:email,id:user.uid,verified:true})
    })
    .catch(error => {
      switch (error.code) {
        case 'auth/wrong-password':
          this.setState({error:'Votre mot de passe est incorrect'})
          break;
        case 'auth/user-not-found':
          this.setState({error:'Cette adresse email est inconnue'})
          break;
        case 'auth/invalid-email':
          this.setState({error:'Veuillez donner une adresse email correcte'})
          break;
        default:
          this.setState({error:'Une erreur est survenue'})
      }
      this.props.stopLoader()
    });
  }

  _loginWithGoogle() {
    this.props.startLoader()

    onGoogleButtonPress()
    .then(({user}) => {
      this.props.stopLoader()
      this.props.successLogin({email:user.email,id:user.uid,verified:true})
    })
    .catch(error => {
      this.setState({error:'Erreur n°'+error.code})
      this.props.stopLoader()
    });
  }

  _signup() {
    this.props.navigation.navigate("Signup")
  }

  _resetPassword() {
    this.props.navigation.navigate("ResetPassword")
  }

  render() {
    return(
      <View>
        <ModalWaitVerification isVisible={this.state.waitVerificationModal} hide={() => this.setState({waitVerificationModal:false})}/>
        <View style={styles.input_container}>
          <MaterialIcon
            style={styles.icon}
            name="email"
            size={12}
            color="grey"
          />
          <TextInput
            style={styles.text_input}
            autoCompleteType="email"
            autoCapitalize='none'
            keyboardType='email-address'
            onChangeText={(text) => this._emailTextInputChanged(text)}
            placeholder='Email'
          />
        </View>
        <View style={styles.input_container}>
          <Icon
            style={styles.icon}
            name="key"
            size={12}
            color="grey"
          />
          <TextInput
            style={styles.text_input}
            autoCompleteType="password"
            secureTextEntry={true}
            onChangeText={(text) => this._passwordTextInputChanged(text)}
            placeholder='Mot de passe'
          />
        </View>
        {( this.state.error ? (
          <View style={styles.error_container}>
          <Icon
          name='exclamation-triangle'
          size={15}
          color='#db5461'
          />
          <Text style={styles.error_text}>
          {this.state.error}
          </Text>
          </View>
        ) : null )}
        <TouchableOpacity onPress={() => this._login()}>
          <View style={styles.button_container}>
            <Text style={styles.button_text}>Me connecter</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this._loginWithGoogle()}>
        <View style={styles.button_container}>
        <Text style={styles.button_text}>Se connecter avec </Text>
        <Image style={{width: 70, height: 30, marginLeft: 5, top:2, resizeMode: 'contain'}} source={require('../../img/logo_google.png')}/>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this._signup()}>
          <View style={styles.button_container_inversed}>
            <Text style={styles.button_text_inversed}>M'inscrire</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this._resetPassword()}>
            <Text style={styles.link}>J'ai oublié mon mot de passe...</Text>
        </TouchableOpacity>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  input_container: {
    borderWidth: 0.5,
    borderColor: '#2F6F8F',
    borderRadius: 50,
    paddingLeft:30,
    paddingRight:30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
    icon: {
      marginRight: 5
    },
    text_input: {
      fontFamily: 'OpenSans-Bold',
      color: 'grey',
      flex:1
    },
  button_container: {
    borderWidth: 0.5,
    borderColor: '#2F6F8F',
    borderRadius: 50,
    paddingLeft:30,
    paddingRight:30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    height: 48.8,
    backgroundColor: '#2F6F8F'
  },
    button_text: {
      color: 'white',
      fontFamily: 'OpenSans-Bold'
    },
  button_container_inversed: {
    borderWidth: 1,
    borderColor: '#2F6F8F',
    borderRadius: 50,
    paddingLeft:30,
    paddingRight:30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    height: 48.8,
  },
    button_text_inversed: {
      color: '#2F6F8F',
      fontFamily: 'OpenSans-Bold'
    },
  link: {
    marginTop: 5,
    textAlign: 'center',
    color: '#2F6F8F'
  },
  error_container: {
    marginBottom: 10,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
    error_text: {
      color: '#db5461',
      marginLeft: 10,
      fontFamily: 'OpenSans-Bold'
    },
})
const mapDispatchToProps = dispatch => {
	return {
    successLogin: data => dispatch({type:'SUCCESS_LOGIN', payload:data}),
    initialization: data => dispatch({type:'UPDATE_INITIALIZATION', payload:data}),
    isVerified: data => dispatch({type:'IS_VERIFIED'}),
    restoreCountry: data => dispatch({type:'FIXTURES_COUNTRY',payload:data}),
    restoreRegion: data => dispatch({type:'FIXTURES_REGION',payload:data}),
    restoreAppellation: data => dispatch({type:'FIXTURES_APPELLATION',payload:data}),
    restoreDomain: data => dispatch({type:'FIXTURES_DOMAIN',payload:data}),
    restoreWine: data => dispatch({type:'FIXTURES_WINE',payload:data}),
    restoreCellar: data => dispatch({type:'FIXTURES_CELLAR',payload:data}),
    restoreBlock: data => dispatch({type:'FIXTURES_BLOCK',payload:data}),
    restorePosition: data => dispatch({type:'FIXTURES_POSITION',payload:data}),
    restoreSearch: data => dispatch({type:'FIXTURES_SEARCH',payload:data}),
	}
}

export default connect(
  null,
  mapDispatchToProps
)(Login)
