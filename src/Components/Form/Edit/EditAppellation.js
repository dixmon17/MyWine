import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import AppellationForm from '../Form/AppellationForm'
import { connect } from 'react-redux'
import { getAppellationWithDependencies, getRegions, getCountry, getVarieties, getVarietiesOfAppellation } from '../../../orm/selectors'
import { colorLabel } from '../../../data/color'
import globalStyles from '../../Global/globalStyles'
import { CommonActions } from '@react-navigation/native'
import { validateAppellation } from '../validation'

class EditAppellation extends React.Component {

  _submit = (values) => {
    if (values.temp) {
      values.tempmin = values.temp.valuemin
      values.tempmax = values.temp.valuemax
      delete values.temp
    }
    if (values.range) {
      values.yearmin = values.range.valuemin
      values.yearmax = values.range.valuemax
      delete values.range
    }

		if (!validateAppellation(values)) return

    this.props.updateAppellation(values)

    this.props.navigation.dispatch(CommonActions.goBack());
  }

	render() {
		return (
      <View style={globalStyles.main_container}>
        <Text style={ [globalStyles.h1, globalStyles.mt20, globalStyles.mb10, globalStyles.ml5] }>Modifier une appellation</Text>
        <View>
        <AppellationForm
          region={this.props.appellation.region}
          country={this.props.appellation.country}
					varieties={this.props.varietiesData}
          submitText="Modifier cette appellation"
          submitIcon="edit"
          onSubmit={this._submit}
          initialValues={{...this.props.appellation, region:this.props.appellation.region.id}}
        />
        </View>
			</View>
		);
	}

}

const mapStateToProps = (state, props) => {
  return {
    appellation: getAppellationWithDependencies(state, props.route.params.appellationId),
    varietiesData: getVarieties(state).filter(a => a.enabled),
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateAppellation: data => dispatch({type:'UPDATE_APPELLATION', payload:data}),
		updateDomain: data => dispatch({type:'UPDATE_DOMAIN', payload:data}),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditAppellation);
