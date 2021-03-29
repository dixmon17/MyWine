import React from 'react'
import { StyleSheet, View, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Shadow from '../Global/Shadow'

class CustomTextInput extends React.Component {

  render() {
    return (
      <Shadow>
      <View style={[styles.text_input_container,this.props.style]}>
        <Icon
          name={(this.props.icon?this.props.icon:"edit")}
          color={(this.props.color?this.props.color:"#DB5460")}
          size={18}
        />
        <TextInput
         style={[styles.text_input,{color: (this.props.color?this.props.color:"#DB5460")}]}
         onChangeText={(text) => this.props.onChangeText(text)}
         placeholder={this.props.placeholder}
         defaultValue={this.props.defaultValue}
         keyboardType={this.props.keyboardType}
        />
      </View>
      </Shadow>
    )
  }

}

const styles = StyleSheet.create({
  text_input_container: {
    borderRadius: 50,
    padding: 10,
    paddingLeft: 20,
    backgroundColor: 'white',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
    text_input: {
      flex:1,
      marginLeft: 10,
      fontSize: 15,
      fontFamily: 'OpenSans-Bold',
      padding: 0,
    },
})

export default CustomTextInput
