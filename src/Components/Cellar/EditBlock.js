import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import ScrollableTable from '../Global/ScrollableTable'
import DrawBlock from '../Global/DrawBlock'
import { connect } from 'react-redux'
import { getBlock, getPositionsByBlock } from '../../orm/selectors'
import CustomButton from '../Global/CustomButton'
import { RNNumberSelector } from 'react-native-number-selector';
const numberSelector=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
import { prepareStyleCircleForCellar } from '../Global/prepareStyleCircle'
import Icon from 'react-native-vector-icons/MaterialIcons'
import globalStyles from '../Global/globalStyles'
import colors from '../Global/colors'

class EditBlock extends React.Component {

  constructor(props) {
    super(props)

    this.state={
      block:this.props.block,
      isAlternativ:(this.props.block.isAlternativ?this.props.block.isAlternativ:0),
      horizontalAlignment:(this.props.block.horizontalAlignment?this.props.block.horizontalAlignment:'center'),
      verticalAlignment:(this.props.block.verticalAlignment?this.props.block.verticalAlignment:'center')
    }
  }

  _changeAlternativ(alternativMode) {
    this.setState({
      block: {...this.state.block, isAlternativ:alternativMode},
      isAlternativ: alternativMode,
    }, () => this.props.updateBlock(this.state.block))
  }

  _changeAlignHorizontal(alignement) {
    this.setState({
      block: {...this.state.block, horizontalAlignment:alignement},
      horizontalAlignment: alignement
    }, () => this.props.updateBlock(this.state.block))
  }

  _changeAlignVertical(alignement) {
    this.setState({
      block: {...this.state.block, verticalAlignment:alignement},
      verticalAlignment: alignement
    }, () => this.props.updateBlock(this.state.block))
  }

  _changeColumn(int) {
    if (!parseInt(int,10)) return
    this.setState({
      block: {...this.state.block, nbColumn:Math.round(int)},
    })
  }

  _changeLine(int) {
    if (!parseInt(int,10)) return
    this.setState({
      block: {...this.state.block, nbLine:Math.round(int)},
    })
  }

  _updateBlock = () => {
    let positions = this.props.positions.filter(p => p.x > this.state.block.nbColumn || p.y > this.state.block.nbLine)
    this.props.removePositionByArray(positions)
    this.props.updateBlock({
      editedAt: Date.now(),
      enabled:true,
      ...this.state.block,
    })
    this.props.navigation.goBack()
  }

  _removeBlock = () => {
    this.props.removePositionByArray(this.props.positions)
    this.props.removeBlock(this.props.block.id)
    this.props.navigation.goBack()
  }

  render() {
    return (
      <ScrollView vertical={true}>
        <View style={ globalStyles.main_container }>
          <ScrollableTable style={globalStyles.mt20}>
            <DrawBlock
              block={ this.state.block }
              size={20}
              prepareStyleCircle={prepareStyleCircleForCellar}
              navigation={ this.props.navigation }
              touchable={false}
            />
          </ScrollableTable>
          <View>
            <Text style={[globalStyles.h1,globalStyles.mt20,globalStyles.mb20]}>Alignement dans la cave</Text>
            <View style={[globalStyles.row,globalStyles.justifyContentSpaceAround]}>
              <View style={globalStyles.row}>
                <TouchableOpacity onPress={() => this._changeAlignHorizontal('flex-start')} style={[styles.alignment_option, {borderColor: (this.state.horizontalAlignment==='flex-start'?colors.red:'grey')}]}>
                  <Icon
                      name="format-align-left"
                      size={20}
                      color={(this.state.horizontalAlignment==='flex-start'?colors.red:'grey')}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._changeAlignHorizontal('center')} style={[styles.alignment_option, {borderColor: (this.state.horizontalAlignment==='center'?colors.red:'grey')}]}>
                  <Icon
                    name="format-align-center"
                    size={20}
                    color={(this.state.horizontalAlignment==='center'?colors.red:'grey')}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._changeAlignHorizontal('flex-end')} style={[styles.alignment_option, {borderColor: (this.state.horizontalAlignment==='flex-end'?colors.red:'grey')}]}>
                  <Icon
                    name="format-align-right"
                    size={20}
                    color={(this.state.horizontalAlignment==='flex-end'?colors.red:'grey')}
                  />
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => this._changeAlignVertical('flex-start')} style={[styles.alignment_option, {borderColor: (this.state.verticalAlignment==='flex-start'?colors.red:'grey')}]}>
                  <Icon
                      name="vertical-align-top"
                      size={20}
                      color={(this.state.verticalAlignment==='flex-start'?colors.red:'grey')}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._changeAlignVertical('center')} style={[styles.alignment_option, {borderColor: (this.state.verticalAlignment==='center'?colors.red:'grey')}]}>
                  <Icon
                    name="vertical-align-center"
                    size={20}
                    color={(this.state.verticalAlignment==='center'?colors.red:'grey')}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._changeAlignVertical('flex-end')} style={[styles.alignment_option, {borderColor: (this.state.verticalAlignment==='flex-end'?colors.red:'grey')}]}>
                  <Icon
                    name="vertical-align-bottom"
                    size={20}
                    color={(this.state.verticalAlignment==='flex-end'?colors.red:'grey')}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[globalStyles.h1,globalStyles.mt20,globalStyles.mb20]}>Nombre de colonnes</Text>
            <RNNumberSelector style={styles.number_selector} items={numberSelector} selectedItem={parseInt((this.props.block?this.props.block.nbColumn:1))} spacing={50} highlightedFontSize={25} fontSize={20} textColor={'#345345'} highlightedTextColor={colors.red} viewAnimation={0}  onChange={(number) => {
                this._changeColumn(number)
            }}/>

            <Text style={[globalStyles.h1,globalStyles.mt20,globalStyles.mb20]}>Nombre de lignes</Text>
            <RNNumberSelector style={styles.number_selector} items={numberSelector} selectedItem={parseInt((this.props.block?this.props.block.nbLine:1))} spacing={50} highlightedFontSize={25} fontSize={20} textColor={'#345345'} highlightedTextColor={colors.red} viewAnimation={0}  onChange={(number) => {
                this._changeLine(number)
            }}/>

            <Text style={[globalStyles.h1,globalStyles.mt20,globalStyles.mb20]}>Disposition du casier</Text>
            <View style={[globalStyles.row,globalStyles.justifyContentCenter]}>
              <TouchableOpacity onPress={() => this._changeAlternativ(0)} style={[styles.alignment_option, {borderColor: (this.state.isAlternativ===0?colors.red:'grey')}]}>
              <Icon
              name="border-all"
              size={20}
              color={(this.state.isAlternativ===0?colors.red:'grey')}
              />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this._changeAlternativ(1)} style={[styles.alignment_option, {borderColor: (this.state.isAlternativ===1?colors.red:'grey')}]}>
              <Icon
              name="border-left"
              size={20}
              color={(this.state.isAlternativ===1?colors.red:'grey')}
              />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this._changeAlternativ(2)} style={[styles.alignment_option, {borderColor: (this.state.isAlternativ===2?colors.red:'grey')}]}>
              <Icon
              name="border-right"
              size={20}
              color={(this.state.isAlternativ===2?colors.red:'grey')}
              />
              </TouchableOpacity>
            </View>

            <CustomButton
              style={[globalStyles.mt20,globalStyles.mb10]}
              action={this._updateBlock}
              text="Valider les changements"
              colorBg='#2F6F8F'
              icon="check"
            />
            <CustomButton
              style={globalStyles.mb20}
              action={this._removeBlock}
              text="Supprimer ce casier"
              icon="trash"
              colorBg="#A3301C"
            />
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  alignment_option: {
    padding: 2,
    borderWidth: 1,
    borderRadius: 2,
    marginRight: 5,
  },
  number_selector: {
    left: 0,
    width: '100%',
    height: 50
  }
})

const mapStateToProps = (state, props) => {
  return {
    block: getBlock(state, props.route.params.blockId),
    positions: getPositionsByBlock(state, props.route.params.blockId),
  };
}

const mapDispatchToProps = dispatch => {
	return {
    updateBlock: data => dispatch({type:'UPDATE_BLOCK', payload:data}),
    removePositionByArray: data => dispatch({type:'DELETE_POSITION_BY_ARRAY', payload:data}),
    removeBlock: data => dispatch({type:'DELETE_BLOCK', payload:data}),
	}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditBlock)
