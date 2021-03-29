import React from 'react'
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, AppState } from 'react-native'
import { connect } from 'react-redux'
import { List } from 'react-native-paper'
import globalStyles from '../Global/globalStyles'
import auth from '@react-native-firebase/auth'
import Icon from 'react-native-vector-icons/FontAwesome5'

class Setting extends React.Component {

  constructor(props) {
    super(props)

    this.state={
      success: null,
      error: null,
      logout:false
    }
  }

  // _handleAppStateChange = nextAppState => {
  //   if (nextAppState === "active") {
  //     this._checkVerified()
  //   }
  // }
  //
  // componentDidMount() {
  //   if (this.props.oauth.verified || this.props.oauth.offline) return
  //
  //   this._navListener = this.props.navigation.addListener('focus', () => {
  //     this._checkVerified()
  //   });
  //   AppState.addEventListener("change", this._handleAppStateChange);
  // }
  //
  // componentWillUnmount() {
  //   if (this.props.oauth.verified || this.props.oauth.offline) return
  //
  //   if (this._navListener) this._navListener()
  //   AppState.removeEventListener("change", this._handleAppStateChange);
  // }
  //
  // _checkVerified() {
  //   if (this.props.oauth.verified || this.props.oauth.offline) return
  //
  //   const user = auth().currentUser
  //
  //   if (!user) return
  //   if (!user.emailVerified) {
  //     user.reload()
  //     return
  //   }
  //   this.props.isVerified()
  //   this._navListener()
  //   AppState.removeEventListener("change", this._handleAppStateChange);
  // }
  //
  // _sendConfirmation(email) {
  //   const user = auth().currentUser;
  //
  //   user.sendEmailVerification().then(function() {
  //     console.log('Email sent');
  //   }).catch(function(error) {
  //     console.log(error);
  //   });
  // }

  _drawVerification() {
    return (
      <View>
        <List.Subheader>{( !this.props.oauth.offline ? this.props.oauth.email : 'Non connecté' )}</List.Subheader>

        {/* (!this.props.oauth.verified && !this.props.oauth.offline?(
          <TouchableOpacity
            onPress={() => this._sendConfirmation(this.props.oauth.email)}
          >
            <List.Item
              title="Recevoir une nouvelle confirmation"
              left={() => <List.Icon icon="reply" color="#053C5C" />}
            />
          </TouchableOpacity>
        ):null) */}
      </View>
    )
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

  _changePassword() {
    auth().sendPasswordResetEmail(auth().currentUser.email)
    .then(() => {
      this.setState({success:'Un email a été envoyé à cet email pour réinitialiser votre mot de passe',error:null})
    })
    .catch(error => {
      this.setState({error:'Une erreur est survenue',success:null})
    })
  }

  _logout() {
    if (this.state.logout) return
    this.setState({logout:true}, () => {
      this.props.logout()
      this.props.resetWine()
      this.props.resetPosition()
      this.props.resetBlock()
      this.props.resetCellar()
      this.props.resetRegion()
      this.props.resetCountry()
      this.props.resetDomain()
      this.props.resetAppellation()
      auth()
      .signOut()
      .then(() => console.log('User signed out!'));
    })
  }

  _signin() {
    this.props.navigation.navigate('Signin')
  }

  _drawAccountOptions() {
    if(this.props.oauth.offline) {
      return(
        <View>
          <List.Subheader>Mon compte</List.Subheader>
          <TouchableOpacity
            onPress={() => this._signin()}
          >
            <List.Item
              title="Me connecter"
              titleStyle={{fontFamily: 'OpenSans-Bold',color:'#053C5C'}}
              left={() => <List.Icon icon="sign-in-alt" color="#053C5C" />}
            />
          </TouchableOpacity>
        </View>
      )
    }

    return(
      <View>
        <List.Subheader>Mon compte</List.Subheader>
        <TouchableOpacity
          onPress={() => this._changePassword()}
        >
          <List.Item
            title="Modifier mon mot de passe"
            left={() => <List.Icon icon="key" color="#053C5C" />}
          />
        </TouchableOpacity>
        {this._showSuccess()}
        <TouchableOpacity
          onPress={() => this._logout()}
        >
          <List.Item
            title="Déconnexion"
            left={() => <List.Icon icon="sign-out-alt" color="#053C5C" />}
          />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <ScrollView>
        <List.Section>
          {(!this.state.logout?(this._drawVerification()):null)}
          <List.Subheader>Mes ajouts</List.Subheader>
          <TouchableOpacity
            onPress={() => {this.props.navigation.navigate('MyAppellation')}}
          >
            <List.Item
              title="Mes appellations"
              left={() => <List.Icon icon="tags" color="#053C5C" />}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {this.props.navigation.navigate('MyDomain')}}
          >
            <List.Item
              title="Mes domaines"
              left={() => <List.Icon icon="chess-rook" color="#053C5C" />}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {this.props.navigation.navigate('MyRegion')}}
          >
            <List.Item
              title="Mes régions"
              left={() => <List.Icon icon="university" color="#053C5C" />}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {this.props.navigation.navigate('MyCountry')}}
          >
            <List.Item
              title="Mes pays"
              left={() => <List.Icon icon="font-awesome-flag" color="#053C5C" />}
            />
          </TouchableOpacity>
          { this._drawAccountOptions() }
        </List.Section>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  message_container: {
    marginLeft: 46,
    marginRight: 20,
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
})

const mapStateToProps = state => {
	return {
    oauth: state.oauth
	}
}

const mapDispatchToProps = dispatch => {
	return {
    isVerified: data => dispatch({type:'IS_VERIFIED'}),
    logout: data => dispatch({type:'LOGOUT'}),
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
)(Setting)
