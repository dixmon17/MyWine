import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { connect } from 'react-redux'
import { getRegions, getCountry } from '../../../orm/selectors'
import globalStyles from '../../Global/globalStyles'
import { CommonActions } from '@react-navigation/native'
import RegionForm from '../Form/RegionForm'
import { validateRegion } from '../validation'

class EditDomain extends React.Component {

	constructor(props) {
		super(props)

		this.countryId=this.props.region.country
	}

  _submit = (values) => {
		if (!validateRegion(values)) return

    this.props.updateRegion(values)

    this.props.navigation.dispatch(CommonActions.goBack());
  }

	render() {
		return (
      <View style={{flex:1}}>
      <View style={globalStyles.main_container}>
        <Text style={ [globalStyles.h1, globalStyles.mt20, globalStyles.mb10] }>Modifier une région</Text>
        <View>
        <RegionForm
          country={this.props.countries.find(c => c.id === this.countryId)}
          submitText="Modifier cette région"
          submitIcon="edit"
          onSubmit={this._submit}
          initialValues={this.props.region}
        />
        </View>
			</View>
		  </View>
		);
	}

}

const mapStateToProps = (state, props) => {
  return {
    region: getRegions(state, props.route.params.regionId),
    countries: getCountry(state).filter(c => c.enabled),
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateRegion: data => dispatch({type:'UPDATE_REGION', payload:data}),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditDomain);
