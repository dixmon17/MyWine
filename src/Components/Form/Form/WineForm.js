import React from 'react'
import { StyleSheet, ScrollView, View, TextInput, Text, TouchableOpacity } from 'react-native'
import { Field, Formik } from 'formik'
import CustomButton from '../../Global/CustomButton'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { isNumber, requiredPicker, requiredInput } from '../Field/Validation'
import { renderInput, checkbox, slider, reSelect, spinner, selectSize, list } from '../Field/Fields'
import { size } from '../../../data/size'
import { sort } from '../../../method/object'
import globalStyles from '../../Global/globalStyles'
import Shadow from '../../Global/Shadow'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { connect } from 'react-redux'
import { getAppellationsWithDependencies } from '../../../orm/selectors'

class WineForm extends React.Component {

	constructor(props) {
		super(props)
// console.log(this.props.appellations);
		this.state={
			yearmin:(this.props.initialValues.yearmin?this.props.initialValues.yearmin:null),
			yearmax:(this.props.initialValues.yearmax?this.props.initialValues.yearmax:null),
			tempmin:(this.props.initialValues.tempmin?this.props.initialValues.tempmin:null),
			tempmax:(this.props.initialValues.tempmax?this.props.initialValues.tempmax:null),
			varieties:this.props.initialValues.varieties||[],
		}
	}

	render() {
		return (
			<ScrollView vertical={true} keyboardShouldPersistTaps={'handled'}>
  			<View style={globalStyles.main_container}>
					<Formik
		        initialValues={this.props.initialValues}
					  onSubmit={values => this.props.onSubmit({...values})}
		      >
		     		{({ errors, touched, isValidating, handleSubmit, values, isSubmitting }) => (
						<View>
							<Field
								name="reSelect"
								onChange={(appellation) => {
									let entity=this.props.appellations.find(a => a.id === appellation)
									console.log(entity);
									// varietyPercentages=this.props.varietyPercentages.filter(v => v.appellation === appellation).map(v => {return{name:v.variety.name,id:v.variety.id,percent:v.variety.percent,selected:true}})
									// console.log(entity,varietyPercentages);
									this.setState({
										appellation:entity.id,
										yearmin:entity.yearmin,
										yearmax:entity.yearmax,
										tempmin:entity.tempmin,
										tempmax:entity.tempmax,
										varieties:entity.varieties
									})
								}}
								validate={() => {
									if (!values.appellation && !values.domain) return 'Une appellation et un domaine doivent-être sélectionnés'
									if (!values.appellation) return 'Une appellation doit-être sélectionnée'
									if (!values.domain) return 'Un domaine doit-être sélectionné'
									return
								}}
								component={reSelect}
								appellation={{id:values.appellation,name:this.props.appellationName,color:this.props.appellationColor,region:this.props.appellationRegion}}
								domain={{id:values.domain,name:this.props.domainName,region:this.props.appellationRegion}}
							/>

							{(errors.reSelect && touched.appellation ? (
								<View style={styles.error_container}>
								<Icon
								name='exclamation-triangle'
								size={15}
								color='#db5461'
								/>
								<Text style={styles.error_text}>
								{errors.reSelect}
								</Text>
								</View>
							) : null )}

							<Shadow>
			        <View style={styles.data_top_container}>
			          <View style={[globalStyles.row,globalStyles.alignItemsCenter]}>
			            <View style={[globalStyles.row,globalStyles.alignItemsCenter,globalStyles.flex1]}>
			              <MaterialIcon style={styles.data_top_container__icon} name="update" color="black" size={25}/>
			              <Text>Millesime</Text>
			            </View>
									<View style={styles.data_top_container__right}>
			              <Field
			                name="millesime"
											value={values.millesime}
			                component={spinner}
											max={99999}
			                step={1}
			                colorLeft={"#DB5461"}
			                colorRight={"#DB5461"}
			                colorPress={"#A3301C"}
			                textColor={"#2F6F8F"}
			              />
			            </View>
			          </View>

								<View style={[globalStyles.row,globalStyles.alignItemsCenter,globalStyles.mt15]}>
									<View style={[globalStyles.row,globalStyles.alignItemsCenter,globalStyles.flex1]}>
			            	<MaterialIcon style={styles.data_top_container__icon} name="contrast-circle" color="black" size={25}/>
			              <Text>Taille</Text>
			            </View>
			            <View style={styles.data_top_container__right}>
			              <Field name="size" component={selectSize} size={this.props.initialValues.size}/>
			            </View>
			          </View>

								<View style={[globalStyles.row,globalStyles.alignItemsCenter,globalStyles.mt15]}>
									<View style={[globalStyles.row,globalStyles.alignItemsCenter,globalStyles.flex1]}>
			              <MaterialIcon style={styles.data_top_container__icon} name="plus-circle-multiple-outline" color="black" size={25}/>
			              <Text>Quantité</Text>
			            </View>
									<View style={styles.data_top_container__right}>
			              <Field
			                name="quantity"
											value={values.quantity}
			                component={spinner}
			                max={99}
			                min={(values.id?this.props.initialValues.quantity:1)}
			                step={1}
			                colorLeft={"#DB5461"}
			                colorRight={"#DB5461"}
			                colorPress={"#A3301C"}
			                textColor={"#2F6F8F"}
			              />
			            </View>
			          </View>
			        </View>
							</Shadow>

			        <Text style={[globalStyles.h3,globalStyles.mb10,globalStyles.mt10]}>Temps de garde</Text>
			        <Field
			          name="range"
			          component={slider}
								appellation={this.state.appellation}
			          valuemin={(this.state.yearmin?this.state.yearmin:2)}
			          valuemax={(this.state.yearmax?this.state.yearmax:5)}
			          max={(this.state.yearmax?parseInt(this.state.yearmax,10)+5:21)}
			          allowValueMin={(this.state.yearmin?true:false)}
			          allowValueMax={(this.state.yearmax?true:false)}
			          suffixe=" ans"
			        />

			        <Text style={[globalStyles.h3,globalStyles.mb10,globalStyles.mt10]}>Température de service</Text>
			        <Field
			          name="temp"
			          component={slider}
								appellation={this.state.appellation}
			          valuemin={(this.state.tempmin?this.state.tempmin:14)}
			          valuemax={(this.state.tempmax?this.state.tempmax:16)}
			          max={(this.state.tempmax?parseInt(this.state.tempmax,10)+5:25)}
			          allowValueMin={(this.state.tempmin?true:false)}
			          allowValueMax={(this.state.tempmax?true:false)}
			          suffixe="°C"
			        />

			        <Text style={[globalStyles.h3,globalStyles.mb10,globalStyles.mt10]}>Cépages</Text>
			        <Field
			          name="varieties"
			          component={list}
								expandable={true}
								selected={this.state.varieties}
								appellation={this.state.appellation}
								styleLabel={{
									textTransform: 'uppercase',
									fontSize: 12,
									color: '#053C5C'
								}}
								default='Appuyez ici pour sélectionner des cépages'
			          data={[{title:'Rouge',data:sort(this.props.varieties.filter(v => v.color === 'r'),'name')},{title:'Blanc',data:sort(this.props.varieties.filter(v => v.color === 'w'),'name')}]}
			        />

			        <View style={{flexDirection: 'row'}}>
			          <Field
			            name="sparkling"
			            component={checkbox}
			            label="Pétillant"
			            color="#DB5460"
			          />
			          <Field
			            name="bio"
			            component={checkbox}
			            label="Bio"
			            color="#DB5460"
			          />
			        </View>

			        <CustomButton
			          action={(!isSubmitting?handleSubmit:null)}
								isLoading={(!isSubmitting?false:true)}
			          style={[globalStyles.mt10,globalStyles.mb20]}
			          text="Ajouter ce vin"
								colorBg='#2F6F8F'
			          icon="plus"
			        />
							{this._drawRemoveButton(values.id)}

						</View>
				 		)}
					</Formik>
  			</View>
      </ScrollView>
		);
	}

	_drawRemoveButton(edit) {
		if (!edit) return
		return(
			<CustomButton
				action={this.props.removeWine}
				style={globalStyles.mb20}
				text={this.props.submitText?this.props.submitText:"Supprimer ce vin"}
				colorBg="#A3301C"
				icon={this.props.submitIcon?this.props.submitIcon:"trash"}
			/>
		)
	}
}

const styles = StyleSheet.create({
	data_top_container: {
		backgroundColor: 'white',
		padding: 15,
		marginTop: 10,
		marginBottom: 10,
		borderRadius: 5,
	},
		data_top_container__icon: {
			marginRight: 5
		},
		data_top_container__right: {
			flex:3,
			alignItems: 'flex-end'
		},
	error_container: {
		marginBottom: 10,
		padding: 8,
		flexDirection: 'row',
		alignItems: 'center'
	},
		error_text: {
			color: '#db5461',
			marginLeft: 10,
			fontFamily: 'OpenSans-Bold'
		},
})

const mapStateToProps = (state) => {
  return {
    appellations: getAppellationsWithDependencies(state)
  };
}

export default connect(
  mapStateToProps
)(WineForm)
