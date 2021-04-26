import React from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native'
import List from './List'
import Slider from './Slider'
import ReSelect from './ReSelect'
import SelectRegion from './SelectRegion'
import SelectSize from './SelectSize'
import SelectCountry from './SelectCountry'
import { Checkbox } from 'react-native-paper'
import InputSpinner from "react-native-input-spinner"
import Icon from 'react-native-vector-icons/FontAwesome5'
import { size } from '../../../data/size'
import Shadow from '../../Global/Shadow'

export const renderInput = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, handleChange }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  return (
    <View>
      <Shadow>
        <TextInput onChangeText={handleChange('name')} style={styles.text_input} keyboardType={(props.keyboardType ? props.keyboardType : 'default')} value={field.value} {...props} placeholder={props.label} />
      </Shadow>
      {/*touched && (errors && <View style={styles.error_container}><Icon name="exclamation-triangle" size={12} color='#053C5C'/><Text style={styles.error} >{errors}</Text></View>)*/}
    </View>
  )
}

export const slider = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  return (
    <View>
      <Slider
        appellation={props.appellation}
        valuemin={props.valuemin}
        valuemax={props.valuemax}
        max={props.max}
        allowValueMin={props.allowValueMin}
        allowValueMax={props.allowValueMax}
        suffixe={props.suffixe}
        change={(values) => setFieldValue(field.name, values)}
      />
    </View>
  )
}

export const renderRadio = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  return (
    <View style={styles.radio_container}>
      <TouchableOpacity
        style={[(field.value === 'r' ? { width: 40, height: 40 } : { width: 30, height: 30 }), { backgroundColor: '#DB3D4D' }, styles.radio_touchable]}
        onPress={() => setFieldValue(field.name, 'r')}
      >
        <View style={styles.radio_circle}>
          {(field.value === 'r' ? <Icon name='check' size={13} color='white' /> : undefined)}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[(field.value === 'w' ? { width: 40, height: 40 } : { width: 30, height: 30 }), { backgroundColor: '#F8D872' }, styles.radio_touchable]}
        onPress={() => setFieldValue(field.name, 'w')}
      >
        <View style={styles.radio_circle}>
          {(field.value === 'w' ? <Icon name='check' size={10} color='white' /> : undefined)}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[(field.value === 'p' ? { width: 40, height: 40 } : { width: 30, height: 30 }), { backgroundColor: '#FFD4C4' }, styles.radio_touchable]}
        onPress={() => setFieldValue(field.name, 'p')}
      >
        <View style={styles.radio_circle}>
          {(field.value === 'p' ? <Icon name='check' size={10} color='white' /> : undefined)}
        </View>
      </TouchableOpacity>
    </View>
  )
}
export const selectSize = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  return (
    <View>
      <SelectSize
        change={(values) => setFieldValue(field.name, values)}
        size={props.size}
      />
    </View>
  )
}

export const list = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  return (
    <View>
      <List
        change={(values) => setFieldValue(field.name, values)}
        appellation={props.appellation}
        expandable={props.expandable}
        selected={props.selected}
        default={props.default}
        data={props.data}
        styleLabel={props.styleLabel}
        navigation={props.navigation}
      />
    </View>
  )
}

export const selectRegion = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  return (
    <View>
      <SelectRegion
        change={(values) => setFieldValue(field.name, values)}
        region={props.region}
        country={props.country}
        navigation={props.navigation}
      />
    </View>
  )
}

export const selectCountry = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  return (
    <View>
      <SelectCountry
        change={(values) => setFieldValue(field.name, values)}
        country={props.country}
        navigation={props.navigation}
      />
    </View>
  )
}

export const reSelect = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  return (
    <View>
      <ReSelect
        changeAppellation={(values) => {
          setFieldValue('appellation', values)
          props.onChange(values)
        }}
        appellation={props.appellation}
        changeDomain={(values) => setFieldValue('domain', values)}
        domain={props.domain}
      />
    </View>
  )
}

export const spinner = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  return (
    <InputSpinner
      max={props.max}
      min={props.min}
      step={props.step}
      height={45}
      colorLeft={props.colorLeft}
      colorRight={props.colorRight}
      colorMin={props.colorPress}
      colorMax={props.colorPress}
      colorPress={props.colorPress}
      textColor={props.textColor}
      buttonFontSize={30}
      value={field.value}
      buttonStyle={{ paddingBottom: 6 }}
      onChange={(num) => setFieldValue(field.name, num)}
    />
  )
}

export const checkbox = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  return (
    <Checkbox.Item
      label={props.label}
      color={props.color}
      status={field.value ? 'checked' : 'unchecked'}
      labelStyle={styles.checkbox}
      onPress={() => setFieldValue(field.name, (field.value ? field.value = false : field.value = true))}
    />
  )
}


const styles = StyleSheet.create({
  text_input: {
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 15,
    padding: 10,
    paddingLeft: 20,
    backgroundColor: 'white',
  },

  error_container: {
    padding: 5,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  error: {
    paddingLeft: 5,
    color: '#053C5C'
  },

  radio_container: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  radio_touchable: {
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 50,
    padding: 3,
  },
  radio_circle: {
    flex: 1,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },

  checkbox: {
    textTransform: 'uppercase',
    fontSize: 14
  },
})
