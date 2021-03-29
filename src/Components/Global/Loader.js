import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import Modal from 'react-native-modal'

class Loader extends React.Component {

  render() {
    return (
      <Modal isVisible={this.props.isLoading} backdropColor='rgba(255,255,255,0.9)' style={{justifyContent: 'center', alignItems: 'center'}}>
         <ActivityIndicator size="large" color="#2F6F8F" />
     </Modal>
    )
  }

}

export default Loader
