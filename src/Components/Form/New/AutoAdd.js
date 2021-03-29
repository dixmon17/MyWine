import React from 'react'
import DispatchContainer from '../DispatchContainer'
import { connect } from 'react-redux'
import { getAppellations, getRegionByAppellation, getCountryByAppellation } from '../../../orm/selectors'

class AutoAdd extends React.Component {

  render() {
    return (
      <DispatchContainer
        wine={true}
        dataAppellation={this.props.appellation}
        dataDomain={this.props.route.params.domain}
        dataRegion={this.props.region}
        dataCountry={this.props.country}
        dataVarieties={this.props.route.params.varieties}
        dataWine={{millesime:this.props.route.params.millesime}}
        navigation={this.props.navigation}
        initial='wine'
      />
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    appellation: getAppellations(state, props.route.params.appellation),
    region: getRegionByAppellation(state, props.route.params.appellation),
    country: getCountryByAppellation(state, props.route.params.appellation),
  };
}

export default connect(mapStateToProps)(AutoAdd)
