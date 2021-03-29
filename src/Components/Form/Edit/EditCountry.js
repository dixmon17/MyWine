import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { connect } from 'react-redux'
import { getCountry } from '../../../orm/selectors'
import globalStyles from '../../Global/globalStyles'
import { CommonActions } from '@react-navigation/native'
import CountryForm from '../Form/CountryForm'
import { validateCountry } from '../validation'

class EditCountry extends React.Component {

  _submit = (values) => {
    if (!validateCountry(values)) return

    this.props.updateCountry(values)

    this.props.navigation.dispatch(CommonActions.goBack());
  }

	render() {
		return (
      <View style={globalStyles.main_container}>
        <Text style={ [globalStyles.h1, globalStyles.mt20, globalStyles.mb10] }>Modifier un pays</Text>
        <View>
        <CountryForm
          country={this.props.country}
          submitText="Modifier ce pays"
          submitIcon="edit"
          onSubmit={this._submit}
          initialValues={this.props.country}
        />
        </View>
			</View>
		);
	}

}

const mapStateToProps = (state, props) => {
  return {
    country: getCountry(state, props.route.params.countryId),
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateCountry: data => dispatch({type:'UPDATE_COUNTRY', payload:data}),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditCountry);
