import React from 'react'
import DispatchContainer from '../DispatchContainer'

class ManualAdd extends React.Component {

  render() {
    return (
      <DispatchContainer
        appellation={false}
        region={false}
        country={false}
        appellationMore={false}
        domain={false}
        wine={true}
        navigation={this.props.navigation}
        initial='wine'
      />
    )
  }
}

export default ManualAdd
