import React from 'react'
import { View, Image, Dimensions } from 'react-native'
import globalStyles from './globalStyles'
import Logo from '../../img/xml/logo'

// import EnLargeLogo from '../../animation/EnLargeLogo'

class LogoLogin extends React.Component {

  render() {
    return(
      <View style={[globalStyles.justifyContentCenter,globalStyles.alignItemsCenter, {width: Dimensions.get('window').width*0.8, height: Dimensions.get('window').width*0.8*0.253}]}>
        <Logo/>
      </View>
    )
  }
  //
  // render() {
  //   return(
  //     <View style={[globalStyles.justifyContentCenter,globalStyles.alignItemsCenter, {backgroundColor: 'red'}]}>
  //       <EnLargeLogo shouldEnlarge={(this.props.keyboard === 'close' ? true : false)}>
  //         <Logo/>
  //       </EnLargeLogo>
  //     </View>
  //   )
  // }

}

export default LogoLogin
