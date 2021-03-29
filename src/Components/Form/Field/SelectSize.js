import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native'
import Modal from 'react-native-modal'
import { size } from '../../../data/size'
import globalStyles from '../../Global/globalStyles'
import Icon from 'react-native-vector-icons/FontAwesome5'

class SelectSize extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      size:props.size,
      isModalVisible:false,
    }
  }

  _submit(values) {
    this.props.change(values)
    this.setState({
      size: values,
      isModalVisible: !this.state.isModalVisible
    })
  }

	render() {
		return (
      <View>
        <Modal isVisible={this.state.isModalVisible}>
          <View
           style={{flex: 1, backgroundColor: 'white', justifyContent: 'space-between', borderRadius: 20, overflow: 'hidden', marginTop: 30, marginBottom: 30}}
          >
           <FlatList
             vertical
             data={size}
             keyExtractor={(item) => item.name}
             renderItem={({item}) => (
               <TouchableOpacity
                 onPress={() => this._submit(item.size)}
                 style={styles.list_line}
               >
                 <View style={styles.list_columnLeft}><Text>{item.size/1000}L</Text></View>
                 <View style={styles.list_columnRight}><Text>{item.name}</Text></View>
               </TouchableOpacity>
             )}
           />

           <TouchableOpacity style={[{padding: 10},globalStyles.row,globalStyles.justifyContentCenter]} onPress={() => this.setState({unfindable: false, isModalVisible: !this.state.isModalVisible})}>
             <Icon name="angle-down" color={'#686963'} size={20} />
             <Text style={[{color: '#686963'},globalStyles.ml5, globalStyles.bold]}>Fermer</Text>
           </TouchableOpacity>
         </View>
       </Modal>

         <TouchableOpacity onPress={() => this.setState({isModalVisible: !this.state.isModalVisible})}>
           <Text style={{color:'#2F6F8F'}}>{this.state.size/1000}L ({size.find(s => s.size === this.state.size).name})</Text>
         </TouchableOpacity>
      </View>
		);
	}
}


const styles = StyleSheet.create({
  list_line: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:25,
    marginRight: 20
  },
    list_columnLeft: {
      flex:1,
      paddingBottom: 15,
      paddingLeft: 15,
      alignItems: 'flex-end',
      marginRight: 15
    },
    list_columnRight: {
      flex:4,
      borderBottomWidth: 0.7,
      paddingBottom: 15,
      paddingRight: 15,
    },
})

export default SelectSize
