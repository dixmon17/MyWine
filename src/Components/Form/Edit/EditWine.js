import React from 'react'
import DispatchContainer from '../DispatchContainer'
import { connect } from 'react-redux'
import { getWine, getPositionsByWine, getVarietiesOfWine } from '../../../orm/selectors'

class EditWine extends React.Component {

	constructor(props) {
		super(props)

    this.wine = {
      id:this.props.wine.id,
      country:this.props.wine.country.id,
      region:this.props.wine.region.id,
      appellation:this.props.wine.appellation.id,
      domain:this.props.wine.domain.id,
      millesime:this.props.wine.millesime,
      size:this.props.wine.size,
      quantity:this.props.wine.quantity,
      sparklink:this.props.wine.sparklink,
      bio:this.props.wine.bio,
      enabled:this.props.wine.enabled,
      varieties:this.props.varieties,
      tempmin:(this.props.wine.tempmin?this.props.wine.tempmin.toString():undefined),
      tempmax:(this.props.wine.tempmax?this.props.wine.tempmax.toString():undefined),
      yearmin:(this.props.wine.yearmin?this.props.wine.yearmin.toString():undefined),
      yearmax:(this.props.wine.yearmax?this.props.wine.yearmax.toString():undefined)
    }
	}

  render() {
    return (
      <DispatchContainer
        appellation={false}
        region={false}
        country={false}
        appellationMore={false}
        domain={false}
        wine={true}
				dataAppellation={this.props.wine.appellation}
		    dataDomain={this.props.wine.domain}
		    dataRegion={this.props.wine.region}
		    dataCountry={this.props.wine.country}
		    dataWine={this.wine}
        navigation={this.props.navigation}
        initial='wine'
				positions={this.props.positions}
      />
    )
  }

}

const mapStateToProps = (state, props) => {
  return {
    wine: getWine(state, props.route.params.wineId),
    varieties: getVarietiesOfWine(state, props.route.params.wineId),
    positions: getPositionsByWine(state, props.route.params.wineId),
	}
}

export default connect(
	mapStateToProps,
	null
)(EditWine);
