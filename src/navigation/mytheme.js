import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native'
import { TouchableRipple, DefaultTheme as PaperDefaultTheme, Provider as PaperProvider } from 'react-native-paper'

export const mytheme = {
  ...NavigationDefaultTheme,
  ...PaperDefaultTheme,
  background: 'white',
  roundness: 2,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...PaperDefaultTheme.colors,
    background: '#fafafa',
    primary: '#053C5C',
    accent: '#DB5461',
  },
};
