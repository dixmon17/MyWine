import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import Login from '../User/Login'
import Loader from '../Global/Loader'
import globalStyles from '../Global/globalStyles'
import LogoLogin from '../Global/LogoLogin'

class Signin extends React.Component {

  constructor(props) {
    super(props)

    this.state={
      isLoading:false,
      keyboard: 'close'
    }
  }

  render() {
    return(
    <View style={globalStyles.flex1}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={globalStyles.main_container}>
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
      </View>
      </TouchableWithoutFeedback>
    </View>
    )
  }

  componentDidUpdate() {
    if (!this.props.offline) this.props.navigation.goBack()
  }
}

const styles = StyleSheet.create({
  login_container: {
    flex:1,
    justifyContent: 'center',
    flexDirection: 'column'
  },
    top_container: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    },
    middle_container: {
      marginTop: 30
    },
})

const mapStateToProps = state => {
  return {
    offline: state.oauth.offline
	}
}

export default connect(
  mapStateToProps
)(Signin)
