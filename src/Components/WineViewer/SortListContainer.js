import React from 'react';
import { Text, TouchableOpacity } from 'react-native'
import SortList from './SortList'
import Icon from 'react-native-vector-icons/FontAwesome5'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true
}

export default function SortListContainer({ navigation, route }) {
  const [option, setOption] = React.useState(0);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: (
        <TouchableOpacity style={{marginRight: 16, flexDirection: 'row'}} onPress={() => {
          ReactNativeHapticFeedback.trigger("selection", options);
          setOption(o => !o)
        }}>
        <Text style={{color: "white", marginRight: 8,fontFamily: 'OpenSans-Bold', fontSize: 14}}>Trier / Filtrer</Text>
          <Icon
            style={{top:1}}
            size={18}
            name="filter"
            color="white"
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SortList
      option={option}
      cat={(route.params?route.params.cat:null)}
      catId={(route.params?route.params.catId:null)}
      setOption={setOption}
      navigation={navigation}
    />
  );
}
