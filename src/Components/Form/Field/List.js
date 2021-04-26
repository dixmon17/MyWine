import React from 'react'
import { View, Text, TouchableOpacity, TextInput, SectionList, Platform, UIManager, LayoutAnimation, Keyboard } from 'react-native'
import Modal from 'react-native-modal'
import globalStyles from '../../Global/globalStyles'
import colors from '../../Global/colors'
import { getResults } from '../../../method/search'
import { sort } from '../../../method/object'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { Checkbox } from 'react-native-paper'

class List extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isModalVisible: false,
      data: this.props.data,
      selected: (this.props.selected && Array.isArray(this.props.selected) ? this.props.selected.map(v => { v.selected = true; return v }) : []),
      results: [],
      total: 0,
      appellation: this.props.appellation
    }

    this.text = null
    this.allData = { varieties: [] }

    if (this.props.data) this.props.data.map(d => (d.data ? d.data.map(item => this.allData.varieties.push(item)) : null))

    if (Platform.OS === 'android') { UIManager.setLayoutAnimationEnabledExperimental(true); }
  }

  componentDidMount() {
    this._submit(this.props.selected)
  }

  _onPress(item) {
    Keyboard.dismiss()
    let index = this.state.selected.findIndex(s => s.id === item.id), array, line
    if (index > -1) {
      array = [...this.state.selected]
      line = { ...array[index], selected: !array[index].selected, percent: null }
      array[index] = line
    } else {
      array = [...this.state.selected, { selected: 'true', name: item.name, id: item.id }]
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({ selected: array })

    this._submit(array)
  }

  _submit(array) {
    let fieldValues = []
    array.filter(d => d.selected).map(d => {
      if (this.props.expandable) {
        fieldValues.push({ id: d.id, percent: d.percent })
      } else {
        fieldValues.push(d.id)
      }
    })
    console.log(fieldValues);
    this.props.change(fieldValues)
  }

  _onChangeText(text) {
    this.text = text

    let results = getResults(this.text, this.allData)
    results.length = 3

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({
      results: results,
    })
  }

  _drawCurrent() {
    let selected = sort(this.state.selected.filter(s => s.selected), 'percent', 'desc')

    if (selected.length === 0) return <Text style={this.props.styleLabel} >{this.props.default}</Text>

    return selected.map(s => (
      <Text style={this.props.styleLabel} key={s.id}>{s.name} {(s.percent ? s.percent + '%' : null)}</Text>
    ))
  }

  componentDidUpdate() {
    // console.log(this.props.selected);
    if (this.props.appellation === this.state.appellation) return
    let total = 0
    this.state.selected.map(s => total += s.selected)
    this.setState({
      selected: this.props.selected,
      appellation: this.props.appellation,
      total: total
    }, () => this._submit(this.props.selected))
  }

  render() {
    return (
      <View>
        <Modal animationOutTiming={500} animationIn="zoomInUp" useNativeDriver={true} onBackdropPress={() => this.setState({ isModalVisible: !this.state.isModalVisible })} onBackButtonPress={() => this.setState({ isModalVisible: !this.state.isModalVisible })} isVisible={this.state.isModalVisible}>
          <View
            style={{ flex: 1, backgroundColor: '#fafafa', justifyContent: 'space-between', borderRadius: 20, overflow: 'hidden', marginTop: 20, marginBottom: 20, paddingTop: 15, paddingLeft: 15, paddingRight: 15 }}
          >
            <View style={[{ backgroundColor: '#E8EDEC', borderRadius: 15 }, globalStyles.row, globalStyles.alignItemsCenter, globalStyles.mb15]}>
              <Icon
                name="search"
                color="#91928B"
                style={[globalStyles.ml15, globalStyles.mr5]}
                size={15}
              />
              <TextInput
                autoFocus={false}
                autoComplete="off"
                onChangeText={(text) => this._onChangeText(text)}
                onSubmitEditing={() => { return }}
                placeholder='Rechercher'
                placeholderTextColor='#91928B'
                style={[globalStyles.flex1, { color: '#686963' }]}
              />
            </View>
            <View style={(this.state.results.length > 0 ? globalStyles.mb15 : null)}>
              {(this.state.results.map(r => (
                <View style={[globalStyles.row, globalStyles.alignItemsCenter]}>
                  <Icon
                    name="star"
                    color="#91928B"
                    style={[globalStyles.mr10, { paddingBottom: 4 }]}
                    size={15}
                  />
                  {(this.state.selected.findIndex(s => s.id === r.item.entity[0].id && s.selected) > -1 && this.props.expandable ? (
                    <View style={[globalStyles.mr10, globalStyles.row, globalStyles.alignItemsCenter, { paddingBottom: 2 }]}>
                      <TextInput
                        placeholder='...'
                        keyboardType='numeric'
                        maxLength={3}
                        textAlign='center'
                        editable={(this.state.total < 100 || this.state.selected.find(s => s.id === r.item.entity[0].id && s.selected).percent ? true : false)}
                        value={(this.state.selected.find(s => s.id === r.item.entity[0].id && s.selected).percent ? this.state.selected.find(s => s.id === r.item.entity[0].id && s.selected).percent.toString() : null)}
                        onChangeText={(text) => {
                          let percent = parseInt(text, 10)
                          if (!Number.isInteger(percent)) percent = 0

                          let total = 0
                          this.state.selected.filter(s => s.selected && s.id !== r.item.entity[0].id && s.percent).map(s => total += s.percent)

                          if (total + percent > 100) percent = 100 - total

                          let index = this.state.selected.findIndex(s => s.id === r.item.entity[0].id && s.selected),
                            array = [...this.state.selected],
                            line = { ...array[index], percent: percent }
                          array[index] = line

                          this.setState({ selected: array, total: total + percent })
                          this._submit(array)
                        }}
                        style={[{ color: colors.blue }, globalStyles.alignItemsCenter]}
                      />
                      <Text style={[{ color: colors.darkblue, paddingBottom: 2, fontSize: 16 }]}>%</Text>
                    </View>
                  ) : null)}
                  <TouchableOpacity
                    style={[globalStyles.flex1, globalStyles.row, globalStyles.justifyContentSpaceBetween, globalStyles.alignItemsCenter, globalStyles.pt10, globalStyles.pb10]}
                    onPress={() => this._onPress(r.item.entity[0])}
                  >
                    <View style={[globalStyles.row, globalStyles.justifyContentSpaceBetween, globalStyles.alignItemsCenter]}>
                      <Text style={[globalStyles.h2, { textDecorationLine: (this.state.selected.findIndex(s => s.id === r.item.entity[0].id && s.selected) > -1 ? 'underline' : 'none') }]}>{r.item.name}</Text>
                    </View>
                    <Checkbox
                      status={(this.state.selected.findIndex(s => s.id === r.item.entity[0].id && s.selected) > -1 ? 'checked' : 'unchecked')}
                      onPress={() => this._onPress(r.item.entity[0])}
                    />
                  </TouchableOpacity>
                </View>
              )))}
            </View>
            <SectionList
              sections={this.props.data}
              SectionSeparatorComponent={() => (
                <View style={{ height: 10 }} />
              )}
              keyExtractor={(item, index) => item.id}
              keyboardShouldPersistTaps={'handled'}
              renderItem={({ item, index }) => (
                <View style={[globalStyles.row, globalStyles.justifyContent, globalStyles.alignItemsCenter, globalStyles.ml15]}>
                  {(this.state.selected.findIndex(s => s.id === item.id && s.selected) > -1 && this.props.expandable ? (
                    <View style={[globalStyles.mr10, globalStyles.row, globalStyles.alignItemsCenter, { paddingBottom: 2 }]}>
                      <TextInput
                        placeholder='...'
                        keyboardType='numeric'
                        maxLength={3}
                        textAlign='center'
                        editable={(this.state.total < 100 || this.state.selected.find(s => s.id === item.id && s.selected).percent ? true : false)}
                        value={(this.state.selected.find(s => s.id === item.id && s.selected).percent ? this.state.selected.find(s => s.id === item.id && s.selected).percent.toString() : null)}
                        onChangeText={(text) => {
                          let percent = parseInt(text, 10)
                          if (!Number.isInteger(percent)) percent = 0

                          let total = 0
                          this.state.selected.filter(s => s.selected && s.id !== item.id && s.percent).map(s => total += s.percent)

                          if (total + percent > 100) percent = 100 - total

                          let index = this.state.selected.findIndex(s => s.id === item.id && s.selected),
                            array = [...this.state.selected],
                            line = { ...array[index], percent: percent }
                          array[index] = line

                          this.setState({ selected: array, total: total + percent })
                          this._submit(array)
                        }}
                        style={[{ color: colors.blue }, globalStyles.alignItemsCenter]}
                      />
                      <Text style={[{ color: colors.darkblue, paddingBottom: 2, fontSize: 16 }]}>%</Text>
                    </View>
                  ) : null)}
                  <TouchableOpacity
                    style={[globalStyles.flex1, globalStyles.row, globalStyles.justifyContentSpaceBetween, globalStyles.alignItemsCenter, globalStyles.pt10, globalStyles.pb10]}
                    onPress={() => this._onPress(item)}
                  >
                    <Text style={[globalStyles.h2, { textDecorationLine: (this.state.selected.findIndex(s => s.id === item.id && s.selected) > -1 ? 'underline' : 'none') }]}>{item.name}</Text>
                    <Checkbox
                      status={(this.state.selected.findIndex(s => s.id === item.id && s.selected) > -1 ? 'checked' : 'unchecked')}
                      onPress={() => this._onPress(item)}
                    />
                  </TouchableOpacity>
                </View>
              )}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={[globalStyles.h1, globalStyles.ml5]}>{title}</Text>
              )}
            />

            <TouchableOpacity style={[globalStyles.p10, { paddingTop: 0 }, globalStyles.row, globalStyles.justifyContentCenter]} onPress={() => this.setState({ isModalVisible: !this.state.isModalVisible })}>
              <Icon name="angle-down" color={'#686963'} size={20} />
              <Text style={[{ color: '#686963' }, globalStyles.ml5, globalStyles.bold]}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <TouchableOpacity onPress={() => this.setState({ isModalVisible: !this.state.isModalVisible })}>
          {this._drawCurrent()}
        </TouchableOpacity>
      </View>
    );
  }
}

export default List
