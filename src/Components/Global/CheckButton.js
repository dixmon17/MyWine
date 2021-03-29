import React from 'react'
import { Button } from 'react-native-paper'

class CheckButton extends React.Component {

  render() {
    return(
      <Button
        mode="outlined"
        color={
          (this.props.selected?this.props.color:'white')
        }
        style={{
          borderColor: this.props.color,
          backgroundColor: (this.props.selected?'white':this.props.color),
          marginRight: 10,
          borderWidth: 1,
        }}
        onPress={this.props.action}
      >
        {this.props.children}
      </Button>
    )
  }

}

export default CheckButton
