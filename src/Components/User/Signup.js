import React from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import LogoLogin from '../Global/LogoLogin'
import auth from '@react-native-firebase/auth'
import ModalWaitVerification from './ModalWaitVerification'

class Signup extends React.Component {

  constructor(props) {
    super(props)

    this.emailText = ""
    this.passwordText = ""
    this.confirmPasswordText = ""

    this.state = {
      waitVerificationModal: false,
      errorEmail: undefined,
      errorPassword: undefined,
      keyboard: 'close'
    }
  }

  _emailTextInputChanged(text) {
    this.emailText = text
  }

  _passwordTextInputChanged(text) {
    this.passwordText = text
  }

  _confirmPasswordTextInputChanged(text) {
    this.confirmPasswordText = text
  }

  _validateEmail(email) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (reg.test(email) === false) {
      return false
    }
    return true
  }

  _signup() {
    let email = this.emailText,
    password = this.passwordText,
    confirmPassword = this.confirmPasswordText

    let error = false
    if (!this._validateEmail(email)) {
      this.setState({errorEmail: "L'email n'est pas valide"})
      error = true
    } else {
      this.setState({errorEmail: undefined})
    }
    if (password.length < 8) {
      this.setState({errorPassword: 'Le mot de passe doit contenir au minimum 8 caractères'})
      error = true
    } else {
      if (password !== confirmPassword) {
        this.setState({errorPassword: 'Les mots de passe doivent-être identiques'})
        error = true
      } else {
        this.setState({errorPassword: undefined})
      }
    }

    if (error) return

    auth()
    .createUserWithEmailAndPassword(email, password)
    .then(({user}) => {

      user.sendEmailVerification().then(() => {
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
      }).catch(function(error) {
        console.log(error);
      });
    })
    .catch(error => {
      switch (error.code) {
        case 'auth/weak-password':
          this.setState({errorPassword:'Votre mot de passe n\'est pas assez sécurisé'})
          break;
        case 'auth/email-already-in-use':
          this.setState({errorEmail:'Vous possédez déjà un compte avec cette adresse email'})
          break;
        default:
          this.setState({errorEmail:'Une erreur est survenue'})
      }
    });
  }

  _errorEmail() {
    if (this.state.errorEmail) {
      return(
        <View style={styles.error_container}>
          <FontAwesomeIcon
            name='exclamation-triangle'
            size={15}
            color='#2F6F8F'
          />
          <Text style={styles.error_text}>
            {this.state.errorEmail}
          </Text>
        </View>
      )
    }
    return
  }

  _errorPassword() {
    if (this.state.errorPassword) {
      return(
        <View style={styles.error_container}>
          <FontAwesomeIcon
            name='exclamation-triangle'
            size={15}
            color='#2F6F8F'
          />
          <Text style={styles.error_text}>
            {this.state.errorPassword}
          </Text>
        </View>
      )
    }
    return
  }

  render() {//TODO add verification if verified
    return(
      <View style={styles.main_container}>
        <ModalWaitVerification isVisible={this.state.waitVerificationModal} hide={() => this.setState({waitVerificationModal:false})}/>
        <LogoLogin keyboard={this.state.keyboard}/>
        <View style={styles.middle_container}>
          <View>
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
            {this._errorEmail()}
            <View style={styles.input_container}>
              <FontAwesomeIcon
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
            <View style={styles.input_container}>
              <FontAwesomeIcon
                style={styles.icon}
                name="key"
                size={12}
                color="grey"
              />
              <TextInput
                style={styles.text_input}
                autoCompleteType="password"
                secureTextEntry={true}
                onChangeText={(text) => this._confirmPasswordTextInputChanged(text)}
                placeholder='Confirmer le mot de passe'
              />
            </View>
            {this._errorPassword()}
            <TouchableOpacity onPress={() => this._signup()}>
              <View style={styles.button_container}>
                <Text style={styles.button_text}>Valider mon inscription</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

}



const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    flexDirection: 'column'
  },
    top_container: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    },
      logo: {
        flex:1,
        resizeMode: 'contain',
      },
    middle_container: {
      marginTop: 30
    },
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
    error_container: {
      marginBottom: 10,
      padding: 8,
      flexDirection: 'row',
      alignItems: 'center'
    },
      error_text: {
        color: '#2F6F8F',
        marginLeft: 10,
        fontFamily: 'OpenSans-Bold'
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
})

const mapDispatchToProps = dispatch => {
	return {
    isVerified: data => dispatch({type:'IS_VERIFIED'}),
    signup: data => dispatch({type:'SIGNUP',payload:data}),
    successLogin: data => dispatch({type:'SUCCESS_LOGIN', payload:data}),
	}
}

export default connect(
  null,
  mapDispatchToProps
)(Signup)
