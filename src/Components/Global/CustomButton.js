import React from 'react'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'

class CustomButton extends React.Component {

  _backgroundColor() {
    return (this.props.colorBg ? this.props.colorBg : '#DB5460');
 }

  render() {
    return (
      <Button icon={ this.props.icon } loading={this.props.isLoading} mode="contained" contentStyle={styles.contentStyle} labelStyle={[styles.labelStyle,this.props.labelStyle]} style={[this.props.style,styles.container,{backgroundColor: this._backgroundColor()}]} onPress={this.props.action}>
        { this.props.text }
      </Button>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
  },
  contentStyle: {
    padding: 5,
    paddingLeft: 15,
    alignSelf: 'flex-start'
  },
  labelStyle: {
    fontSize: 12
  }
})

export default CustomButton
