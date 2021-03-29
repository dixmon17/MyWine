import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import DispatchContainer from '../DispatchContainer'
import globalStyles from '../../Global/globalStyles'
import Icon from 'react-native-vector-icons/FontAwesome5'

class SelectRegion extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isModalVisible:false,
      region:this.props.region,
      country:this.props.country,
    }
  }

  _submit(values) {
    this.props.change(values.region.id)
    this.setState({
      region: values.region,
      country: values.country,
      isModalVisible: !this.state.isModalVisible
    })
  }

	render() {
		return (
      <View>
        <Modal animationOutTiming={500} animationIn="zoomInUp" useNativeDriver={true} onBackdropPress={() => this.setState({isModalVisible: !this.state.isModalVisible})} onBackButtonPress={() => this.setState({isModalVisible: !this.state.isModalVisible})} isVisible={this.state.isModalVisible}>
        <View
          style={{flex: 1, backgroundColor: '#fafafa', justifyContent: 'space-between', borderRadius: 20, overflow: 'hidden', marginTop: 20, marginBottom: 20, paddingTop: 10, paddingLeft: 10, paddingRight: 10}}
        >
           <DispatchContainer
             appellation={false}
             region={true}
             country={true}
             domain={false}
             wine={false}
             initial='region'
             onSubmit={(values) => this._submit(values)}
           />
           <TouchableOpacity style={[globalStyles.p10,{paddingTop: 0},globalStyles.row,globalStyles.justifyContentCenter]} onPress={() => this.setState({isModalVisible: !this.state.isModalVisible})}>
             <Icon name="angle-down" color={'#686963'} size={20} />
             <Text style={[{color: '#686963'},globalStyles.ml5, globalStyles.bold]}>Fermer</Text>
           </TouchableOpacity>
          </View>
       </Modal>

        <TouchableOpacity onPress={() => this.setState({isModalVisible: !this.state.isModalVisible})}>
          <Text>{this.state.region.name}</Text>
          <Text>{this.state.country.name}</Text>
        </TouchableOpacity>
      </View>
		);
	}
}

export default SelectRegion
