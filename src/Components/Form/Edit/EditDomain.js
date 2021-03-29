import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { connect } from 'react-redux'
import { getDomains, getWinesByDomain } from '../../../orm/selectors'
import globalStyles from '../../Global/globalStyles'
import { CommonActions } from '@react-navigation/native'
import DomainForm from '../Form/DomainForm'
import { validateDomain } from '../validation'

class EditDomain extends React.Component {

	constructor(props) {
		super(props)

		this.regionId=this.props.domain.region
	}

  _submit = (values) => {
		if (!validateDomain(values)) return

    this.props.updateDomain(values)

    this.props.navigation.dispatch(CommonActions.goBack());
  }

	render() {
		return (
      <View style={globalStyles.main_container}>
        <Text style={ [globalStyles.h1, globalStyles.mt20] }>Modifier un domaine</Text>
        <View>
        <DomainForm
          submitText="Modifier ce domaine"
          submitIcon="edit"
          onSubmit={this._submit}
          initialValues={this.props.domain}
        />
        </View>
			</View>
		);
	}

}

const mapStateToProps = (state, props) => {
  return {
    domain: getDomains(state, props.route.params.domainId),
    wines: getWinesByDomain(state, props.route.params.domainId)
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
)(EditDomain);
