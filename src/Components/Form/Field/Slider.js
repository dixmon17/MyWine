import React from "react";
import { View, Text, Platform, UIManager, LayoutAnimation } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Button } from "react-native-paper";

class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      valuemin: parseInt(this.props.valuemin, 10),
      valuemax: parseInt(this.props.valuemax, 10),
      max: parseInt(this.props.max, 10),
      allowValueMin: this.props.allowValueMin,
      allowValueMax: this.props.allowValueMax,
      appellation: this.props.appellation,
    };

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidUpdate() {
    if (this.props.appellation === this.state.appellation) return;
    this.setState(
      {
        appellation: this.props.appellation,
        valuemin: parseInt(this.props.valuemin, 10),
        valuemax: parseInt(this.props.valuemax, 10),
        max: parseInt(this.props.max, 10),
        allowValueMin: this.props.allowValueMin,
        allowValueMax: this.props.allowValueMax,
      },
      () => this._submit()
    );
  }

  _getValues() {
    if (this.state.allowValueMin && !this.state.allowValueMax)
      return [this.state.valuemin];
    if (this.state.allowValueMax && !this.state.allowValueMin)
      return [this.state.valuemax];
    if (this.state.allowValueMin && this.state.allowValueMax)
      return [this.state.valuemin, this.state.valuemax];
    return [this.state.valuemin, this.state.valuemax];
  }

  _onChange(values) {
    let valuemin = this.state.valuemin,
      valuemax = this.state.valuemax;
    if (this.state.allowValueMin && !this.state.allowValueMax) {
      valuemin = values[0];
    } else if (this.state.allowValueMax && !this.state.allowValueMin) {
      valuemax = values[0];
    } else if (this.state.allowValueMin && this.state.allowValueMax) {
      valuemin = values[0];
      valuemax = values[1];
    }
    this.setState({
      valuemin: valuemin > valuemax ? valuemax : valuemin,
      valuemax: valuemax < valuemin ? valuemin : valuemax,
    });
  }

  _submit() {
    this.props.change({
      valuemin: this.state.allowValueMin ? this.state.valuemin : null,
      valuemax: this.state.allowValueMax ? this.state.valuemax : null,
    });
  }

  render() {
    return (
      <View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Button
            style={{
              marginRight: 10,
              backgroundColor: this.state.allowValueMin ? "#DB5461" : "white",
            }}
            mode="outlined"
            color={this.state.allowValueMin ? "white" : "#DB5461"}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
              this.setState(
                { allowValueMin: this.state.allowValueMin ? false : true },
                () => this._submit()
              );
            }}
          >
            Minimum
          </Button>
          <Text>
            {this.state.allowValueMin
              ? this.state.valuemin + this.props.suffixe + "  "
              : undefined}{" "}
            {this.state.allowValueMin && this.state.valuemin === this.state.min
              ? "+"
              : undefined}
          </Text>
          <Button
            style={{
              marginRight: 10,
              backgroundColor: this.state.allowValueMax ? "#DB5461" : "white",
            }}
            mode="outlined"
            color={this.state.allowValueMax ? "white" : "#DB5461"}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
              this.setState(
                { allowValueMax: this.state.allowValueMax ? false : true },
                () => this._submit()
              );
            }}
          >
            Maximum
          </Button>
          <Text>
            {this.state.allowValueMax
              ? this.state.valuemax + this.props.suffixe + "  "
              : undefined}{" "}
            {this.state.allowValueMax && this.state.valuemax === this.state.max
              ? "+"
              : undefined}
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <MultiSlider
            values={this._getValues()}
            sliderLength={300}
            min={1}
            max={this.state.max}
            enabledOne={
              this.state.allowValueMin || this.state.allowValueMax
                ? true
                : false
            }
            enabledTwo={
              this.state.allowValueMin && this.state.allowValueMax
                ? true
                : false
            }
            markerStyle={{ height: 20, width: 20, backgroundColor: "#DB5461" }}
            pressedMarkerStyle={{
              height: 30,
              width: 30,
              borderRadius: 50,
              backgroundColor: "#DB5461",
            }}
            trackStyle={{ height: 3, top: -1 }}
            selectedStyle={
              (!this.state.allowValueMin && this.state.allowValueMax) ||
                (this.state.allowValueMin && this.state.allowValueMax)
                ? { backgroundColor: "#DB5461" }
                : {}
            }
            unselectedStyle={
              !this.state.allowValueMin ||
                (this.state.allowValueMin && this.state.allowValueMax)
                ? {}
                : { backgroundColor: "#DB5461" }
            }
            onValuesChange={(values) => this._onChange(values)}
            onValuesChangeFinish={(values) => {
              if (values[0] === this.state.max || values[1] === this.state.max)
                this.setState({ max: this.state.max + this.props.max });
              if (
                this.state.max > this.props.max &&
                (values[0] < this.state.max || values[1] < this.state.max)
              )
                this.setState({
                  max: (values[1] ? values[1] : values[0]) + 10,
                });

              this._submit();
            }}
            key={[this.state.allowValueMin, this.state.allowValueMax]}
          />
        </View>
      </View>
    );
  }
}

export default Slider;
