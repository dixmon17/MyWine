import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import globalStyles from '../Global/globalStyles'
import auth from '@react-native-firebase/auth'
import Modal from 'react-native-modal'
import Icon from 'react-native-vector-icons/FontAwesome5'

class Signup extends React.Component {

  constructor(props) {
    super(props)

    this.state={
      tooManyMail:false
    }
  }

  _sendConfirmation(email) {
    const user = auth().currentUser;

    user.sendEmailVerification().then(() => {
      console.log('Email sent');
      this.setState({tooManyMail:false})
    }).catch((error) => {
      console.log(error);
      if (error.code==='auth/too-many-requests') {
        this.setState({tooManyMail:true})
      }
    });
  }

  render() {
    return(
      <Modal isVisible={this.props.isVisible}>
       <View
        style={{flex: 1, backgroundColor: 'white', justifyContent: 'space-between', borderRadius: 20, overflow: 'hidden', marginTop: 30, marginBottom: 30}}
       >
        <View style={{alignItems: 'center', justifyContent: 'center',flex:1}}>
          <View>
            <ActivityIndicator size="large" color="#2F6F8F" />
            <Text style={[globalStyles.h1,globalStyles.mt10,globalStyles.mb20]}>En attente de validation</Text>
          </View>
          <TouchableOpacity onPress={() => this._sendConfirmation()}>
            <Text style={globalStyles.h3}>Recevoir un nouveau mail de confirmation</Text>
          </TouchableOpacity>
          {( this.state.tooManyMail ? (
            <View style={styles.error_container}>
              <Icon
              name='exclamation-triangle'
              size={15}
              color='#db5461'
              style={globalStyles.mr10}
              />
              <Text style={styles.error_text}>
                Veuillez patienter avant de demander un nouveau mail.
              </Text>
            </View>
          ) : null )}
        </View>

        <TouchableOpacity style={[{padding: 10, paddingTop: 0},globalStyles.row,globalStyles.justifyContentCenter]} onPress={() => this.props.hide()}>
          <Icon name="angle-down" color={'#686963'} size={20} />
          <Text style={[{color: '#686963'},globalStyles.ml5, globalStyles.bold]}>Fermer</Text>
        </TouchableOpacity>
       </View>
      </Modal>
    )
  }

}



const styles = StyleSheet.create({
  error_container: {
    width: '80%',
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
    error_text: {
      flex:1,
      color: '#db5461',
      fontSize: 12,
      fontFamily: 'OpenSans-Bold'
    },
})

export default Signup
