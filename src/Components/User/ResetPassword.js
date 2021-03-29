import React from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome5'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import UUIDGenerator from 'react-native-uuid-generator'
import Loader from '../Global/Loader'
import globalStyles from '../Global/globalStyles'
import auth from '@react-native-firebase/auth';

class ResetPassword extends React.Component {

  constructor(props) {
    super(props)

    this.email

    this.state = {
      success: undefined,
      error: null,
      isLoading: false,
    }
  }

  _emailTextInputChanged(text) {
    this.emailText = text
  }

  _resetPassword() {
    auth().sendPasswordResetEmail(this.emailText)
    .then(() => {
      this.setState({success:'Un email a été envoyé à cet email pour réinitialiser votre mot de passe',isLoading:false,error:null})
    })
    .catch(error => {
      switch (error.code) {
        case 'auth/wrong-password':
          this.setState({error:'Votre mot de passe est incorrect',success:undefined,isLoading:false})
          break;
        case 'auth/user-not-found':
          this.setState({error:'Cette adresse email est inconnue',success:undefined,isLoading:false})
          break;
        case 'auth/invalid-email':
          this.setState({error:'Veuillez donner une adresse email correcte',success:undefined,isLoading:false})
          break;
        default:
          console.log(error);
          this.setState({error:'Une erreur est survenue',success:undefined,isLoading:false})
      }
    });
  }

  _showSuccess() {
    if (this.state.success) {
      return(
        <View style={styles.message_container}>
          <Icon
            name='check'
            size={15}
            color='#8AA29E'
          />
          <Text style={styles.success_text}>
            {this.state.success}
          </Text>
        </View>
      )
    }
    return
  }

  _showError() {
    if (this.state.error) {
      return(
        <View style={styles.message_container}>
          <Icon
          name='exclamation-triangle'
          size={15}
          color='#db5461'
          />
          <Text style={styles.error_text}>
            {this.state.error}
          </Text>
        </View>
      )
    }
    return
  }

  render() {
    return(
      <View style={[globalStyles.main_container__withoutTabBar,globalStyles.justifyContentCenter]}>
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
        <Loader isLoading={this.state.isLoading}/>
        <TouchableOpacity onPress={() => {
          this.setState({isLoading:true},() => this._resetPassword())
        }}>
        <View style={styles.button_container}>
        <Text style={styles.button_text}>Réinitialiser mon mot de passe</Text>
        </View>
        </TouchableOpacity>
        {this._showSuccess()}
        {this._showError()}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  line: {
    marginTop: 10,
    marginBottom: 20,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
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
  error_container: {
    marginBottom: 10,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
    error_text: {
      color: 'red',
      marginLeft: 10,
      fontFamily: 'OpenSans-Bold'
    },
  message_container: {
    marginBottom: 10,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
    success_text: {
      color: '#8AA29E',
      marginLeft: 10,
      fontFamily: 'OpenSans-Bold'
    },
    error_text: {
      color: '#db5461',
      marginLeft: 10,
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
})

export default ResetPassword
