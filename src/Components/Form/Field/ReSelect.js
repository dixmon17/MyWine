import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import DispatchContainer from '../DispatchContainer'
import globalStyles from '../../Global/globalStyles'
import { colorLabel } from '../../../data/color'
import Icon from 'react-native-vector-icons/FontAwesome5'

class ReSelect extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isModalAppellationVisible:false,
      isModalDomainVisible:false,
      appellation:this.props.appellation,
      domain:this.props.domain
    }

    this.initialRegion = this.props.appellation.region
  }

  _submitAppellation(values) {
    this.props.changeAppellation(values.appellation.id)
    // if (values.appellation.region !== this.initialRegion) this.props.changeDomain(false)
    this.setState({
      // domain: ((values.appellation.region !== this.initialRegion) ? {name:'Non défini', id:false} : this.state.domain),
      appellation: values.appellation,
      isModalAppellationVisible: !this.state.isModalAppellationVisible
    })
  }

  _submitDomain(values) {
    this.props.changeDomain(values.domain.id)
    this.setState({
      domain: values.domain,
      isModalDomainVisible: !this.state.isModalDomainVisible
    })
  }

	render() {
		return (
      <View>
        <View style={globalStyles.mt20}>
          <Modal animationOutTiming={500} animationIn="zoomInUp" useNativeDriver={true} onBackdropPress={() => this.setState({isModalAppellationVisible: !this.state.isModalAppellationVisible})} onBackButtonPress={() => this.setState({isModalAppellationVisible: !this.state.isModalAppellationVisible})} isVisible={this.state.isModalAppellationVisible}>
           <View
            style={{flex: 1, backgroundColor: 'white', justifyContent: 'space-between', borderRadius: 20, overflow: 'hidden', marginTop: 30, marginBottom: 30}}
           >
             <DispatchContainer
               appellation={true}
               region={true}
               country={true}
               appellationMore={true}
               domain={false}
               wine={false}
               initial='appellation'
               onSubmit={(values) => this._submitAppellation(values)}
             />

             <TouchableOpacity style={[{padding: 10, paddingTop: 0},globalStyles.row,globalStyles.justifyContentCenter]} onPress={() => this.setState({unfindable: false, isModalAppellationVisible: !this.state.isModalAppellationVisible})}>
               <Icon name="angle-down" color={'#686963'} size={20} />
               <Text style={[{color: '#686963'},globalStyles.ml5, globalStyles.bold]}>Fermer</Text>
             </TouchableOpacity>
           </View>
         </Modal>

          <TouchableOpacity style={styles.cat_container} onPress={() => this.setState({isModalAppellationVisible: !this.state.isModalAppellationVisible})}>
            <Text style={[globalStyles.h3,globalStyles.mb5]}>Appellation</Text>
            <Text style={styles.appellation_name}>{(this.state.appellation.name?this.state.appellation.name + ' ' + colorLabel.find(c => c.value === this.state.appellation.color).label:'Non défini')}</Text>
          </TouchableOpacity>
        </View>

        <View style={[globalStyles.mt15,globalStyles.mb10]}>
          <Modal animationOutTiming={500} animationIn="zoomInUp" useNativeDriver={true} onBackdropPress={() => this.setState({isModalDomainVisible: !this.state.isModalDomainVisible})} onBackButtonPress={() => this.setState({isModalDomainVisible: !this.state.isModalDomainVisible})} isVisible={this.state.isModalDomainVisible}>
            <View
              style={{flex: 1, backgroundColor: '#fafafa', justifyContent: 'space-between', borderRadius: 20, overflow: 'hidden', marginTop: 20, marginBottom: 20, paddingTop: 10, paddingLeft: 10, paddingRight: 10}}
            >
             <DispatchContainer
               appellation={false}
               region={false}
               country={false}
               domain={true}
               wine={false}
               dataRegion={{id:this.state.appellation.region,name:'Domaine'}}
               initial='domain'
               onSubmit={(values) => this._submitDomain(values)}
             />

             <TouchableOpacity style={[{padding: 10, paddingTop: 0},globalStyles.row,globalStyles.justifyContentCenter]} onPress={() => this.setState({unfindable: false, isModalDomainVisible: !this.state.isModalDomainVisible})}>
               <Icon name="angle-down" color={'#686963'} size={20} />
               <Text style={[{color: '#686963'},globalStyles.ml5, globalStyles.bold]}>Fermer</Text>
             </TouchableOpacity>
           </View>
         </Modal>

          <TouchableOpacity style={[styles.cat_container]} onPress={() => this.setState({isModalDomainVisible: !this.state.isModalDomainVisible})}>
            <Text style={[globalStyles.h3,globalStyles.mb5]}>Domaine</Text>
            <Text style={styles.domain_name}>{(this.state.domain.name?this.state.domain.name:'Non défini')}</Text>
          </TouchableOpacity>
        </View>
      </View>
		);
	}
}

const styles = StyleSheet.create({
  cat_container: {
    marginLeft: 5,
  },
    appellation_name: {
      textTransform: 'uppercase',
      fontSize: 20,
      fontFamily: 'Ubuntu-Bold',
      color: '#053C5C'
    },
    domain_name: {
      fontSize: 17,
      fontFamily: 'Ubuntu-Bold',
      color: '#053C5C'
    },
})

export default ReSelect
