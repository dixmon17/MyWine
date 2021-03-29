// Navigation/Navigations.js

import React from 'react'
import { Animated, TouchableOpacity, Text, View, Image } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Search from '../Components/Search/Search'
import AppellationDetail from '../Components/WineViewer/AppellationDetail'
import WineDetail from '../Components/WineViewer/WineDetail'
import StockCellar from '../Components/Form/Stock/StockCellar'
import StockBlock from '../Components/Form/Stock/StockBlock'
import EditCellar from '../Components/Cellar/EditCellar'
import EditBlock from '../Components/Cellar/EditBlock'
import Cellar from '../Components/Cellar/Cellar'
import Block from '../Components/Cellar/Block'
import SortList from '../Components/WineViewer/SortListContainer'
import Add from '../Components/Form/New/Add'
import ManualAdd from '../Components/Form/New/ManualAdd'
import AutoAdd from '../Components/Form/New/AutoAdd'
import EditAppellation from '../Components/Form/Edit/EditAppellation'
import EditDomain from '../Components/Form/Edit/EditDomain'
import EditRegion from '../Components/Form/Edit/EditRegion'
import EditCountry from '../Components/Form/Edit/EditCountry'
import EditWine from '../Components/Form/Edit/EditWine'
import FirstStart from '../Components/User/FirstStart'
import Signup from '../Components/User/Signup'
import Setting from '../Components/Profile/Setting'
import Signin from '../Components/Profile/Signin'
import MyAppellation from '../Components/Profile/MyAppellation'
import MyDomain from '../Components/Profile/MyDomain'
import MyRegion from '../Components/Profile/MyRegion'
import MyCountry from '../Components/Profile/MyCountry'
import ResetPassword from '../Components/User/ResetPassword'
import Icon from 'react-native-vector-icons/FontAwesome5'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import Fallback from './Fallback'
import { mytheme } from './mytheme'
import { connect } from 'react-redux'
import SplashScreen from 'react-native-splash-screen'
import LogoBW from '../img/xml/logo_bw'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true
}

import { Appbar } from 'react-native-paper';

const Header = ({ scene, previous, navigation }) => {
  const { options } = scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;

  return (
    <View style={{backgroundColor: '#fafafa'}}>
    <View style={{borderBottomLeftRadius: 20, borderBottomRightRadius: 20, overflow: 'hidden'}}>
       <Appbar.Header style={[(options.headerStyle?options.headerStyle:{marginTop: 2,marginBottom:2}),{backgroundColor:'#DB5460'}]}>
        {previous?(
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color="white"
        />):null}
        <View>{options.headerLeft}</View>
        <Appbar.Content
          title={title}
          titleStyle={{
            fontFamily: 'OpenSans-Light',
            fontWeight: 'normal',
            fontSize: 15,
          }}
        />
        {options.headerRight}
      </Appbar.Header>
    </View>
    </View>
  );
};

const timing = {
  animation: 'timing',
  config: {
    duration: 200
  },
};

const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const animation = {
  transitionSpec: {
    open: timing,
    close: timing,
  },
  cardStyleInterpolator: forFade,
}

const SearchStack = createStackNavigator();

function SearchStackNavigator() {
  return (
    <SearchStack.Navigator
      headerMode="float"
      screenOptions={{
        ...animation,
        header: ({ scene, previous, navigation }) => (
          <Header scene={scene} previous={previous} navigation={navigation} />
        )
      }}
    >
      <SearchStack.Screen
        name="Search"
        component={Search}
        options={({navigation}) => ({
          title: null,
          headerLeft: (
            <View style={{width: 120, height: 31, marginLeft: 20, top:1}}>
              <LogoBW/>
            </View>
          )
        })}
      />
    </SearchStack.Navigator>
  )
}

const CellarStack = createStackNavigator();

function CellarStackNavigator() {
  return (
    <CellarStack.Navigator
      headerMode="float"
      screenOptions={{
        ...animation,
        header: ({ scene, previous, navigation }) => (
          <Header scene={scene} previous={previous} navigation={navigation} />
        )
      }}
    >
      <CellarStack.Screen
        name="Cellar"
        component={Cellar}
        initialParams={{ search:undefined }}
        options={({navigation}) => ({
          title: 'Mes caves',
          headerRight: (
            <TouchableOpacity style={{marginRight: 16, flexDirection: 'row', height: 70, alignItems: 'center'}} onPress={() => {
              ReactNativeHapticFeedback.trigger("selection", options);
              navigation.navigate('EditCellar')
            }}>
              <Text style={{color: "white", marginRight: 8,fontFamily: 'OpenSans-Bold', fontSize: 14}}>Modifier</Text>
              <Icon
                style={{top:1}}
                size={18}
                name="hammer"
                color="white"
              />
            </TouchableOpacity>
          ),
        })}
      />
      <CellarStack.Screen
        name="Block"
        component={Block}
        options={({navigation, route}) => ({
          title: 'Ma cave',
          headerRight: (
            <TouchableOpacity style={{marginRight: 16, flexDirection: 'row', height: 70, alignItems: 'center'}} onPress={() => {
              ReactNativeHapticFeedback.trigger("selection", options);
              navigation.navigate('EditBlock', {blockId:route.params.blockId})
            }}>
              <Text style={{color: "white", marginRight: 8,fontFamily: 'OpenSans-Bold', fontSize: 14}}>Modifier</Text>
              <Icon
                style={{top:1}}
                size={18}
                name="hammer"
                color="white"
              />
            </TouchableOpacity>
          ),
        })}
      />
      <CellarStack.Screen
        name="StockCellar"
        component={StockCellar}
        options={{
          title: 'Placer mon vin'
        }}
      />
      <CellarStack.Screen
        name="StockBlock"
        component={StockBlock}
        options={{
          title: 'Placer mon vin'
        }}
      />
      <CellarStack.Screen
        name="EditCellar"
        component={EditCellar}
        options={{
          title: 'Modifier la cave'
        }}
      />
      <CellarStack.Screen
        name="EditBlock"
        component={EditBlock}
        options={{
          title: 'Modifier un casier'
        }}
      />
    </CellarStack.Navigator>
  )
}

const FormStack = createStackNavigator();

function FormStackNavigator() {
  return (
    <FormStack.Navigator
      headerMode="float"
      screenOptions={{
        ...animation,
        header: ({ scene, previous, navigation }) => (
          <Header scene={scene} previous={previous} navigation={navigation} />
        )
      }}
    >
      <FormStack.Screen
        name="Add"
        component={Add}
        options={{
          headerShown: false,
          title: 'Ajouter un vin'
        }}
      />
      <FormStack.Screen
        name="ManualAdd"
        component={ManualAdd}
        options={{
          title: 'Ajouter un vin'
        }}
      />
      <FormStack.Screen
        name="AutoAdd"
        component={AutoAdd}
        options={{
          title: 'Ajouter un vin'
        }}
      />
    </FormStack.Navigator>
  )
}

const ProfileStack = createStackNavigator();

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator
      headerMode="float"
      screenOptions={{
        ...animation,
        header: ({ scene, previous, navigation }) => (
          <Header scene={scene} previous={previous} navigation={navigation} />
        )
      }}
    >
      <ProfileStack.Screen
        name="Setting"
        component={Setting}
        options={{
          title: 'Mon profil'
        }}
      />
      <ProfileStack.Screen
        name="Signin"
        component={Signin}
        options={{
          title: 'Connexion'
        }}
      />
      <ProfileStack.Screen
        name="MyAppellation"
        component={MyAppellation}
        options={{
          title: 'Mes appellations'
        }}
      />
      <ProfileStack.Screen
        name="MyDomain"
        component={MyDomain}
        options={{
          title: 'Mes domaines'
        }}
      />
      <ProfileStack.Screen
        name="MyRegion"
        component={MyRegion}
        options={{
          title: 'Mes régions'
        }}
      />
      <ProfileStack.Screen
        name="MyCountry"
        component={MyCountry}
        options={{
          title: 'Mes pays'
        }}
      />
    </ProfileStack.Navigator>
  )
}

const Tab = createMaterialBottomTabNavigator();

/*sceneAnimationEnabled={false}*/

function TabBarNavigator() {
  return(
    <Tab.Navigator
      labeled={false}
      activeColor="#E3F2FD"
      inactiveColor="#8AA29E"
      barStyle={{
        zIndex: 10,
        position: 'absolute',
        backgroundColor: '#053C5C',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
      }}
    >
      <Tab.Screen
        name="SearchTab"
        component={SearchStackNavigator}
        options={{
          onPress: ({}) => {},
          tabBarLabel: 'Chercher',
          tabBarIcon: ({ color }) => (
            <Icon name="search" color={color} size={22} />
          )
        }}
      />
      <Tab.Screen
        name="CellarTab"
        component={CellarStackNavigator}
        options={{
          tabBarLabel: 'Ma cave',
          tabBarIcon: ({ color }) => (
            <Icon name="wine-glass-alt" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="FormTab"
        component={FormStackNavigator}
        options={{
          tabBarLabel: 'Ajouter',
          tabBarIcon: ({ color }) => (
            <Icon name="plus" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Mon profil',
          tabBarIcon: ({ color }) => (
            <Icon name="user-alt" color={color} size={22} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}


// const linking = {
//   prefixes: ['mywine://'],
//   config: {
//     Tab: {
//       screens: {
//         SearchTab: {
//           path: 'registration.confirmed',
//           exact: true,
//           screens: {
//             Backup: 'resetting.success',
//             exact: true
//           }
//         }
//       }
//     }
//   }
// };
// <NavigationContainer linking={linking} fallback={<Fallback/>} theme={mytheme}>

const Stack = createStackNavigator();

const App = ({oauth}) => {
  SplashScreen.hide();
  return (
    <NavigationContainer fallback={<Fallback/>} theme={mytheme}>
      <Stack.Navigator
        headerMode="float"
        screenOptions={{
          ...animation,
          header: ({ scene, previous, navigation }) => (
            <Header scene={scene} previous={previous} navigation={navigation} />
          )
        }}
      >
        {(oauth.email || oauth.offline) ? (
          <Stack.Screen
            name="Tab"
            component={TabBarNavigator}
            options={{
              headerShown: false
            }}
          />
        ) : (
          <Stack.Screen
            name="FirstStart"
            component={FirstStart}
            options={{
              title:'',
              headerStyle: {
                height:20
              },
            }}
          />
        )}
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            title: 'S\'inscrire'
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{
            title: 'J\'ai oublié mon mot de passe'
          }}
        />
        <Stack.Screen
          name="EditAppellation"
          component={EditAppellation}
          options={{
            title: 'Modifier une appellation',
          }}
        />
        <Stack.Screen
          name="EditDomain"
          component={EditDomain}
          options={{
            title: 'Modifier un domaine',
          }}
        />
        <Stack.Screen
          name="EditRegion"
          component={EditRegion}
          options={{
            title: 'Modifier une région',
          }}
        />
        <Stack.Screen
          name="EditCountry"
          component={EditCountry}
          options={{
            title: 'Modifier un pays',
          }}
        />
        <Stack.Screen
          name="EditWine"
          component={EditWine}
          options={{
            title: 'Modifier un vin',
          }}
        />
        <Stack.Screen
          name="WineDetail"
          component={WineDetail}
          options={({navigation, route}) => ({
            title: 'Détails du vin',
            headerRight: (
              <TouchableOpacity style={{marginRight: 16, flexDirection: 'row', height: 70, alignItems: 'center'}} onPress={() => {
                ReactNativeHapticFeedback.trigger("selection", options);
                navigation.navigate('EditWine', {wineId:route.params.wineId})
              }}>
                <Text style={{color: "white", marginRight: 8,fontFamily: 'OpenSans-Bold', fontSize: 14}}>Modifier</Text>
                <Icon
                  style={{top:1}}
                  size={18}
                  name="edit"
                  color="white"
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="AppellationDetail"
          component={AppellationDetail}
          options={({navigation, route}) => ({
            title: 'Détails de l\'appellation',
          })}
        />
        <Stack.Screen
          name="SortList"
          component={SortList}
          options={({ navigation, route }) => ({
            title: 'Mes vins',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const mapStateToProps = state => {
  return {
    oauth: state.oauth,
 };
};

export default connect(mapStateToProps)(App);
