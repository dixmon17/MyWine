// selectors.js
import { createSelector } from 'redux-orm'
import orm from './orm'
import { objectLength, pushObject, makeUniq, sort } from '../../src/method/object'

export const getAppellationsWithNumber = createSelector(
  orm.Appellation,
  (state) => state,
  (Appellation, state) => {
    let results = Appellation.filter(a => a.enabled)
    results.map(a => {
      a.number = getNumberWineOfAppellation(state, a.id)
    })
    return results
  }
)

export const getDomainsWithNumber = createSelector(
  orm.Domain,
  (state) => state,
  (Domain, state) => {
    let results = Domain.filter(d => d.enabled)
    results.map(d => {
      d.number = getNumberWineOfDomain(state, d.id)
    })
    return results
  }
)

export const getRegionsWithNumber = createSelector(
  orm.Region,
  (state) => state,
  (Region, state) => {
    let results = Region
    results = results.filter(r => countWineOfRegion(state, r.id) && r.enabled)
    results.map(r => {
      r.number = getNumberWineOfRegion(state, r.id)
    })
    return results
  }
)

export const countFreeWine = createSelector(
  orm.Wine.positions,
  orm.Wine,
  state => state,
  (positions, wineArg, state) => {
    //Si aucun paramètre ==> wineArg === tous les vins
    //Si un id est fourni ==> wineArg === vin sélectionné

    //Si le vin recherché n'est pas établi
    if (!wineArg || wineArg.enabled<1) return

    //Nombre de vins en vrac
    let freeWine=getFreeWine(state, (wineArg.id?wineArg.id:undefined)), count = 0

    if (objectLength(freeWine) === 0) return

    if (objectLength(freeWine) === 1) {
    //Recherche une seule bouteille
      count = freeWine[0].freeQuantity
    } else {
    //Recherche toutes les bouteilles
      freeWine.map(fw => count+=fw.freeQuantity)
    }

    //Retourne false si aucune bouteille en vrac
    return (count <= 0 ? false : count)
  }
)

export const getFreeWine = createSelector(
  orm,
  ( state, props) => state,
  ( state, props) => props,
  (orm, state, props) => {
    let results=[]

    if (props) {
    //Si un vin est recherché exclusivement

      let wine = getWine(state,props)

      if (!wine.enabled) return

      //On retourne le vin avec une property freeWine
      let positions = getPositionsByWine(state, wine.id).filter(p => p.enabled)

      let freeQuantity=parseInt(wine.quantity-objectLength(positions))

      if (freeQuantity > 0) results.push({...wine, freeQuantity:freeQuantity, appellation:getAppellationByWine(state,wine.id), domain:getDomainByWine(state,wine.id)})
    } else {
    //Si tous les vins en vrac sont recherchés

      getWines(state,props).filter(w => w.enabled).map( wine =>
        {
          //On retourne le vin avec une property freeWine
          let positions = getPositionsByWine(state, wine.id).filter(p => p.enabled)

          let freeQuantity=parseInt(wine.quantity-objectLength(positions))

          if (freeQuantity > 0) results.push({...wine, freeQuantity:freeQuantity, appellation:getAppellationByWine(state,wine.id), domain:getDomainByWine(state,wine.id)})
        }
      )
    }
    
    return results
  }
)

export const getWinesByDomain = createSelector(orm.Domain.wines)

export const getWinesByAppellation = createSelector(orm.Appellation.wines)

export const getSimplyWines = createSelector(orm.Wine)

export const getCellar = createSelector(orm.Cellar)

export const getBlocksByCellar = createSelector(orm.Cellar.blocks)

export const getBlock = createSelector(orm.Block)

export const getBlockByPosition = createSelector(orm.Position.block)

export const getPosition = createSelector(orm.Position)

export const getPositionsByBlock = createSelector(orm.Block.positions)

export const getPositionsByWine = createSelector(orm.Wine.positions)

export const getWineByPosition = createSelector(orm.Position.wine)

export const getAppellationByWine = createSelector(orm.Wine.appellation)

export const getDomainByWine = createSelector(orm.Wine.domain)

export const getRegionByAppellation = createSelector(orm.Appellation.region)

export const getCountry = createSelector(orm.Country)

export const getCountryByRegion = createSelector(orm.Region.country)

export const getCountryByAppellation = createSelector(orm.Appellation.region.country)

export const getRegions = createSelector(orm.Region)

export const getRegionsByCountry = createSelector(orm.Country.regions)

export const getDomains = createSelector(orm.Domain)

export const getVarieties = createSelector(orm.Variety)

export const getVarietyPercentages = createSelector(orm.VarietyPercentage)

export const getAppellations = createSelector(orm.Appellation)

export const getAppellationsWithDependencies = createSelector(
  orm.Appellation,
  orm.Appellation.region,
  (state,props)=>state,
  (Appellations, regions, state) => {
    let results = []

    Appellations.filter(a => a.enabled).map(a => {
      results.push({...a, varieties: getVarietiesOfAppellation(state,a.id), region: regions.find(r => r && r.id === a.region)})
    })

    return results
  }
)

export const getVarietiesOfAppellation = createSelector(orm.Appellation.varieties)

export const getAppellationWithDependencies = createSelector(
  orm.Appellation,
  orm.Appellation.varieties,
  orm.Appellation.region,
  orm.Appellation.region.country,
  ( state, props) => props,
  (Appellation, varieties, region, country, props) => {
    return {...Appellation, varieties: varieties, region:region, country:country}
  }
)

export const getWineByBlock = createSelector(
  orm,
  getPositionsByBlock,
  ( state, props) => state,
  ( state, props) => props,
  (orm, positions, state, props) => {
    if (!positions) return

    let results = []

    positions.filter(p => p.enabled).map(position => {
      let wine = getWineByPosition(state, position.id)
      if (!wine) return
      let appellation = getAppellationByWine(state, wine.id)
      let domain = getDomainByWine(state, wine.id)
      if (!appellation || !domain) return

      results.push({id:wine.id,color:appellation.color,x:position.x,y:position.y,quantity:wine.quantity,appellationId:appellation.id,domainId:domain.id,appellationName:appellation.name,domainName:domain.name,millesime:wine.millesime})
    })

    return results
  }
)

export const getWine = createSelector(
  orm.Wine,
  orm.Wine.appellation,
  orm.Wine.domain,
  orm.Wine.appellation.region,
  orm.Wine.appellation.region.country,
  ( state, props) => state,
  ( state, props) => props,
  (Wine, appellation, domain, region, country, state, props) => {
    return {...Wine, appellation: appellation, domain: domain, region: region, country: country, varieties: getVarietiesOfWine(state,props)}
  }
)

export const getVarietiesOfWine = createSelector(
  orm.Wine.varietyPercentages,
  (state, props) => state,
  (state, props) => props,
  (varietyPercentages, state, props) => {
    if (!varietyPercentages || varietyPercentages.length === 0) return
    let varieties = []
    for (var i = 0; i < varietyPercentages.length; i++) {
      if (!varietyPercentages[i].variety) continue
      let variety = getVarieties(state, varietyPercentages[i].variety.id)
      if (!variety) continue
      varieties.push({name:variety.name, id: varietyPercentages[i].variety.id, percent:varietyPercentages[i].variety.percent})
    }
    return sort(varieties,'percent','desc')
  }
)

export const getWines = createSelector(
  orm.Wine,
  orm.Wine.appellation,
  orm.Wine.domain,
  (Wines, appellations, domains) => {
    let results = []

    Wines.filter(w => w.enabled).map(w => {
      results.push({...w, appellation: appellations.find(a => a && a.id === w.appellation), domain: domains.find(d => d && d.id === w.domain)})
    })

    return results
  }
)

export const getCellarsByWine = createSelector(
  orm,
  getPositionsByWine,
  ( state, props) => state,
  (orm, positions, state) => {
    if (!positions) return

    let results = []

    positions.filter(p => p.enabled).map(p => {
      results.push(getBlockByPosition(state, p.id).cellar)
    })

    //Suppression des doublons
    return makeUniq(results)
  }
)

export const getCountriesForSort = createSelector(
  orm.Country,
  state => state,
  (countries, state) => {
    let results = makeUniq(countries.filter(c => c && c.enabled))
    results = results.filter(c => countWineOfCountry(state, c.id))

    return sort(results,'name')
  }
)

export const getRegionsForSort = createSelector(
  orm.Region,
  state => state,
  (regions, state) => {
    let results = makeUniq(regions.filter(r => r && r.enabled))
    results = results.filter(r => countWineOfRegion(state, r.id))

    return sort(results,'name')
  }
)

export const getDomainsForSort = createSelector(
  orm.Wine.domain,
  state => state,
  (domains, state) => {
    let results = makeUniq(domains.filter(d => d && d.enabled))
    results = results.filter(d => countWineOfDomain(state, d.id))

    return sort(results,'name')
  }
)

export const getAppellationsForSort = createSelector(
  orm.Wine.appellation,
  state => state,
  (appellations, state) => {
    let results = makeUniq(appellations.filter(a => a && a.enabled))
    results = results.filter(a => countWineOfAppellation(state, a.id))

    return sort(results,'name')
  }
)

export const countWineOfCountry = createSelector(
  orm.Country.regions,
  (state, props) => state,
  (state, props) => props,
  (regions, state, props) => {
    if (regions.filter(r => countWineOfRegion(state, r.id)).length > 0) return true
    return false
  }
)

export const getNumberWineOfCountry = createSelector(
  orm.Country.regions,
  (state, props) => state,
  (state, props) => props,
  (regions, state, props) => {
    let number = 0
    regions.filter(w => w.enabled).map(r => number+=getNumberWineOfRegion(state, r.id))
    return number
  }
)

export const countWineOfRegion = createSelector(
  orm.Region.appellations,
  (state, props) => state,
  (state, props) => props,
  (appellations, state, props) => {
    if (appellations.filter(a => countWineOfAppellation(state, a.id)).length > 0) return true
    return false
  }
)

export const getNumberWineOfRegion = createSelector(
  orm.Region.appellations,
  (state, props) => state,
  (state, props) => props,
  (appellations, state, props) => {
    let number = 0
    appellations.filter(w => w.enabled).map(a => number+=getNumberWineOfAppellation(state, a.id))
    return number
  }
)

export const countWineOfAppellation = createSelector(
  orm.Appellation.wines,
  ( state, props ) => props,
  (wines, props) => {
    if (wines.filter(w => w.quantity > 0).length > 0) return true
    return false
  }
)

export const getNumberWineOfAppellation = createSelector(
  orm.Appellation.wines,
  ( state, props ) => props,
  (wines, props) => {
    let number = 0
    wines.filter(w => w.enabled).map(w => number+=w.quantity)
    return number
  }
)

export const countWineOfDomain = createSelector(
  orm.Domain.wines,
  ( state, props ) => props,
  (wines, props) => {
    if (wines.filter(w => w.quantity > 0).length > 0) return true
    return false
  }
)

export const getNumberWineOfDomain = createSelector(
  orm.Domain.wines,
  ( state, props ) => props,
  (wines, props) => {
    let number = 0
    wines.filter(w => w.enabled).map(w => number+=w.quantity)
    return number
  }
)

export const getCountriesForBackup = createSelector(
  orm.Country,
  (countries) => {
    let results=[]
    countries.map(country => {
      if (!country.verified) results.push({localId:country.id,name:country.name,createdAt:country.createdAt,editedAt:country.editedAt,enabled:country.enabled})
    })
    return results
  }
);
export const getRegionsForBackup = createSelector(
  orm.Region,
  (regions) => {
    let results=[]
    regions.map(region => {
      if (!region.verified) results.push({localId:region.id,name:region.name,createdAt:region.createdAt,editedAt:region.editedAt,enabled:region.enabled,country:region.country})
    })
    return results
  }
);
export const getDomainsForBackup = createSelector(
  orm.Domain,
  (domains) => {
    let results=[]
    domains.map(domain => results.push({localId:domain.id,name:domain.name,region:domain.region,createdAt:domain.createdAt,editedAt:domain.editedAt,enabled:domain.enabled}))
    return results
  }
);
export const getAppellationsForBackup = createSelector(
  orm.Appellation,
  (appellations) => {
    let results=[]
    appellations.map(appellation => {
      if (!appellation.verified) results.push({localId:appellation.id,name:appellation.name,region:appellation.region,color:appellation.color,createdAt:appellation.createdAt,editedAt:appellation.editedAt,enabled:appellation.enabled,tempmin:appellation.tempmin,tempmax:appellation.tempmax,yearmin:appellation.yearmin,yearmax:appellation.yearmax})
    })
    return results
  }
);
export const getWinesForBackup = createSelector(
  orm.Wine,
  (wines) => {
    let results=[]
    wines.map(wine => results.push({localId:wine.id,millesime:parseInt(wine.millesime,10),enabled:wine.enabled,quantity:parseInt(wine.quantity,10),appellation:wine.appellation,domain:wine.domain,createdAt:wine.createdAt,editedAt:wine.editedAt,enabled:wine.enabled,tempmin:parseInt(wine.tempmin,10),tempmax:parseInt(wine.tempmax,10),yearmin:parseInt(wine.yearmin,10),yearmax:parseInt(wine.yearmax,10),bio:wine.bio,sparkling:wine.sparkling,size:parseInt(wine.size,10)}))
    return results
  }
);
export const getCellarsForBackup = createSelector(
  orm.Cellar,
  (cellars) => {
    let results=[]
    cellars.map(cellar => results.push({localId:cellar.id,name:cellar.name,createdAt:cellar.createdAt,editedAt:cellar.editedAt,enabled:cellar.enabled}))
    return results
  }
);
export const getBlocksForBackup = createSelector(
  orm.Block,
  (blocks) => {
    let results=[]
    blocks.map(block => results.push({localId:block.id,cellar:block.cellar,nbColumn:block.nbColumn,nbLine:block.nbLine,x:block.x,y:block.y,createdAt:block.createdAt,editedAt:block.editedAt,enabled:block.enabled,verticalAlignment:(block.verticalAlignment?block.verticalAlignment:'center'),horizontalAlignment:(block.horizontalAlignment?block.horizontalAlignment:'center')}))
    return results
  }
);
export const getPositionsForBackup = createSelector(
  orm.Position,
  (positions) => {
    let results=[]
    positions.map(position => results.push({localId:position.id,wine:position.wine,block:position.block,x:position.x,y:position.y,createdAt:position.createdAt,editedAt:position.editedAt,enabled:position.enabled}))
    return results
  }
);
export const getMyAppellation = createSelector(
  orm.Appellation,
  ( state, props) => state,
  (appellations, state) => {;
    let results = appellations.filter(a => a.verified !== true && a.enabled)
    results.map(a => a.quantity=getNumberWineOfAppellation(state, a.id))
    return results
  }
)
export const getMyDomain = createSelector(
  orm.Domain,
  ( state, props) => state,
  (domains, state) => {
    let results = domains.filter(d => d.verified !== true && d.enabled)
    results.map(d => d.quantity=getNumberWineOfDomain(state, d.id))
    return results
  }
)
export const getMyRegion = createSelector(
  orm.Region,
  ( state, props) => state,
  (regions, state) => {
    let results = regions.filter(r => r.verified !== true && r.enabled)
    results.map(r => r.quantity=getNumberWineOfRegion(state, r.id))
    return results
  }
)
export const getMyCountry = createSelector(
  orm.Country,
  ( state, props) => state,
  (countries, state) => {
    let results = countries.filter(c => c.verified !== true && c.enabled)
    results.map(c => c.quantity=getNumberWineOfCountry(state, c.id))
    return results
  }
)

//
// export const getWine = createSelector(
//   orm,
//   ( state, props) => props,
//   ({Wine}, props) => {
//     return Wine.withId(props)
//   }
// );

// export const countFreeWine = createSelector(
//   orm.Wine.positions,
//   orm.Wine,
//   (positions, wineArg) => {
//     //Si aucun paramètre ==> wineArg === tous les vins
//     //Si un id est fourni ==> wineArg === vin sélectionné
//
//     //Nombre de vins en vrac
//     let freeWine=0
//
//     //Si le vin recherché n'est pas établi
//     if (!wineArg || wineArg.enabled<1) return
//
//     if (wineArg.quantity) {
//     //Recherche une seule bouteille
//
//       //freeWine = quantité du vin - le nombre de positions associées à ce vin
//       freeWine = wineArg.quantity - objectLength(positions.filter(p => p.enabled))
//     } else {
//     //Recherche toutes les bouteilles
//
//       //Nombre total de positions
//       let countPos = 0
//
//       //On aditionne les quantités totales de tous les vins
//       wineArg.filter(w => w.enabled).map(
//         wine => {
//           freeWine = freeWine + parseInt(wine.quantity,10)
//         }
//       )
//
//       //On map toutes les positions de chaque vin et on les additionnent
//       for (let winePos of positions) {
//         countPos += objectLength(winePos.filter(p => p.enabled))
//       }
//
//       //Le nombre de vin en vrac = toutes les quantités - les quantités en cave
//       freeWine = freeWine - countPos
//     }
//
//     //Retourne false si aucune bouteille en vrac
//     return (freeWine <= 0 ? false : freeWine)
//   }
// )


// export const getSearchByDomain = createSelector(
//   orm,
//   (state, props) => props,
//   ({Search}, props) => {
//     return Search.all().toRefArray().filter(s => s.domains && s.domains.all().toRefArray().includes(props))
//   }
// )
// export const getSearchByAppellation = createSelector(
//   orm,
//   (state, props) => props,
//   ({Search}, props) => {
//     return Search.all().toRefArray().filter(s => s.appellation && s.appellation.all().toRefArray().includes(props))
//   }
// )
// export const getSearchsByAppellation = createSelector(
//   orm,
//   ( state, props) => props,
//   ({Appellation, Search}, props) => {
//     let searchs = []
//     let a = Appellation.all().toModelArray().filter(a => a.enabled).map(a => searchs.push(a.metaphone))
//
//     // let results = []
//     // for (let [i, search] of searchs.entries()) {
//     //   results.push({id:search.id,regions:search.regions.toRefArray(),appellations:search.appellations.toRefArray(),domains:search.domains.toRefArray(),entity:search[search.cat+'s'],cat:search.cat,name:search.name,metaphone:search.metaphone})
//     // }
//
//     return searchs
//   }
// )
// export const getEnabledDomains = createSelector(
//   orm.Domain,
//   state => state,
//   (domains, state) => {
//     domains = domains.filter(d => d.enabled)
//     // domains.map(d => {
//     //   d.wines = getWinesByDomain(state, d.id).filter(w => w.enabled)
//     //   d.search = getSearchByDomain(state, d.id).filter(w => w.enabled)
//     // })
//     return domains
//   }
// )
// export const getEnabledRegions = createSelector(
//   orm.Region,
//   regions => {
//     return regions.filter(r => r.enabled)
//   }
// )
// export const getEnabledAppellations = createSelector(
//   orm.Appellation,
//   state => state,
//   (appellations, state) => {
//     appellations = appellations.filter(a => a.enabled)
//     // appellations.map(a => {
//     //   // a.wines = getWinesByAppellation(state, a.id).filter(w => w.enabled)
//     //   // a.search = getSearchByAppellation(state, a.id).filter(w => w.enabled)
//     // })
//     return appellations
//   }
// )
// export const getWinesBySearch = createSelector(
//   orm,
//   ( state, props) => props,
//   ({Search}, props) => {
//     const search = Search.withId(props)
//
//     let wines
//     //On retourne tous les vins associée à la catégorie recherchée (appellation, domaine etc...)
//     switch (search.cat) {
//       case 'appellation':
//         wines = search.appellation
//         wines = wines.wines.all().toModelArray()
//         break
//       case 'domain':
//         wines = search.domain
//         wines = wines.wines.all().toModelArray()
//         break
//       case 'region':
//         wines = search.region
//         let appellations = wines.appellations.all().toModelArray()
//         wines = []
//         appellations.map( a =>
//           wines.push(a.wines.all().toModelArray())
//         )
//
//         //Add domain
//         // wines = appellations.wines.all().toModelArray()
//         break
//     }
//
//     return wines
//   }
// );
