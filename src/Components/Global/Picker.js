import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native'
import Modal from 'react-native-modal'
import globalStyles from './globalStyles'
import Icon from 'react-native-vector-icons/FontAwesome5'
import colors from './colors'

class Picker extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      value: this.props.data.find(d => d.value === this.props.selectedValue),
      isModalVisible:false,
    }
  }

  _onChange(values) {
    this.props.onChange(values.value)
    this.setState({
      value: values,
      isModalVisible: !this.state.isModalVisible
    })
  }

	render() {
		return (
      <View style={globalStyles.flex1}>
        <Modal animationOutTiming={500} animationIn="zoomInUp" useNativeDriver={true} onBackdropPress={() => this.setState({isModalVisible: !this.state.isModalVisible})} onBackButtonPress={() => this.setState({isModalVisible: !this.state.isModalVisible})} isVisible={this.state.isModalVisible}>
          <View
           style={[
             globalStyles.mt40,
             globalStyles.mb40,
             {backgroundColor: 'white', justifyContent: 'space-between', borderRadius: 20, overflow: 'hidden'}]}
          >
            <FlatList
              vertical
              data={this.props.data}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({item}) => (
               <TouchableOpacity
                 onPress={() => this._onChange(item)}
                 style={styles.list_line}
               >
                {(item.icon?<Icon name={item.icon} color={(item.color?item.color:colors.darkblue)} size={15} style={globalStyles.mr10} />:null)}
                {(item.value===this.props.selectedValue?<Icon name='check' color={colors.darkblue} size={15} style={globalStyles.mr10} />:null)}
                <Text style={[globalStyles.bold,{color:(item.color?item.color:colors.darkblue)}]}>{item.label}</Text>
               </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
               <View style={styles.line}/>
              )}
              ListFooterComponent={() => (
               <View/>
              )}
            />

           <TouchableOpacity style={[globalStyles.p10,globalStyles.row,globalStyles.justifyContentCenter]} onPress={() => this.setState({isModalVisible: !this.state.isModalVisible})}>
             <Icon name="angle-down" color={'#686963'} size={20} />
             <Text style={[{color: '#686963'},globalStyles.ml5, globalStyles.bold]}>Fermer</Text>
           </TouchableOpacity>
          </View>
        </Modal>
        {(this.props.data.length>1?(
          <TouchableOpacity style={[globalStyles.row,globalStyles.justifyContentSpaceBetween,globalStyles.alignItemsCenter,{height: 70}]} onPress={() => this.setState({isModalVisible: !this.state.isModalVisible})}>
            <Text style={[globalStyles.bold,{color:'#2F6F8F'}]}>{(this.state.value?this.state.value.label:null)}</Text>
            <Icon name="angle-down" color={'#2F6F8F'} size={20} />
          </TouchableOpacity>
        ):(
          <View style={[globalStyles.row,globalStyles.justifyContentSpaceBetween,globalStyles.alignItemsCenter,{height: 70}]}>
            <Text style={[globalStyles.bold,{color:'#2F6F8F'}]}>{(this.state.value?this.state.value.label:null)}</Text>
          </View>
        ))}
      </View>
		);
	}
}


const styles = StyleSheet.create({
  list_line: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop:25,
    paddingBottom:25,
    marginLeft:25,
    marginRight:25,
    flexDirection: 'row'
  },
  line: {
    flex:1,
    borderBottomWidth: 0.7,
    marginLeft:25,
    marginRight:25,
  },
})

export default Picker
