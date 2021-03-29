import React from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native'
import CustomButton from '../../Global/CustomButton'
import { isNumber, requiredPicker, requiredInput } from '../Field/Validation'
import { renderInput, renderRadio, slider, selectRegion, list } from '../Field/Fields'
import globalStyles from '../../Global/globalStyles'
import { Field, Formik } from 'formik'
import { sort } from '../../../method/object'

class AppellationForm extends React.Component {

	constructor(props) {
		super(props)

		this.state={
			varieties:this.props.varieties||[]
		}
	}

	render() {
		return (
			<Formik
        initialValues={this.props.initialValues}
				onSubmit={values => this.props.onSubmit(values)}
      >
	   		{({ handleSubmit, isSubmitting }) => (
				<View>
					<View style={styles.top_container}>
	          <View><Field name="region" navigation={this.props.navigation} region={this.props.region} country={this.props.country} component={selectRegion}/></View>
	          <View><Field name="color" component={renderRadio}/></View>
	        </View>

					<Field
	          name="name"
	          label="Nom de l'appellation ?"
	          autoCorrect={false}
	          component={renderInput}
	        />

	        <Text style={[globalStyles.h3,globalStyles.mb10,globalStyles.mt10]}>Temps de garde</Text>
	        <Field
	          name="range"
	          component={slider}
	          valuemin={(this.props.initialValues.yearmin?this.props.initialValues.yearmin:2)}
	          valuemax={(this.props.initialValues.yearmax?this.props.initialValues.yearmax:5)}
	          max={(this.props.initialValues.yearmax?parseInt(this.props.initialValues.yearmax,10)+5:21)}
	          allowValueMin={(this.props.initialValues.yearmin?true:false)}
	          allowValueMax={(this.props.initialValues.yearmax?true:false)}
	          suffixe=" ans"
	        />

	        <Text style={[globalStyles.h3,globalStyles.mb10,globalStyles.mt10]}>Température de service</Text>
	        <Field
	          name="temp"
	          component={slider}
	          valuemin={(this.props.initialValues.tempmin?this.props.initialValues.tempmin:14)}
	          valuemax={(this.props.initialValues.tempmax?this.props.initialValues.tempmax:16)}
	          max={(this.props.initialValues.tempmax?parseInt(this.props.initialValues.tempmax,10)+5:25)}
	          allowValueMin={(this.props.initialValues.tempmin?true:false)}
	          allowValueMax={(this.props.initialValues.tempmax?true:false)}
	          suffixe="°C"
	        />

	        <Text style={[globalStyles.h3,globalStyles.mb10,globalStyles.mt10]}>Cépages</Text>
	        <Field
						name="varieties"
						component={list}
						selected={this.props.initialValues.varieties}
						styleLabel={{
							textTransform: 'uppercase',
							fontSize: 12,
							color: '#053C5C'
						}}
						default='Appuyez ici pour sélectionner des cépages'
						data={[{title:'Rouge',data:sort(this.state.varieties.filter(v => v.color === 'r'),'name')},{title:'Blanc',data:sort(this.state.varieties.filter(v => v.color === 'w'),'name')}]}
	        />

	        <CustomButton
						action={(!isSubmitting?handleSubmit:null)}
						isLoading={(!isSubmitting?false:true)}
	          style={[globalStyles.mt15,globalStyles.mb20]}
	          colorBg='#2F6F8F'
	          text={this.props.submitText?this.props.submitText:"Ajouter cette appellation"}
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
		marginLeft: 10,
		marginRight: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
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

export default AppellationForm
