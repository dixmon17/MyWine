import React from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native'
import CustomButton from '../../Global/CustomButton'
import { isNumber, requiredPicker, requiredInput } from '../Field/Validation'
import { renderInput, renderRadio, slider, selectCountry } from '../Field/Fields'
import globalStyles from '../../Global/globalStyles'
import { Field, Formik } from 'formik'

class RegionForm extends React.Component {

	render() {
		return (
			<Formik
        initialValues={this.props.initialValues}
				onSubmit={values => this.props.onSubmit(values)}
      >
	   		{({ handleSubmit, isSubmitting }) => (
				<View>
	        <View style={styles.top_container}>
						<Field name="country" navigation={this.props.navigation} country={this.props.country} component={selectCountry}/>
	        </View>
					<Field
	          name="name"
	          label="Nom de la région ?"
	          autoCorrect={false}
	          component={renderInput}
	          validate={[ requiredInput ]}
	        />

	        <CustomButton
						action={(!isSubmitting?handleSubmit:null)}
						isLoading={(!isSubmitting?false:true)}
	          style={[globalStyles.mt10,globalStyles.mb20]}
	          colorBg='#2F6F8F'
	          text={this.props.submitText?this.props.submitText:"Ajouter cette région"}
	          icon={this.props.submitIcon?this.props.submitIcon:"plus"}
	        />
				</View>
				)}
			</Formik>
		);
	}
}

const styles = StyleSheet.create({
  h2: {
    fontFamily: 'OpenSans-Light',
    color: 'grey',
    fontSize: 13,
    marginTop: 15,
    marginBottom: 15
  },
	top_container: {
		flexDirection: 'row',
		alignItems: 'center'
	},
		top_container__left: {
			flex: 2,
			marginLeft: 10
		},
		top_container__right: {
			textTransform:'uppercase',
			fontSize: 12
		},
})

export default RegionForm
