import React from 'react'
import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

//On dessine un cercle
function circle(size) {
  return {
    width: size,
    height: size,
    margin: 1,
    borderRadius: 100/2,
    borderWidth: 2,
    borderColor: '#686963',
    justifyContent: 'center',
    alignItems: 'center',
  }
}

function renderCircle(iconName, iconSize, size, circleBg) {
  if (iconName) {
    return (
      <View style={[circle(size),circleBg]}>
      <View style={styles.circle_container}>
        <Icon
          name={iconName}
          size={iconSize}
          color="white"
        />
      </View>
      </View>
    )
  }
  return (
    <View style={[circle(size),circleBg]} />
  )
}

function checkIfSearched(currentSearch, wine, searched, color) {
  if (currentSearch) {
    let circleBg, iconName

    if (wine) {
      //Lors d'une recherche, tous les cercles sont mis avec un style "dark", les cercles recherchés sont mis au style classique
      if (searched) {
        circleBg = styles['circle__'+color]
        iconName = 'circle'
      } else {
        circleBg = styles['circle__'+color+'__dark']
      }
    } else {
      //Sinon, cellule noir
      circleBg = styles.circle__empty__dark
    }

    return {circleBg:circleBg,iconName:iconName}
  }
  return {circleBg:styles['circle__'+color],iconName:null}
}

export function createEmptySpace(size) {
  return renderCircle('', 0, size, 'empty')
}

export function prepareStyleCircleForCellar(currentSearch, currentWine, activeStock, size, wine, c, l, searched) {
  //Si une recherche est en cours (se superpose aux paramètres suivants)
  let ifSearched = checkIfSearched(currentSearch, wine, searched, (wine?wine.color:'empty')),
  circleBg = ifSearched.circleBg, iconName = ifSearched.iconName, iconSize = size/2

  return renderCircle(iconName, iconSize, size, circleBg)
}

export function prepareStyleCircleForOptions(currentSearch, currentWine, activeStock, size, wine, c, l, searched) {
  //Si une recherche est en cours (se superpose aux paramètres suivants)
  let ifSearched = checkIfSearched(currentSearch, wine, searched, (wine?wine.color:'empty')),
  circleBg = ifSearched.circleBg, iconName = ifSearched.iconName, iconSize = size/2
  
  //Si il s'agit de la cellule juste sélectionnée
  if (!Array.isArray(currentWine) && wine && currentWine.x===c && currentWine.y===l) {
    //STYLE -- Vin courant
    circleBg = styles.circle__currentWine
    iconName = 'check'
    iconSize = 20
  } else if (Array.isArray(currentWine) && wine && currentWine.find(cW => cW.x === c && cW.y === l)) {
    //STYLE -- Vins courants
    circleBg = styles.circle__currentWine
    iconName = 'check-double'
    iconSize = 20
  }

  return renderCircle(iconName, iconSize, size, circleBg)
}

export function prepareStyleCircleForStock(currentSearch, currentWine, activeStock, size, wine, c, l, searched) {
  //Si une recherche est en cours (se superpose aux paramètres suivants)
  let ifSearched = checkIfSearched(currentSearch, wine, searched, (wine?wine.color:'empty')),
  circleBg = ifSearched.circleBg, iconName = ifSearched.iconName, iconSize = size/2

  //Si une cellule vierge est sélectionnée pour placer un vin
  if (!wine && activeStock.findIndex(s => s.x === c && s.y === l) !== -1) {
    //STYLE -- Cercle du vin stocké
    circleBg = styles.circle__stock
    iconName = 'check'
    iconSize = 10
  }

  return renderCircle(iconName, iconSize, size, circleBg)
}

const styles = StyleSheet.create({
    circle__r: {
      backgroundColor: '#DB3D4D'
    },
    circle__r__dark: {
      backgroundColor: '#701F27'
    },
    circle__w: {
      backgroundColor: '#F8D872'
    },
    circle__w__dark: {
      backgroundColor: '#827F3C'
    },
    circle__p: {
      backgroundColor: '#FFD4C4'
    },
    circle__p__dark: {
      backgroundColor: '#BF9F9F'
    },
    circle__empty: {
      backgroundColor: 'white'
    },
    circle__empty__dark: {
      backgroundColor: '#A8A8A8'
    },
    circle__currentWine: {
      backgroundColor: '#2F6F8F'
    },
    circle__stock: {
      backgroundColor: '#2F6F8F',
    },
      circle_container: {
        color: 'white',
        fontFamily: 'OpenSans-Bold'
      },
})

//
// export function prepareStyleCircle(wine, c, l, searched) {
//   let iconSize, iconName, color = (wine?wine.color:'empty'), circleBg = styles['circle__'+color]
//
//   //Si une recherche est en cours (se superpose aux paramètres suivants)
//   if (this.props.search) {
//     if (wine) {
//       //Lors d'une recherche, tous les cercles sont mis avec un style "dark", les cercles recherchés sont mis au style classique
//       if (searched) {
//         circleBg = styles['circle__'+color]
//         iconName = 'circle'
//       } else {
//         circleBg = styles['circle__'+color+'__dark']
//       }
//     } else {
//       //Sinon, cellule noir
//       circleBg = styles.circle__empty__dark
//     }
//   }
//
//   //Si la cellule est touchable
//   switch (this.props.touchable) {
//     case 'stock':
//       //Si une cellule vierge est sélectionnée pour placer un vin
//       if (!wine && this.props.activeStock.findIndex(s => s.x === c && s.y === l) !== -1) {
//         //STYLE -- Cercle du vin stocké
//         circleBg = styles.circle__stock
//         iconName = 'check'
//         iconSize = 10
//       }
//       break;
//     case 'options':
//       //Si il s'agit de la cellule juste sélectionnée
//       if (wine && this.props.currentWine.x===c && this.props.currentWine.y===l) {
//         //STYLE -- Vin courrant
//         circleBg = styles.circle__currentWine
//         iconName = 'check'
//         iconSize = 20
//       }
//       break;
//     default:
//       //Vin non touchable (icône de recherche dans la cellule)
//       iconSize = 5
//   }
//
//   if (iconName) {
//     return (
//       <View style={[this.circle(this.props.size),circleBg]}>
//       <View style={styles.circle_container}>
//         <Icon
//           name={iconName}
//           size={iconSize}
//           color="white"
//         />
//       </View>
//       </View>
//     )
//   }
//   return (
//     <View style={[this.circle(this.props.size),circleBg]} />
//   )
// }
