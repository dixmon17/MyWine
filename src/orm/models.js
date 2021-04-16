import { Model, fk, attr, many, oneToOne } from 'redux-orm'

import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { getUniqueId } from 'react-native-device-info'
//Test
function _setFirebase(db, entity) {
  let user = auth().currentUser

  if (!user || !user.emailVerified) return

  if (!entity) return
  const { id, ...entityWithoutId } = entity

  firestore()
  .collection(db)
  .doc(entity.id)
  .set({...entityWithoutId, owner:user.uid, device:getUniqueId()})
}

function _updateFirebase(db, entity) {
  let user = auth().currentUser

  if (!user || !user.emailVerified || entity.verified) return

  if (!entity) return
  const { id, ...entityWithoutId } = entity

  firestore()
  .collection(db)
  .doc(entity.id)
  .update({...entityWithoutId, device:getUniqueId()})
}

export class Cellar extends Model {
    static reducer(action, Cellar, session) {
      let entity
        switch (action.type) {
        case 'FIXTURES_CELLAR':
            if (!action.payload) return
            action.payload.map(c => {
              if (Cellar.withId(c.id) && Cellar.withId(c.id).editedAt < c.editedAt) {
                if (!c.enabled) {
                  Cellar.withId(c.id).delete()
                  return
                }
                Cellar.withId(c.id).update(c)
                return
              } else if (Cellar.withId(c.id) || !c.enabled) {
                return
              }
              Cellar.create(c)
            })
            break;
        case 'CREATE_CELLAR':
            entity=action.payload
            entity.createdAt=Date.now()
            entity.editedAt=Date.now()
            Cellar.create(entity);
            _setFirebase('cellars',entity)
            break;
        case 'UPDATE_CELLAR':
            entity=action.payload
            entity.editedAt=Date.now()
            Cellar.withId(entity.id).update(entity)
            _updateFirebase('cellars',entity)
            break;
        case 'DELETE_CELLAR':
            entity = Cellar.withId(action.payload)
            if (!entity) return
            entity.delete();
            _updateFirebase('cellars',{id:entity.id,enabled:false,editedAt:Date.now()})
            break;
        case 'RESET_CELLAR':
            Cellar.delete();
            break;
        }
        // Return value is ignored.
    }
}
Cellar.modelName = 'Cellar';
Cellar.fields = {
    id: attr(),
};

export class Block extends Model {
    static reducer(action, Block, session) {
      let entity
        switch (action.type) {
        case 'FIXTURES_BLOCK':
            if (!action.payload) return
            action.payload.map(b => {
              if (Block.withId(b.id) && Block.withId(b.id).editedAt < b.editedAt) {
                if (!b.enabled) {
                  Block.withId(b.id).delete()
                  return
                }
                Block.withId(b.id).update(b)
                return
              } else if (Block.withId(b.id) || !b.enabled) {
                return
              }
              Block.create(b);
            })
            break;
        case 'CREATE_BLOCK':
            entity=action.payload
            entity.createdAt=Date.now()
            entity.editedAt=Date.now()
            Block.create(entity);
            _setFirebase('cellars/'+entity.cellar+'/blocks',entity)
            break;
        case 'UPDATE_BLOCK':
            entity=action.payload
            entity.editedAt=Date.now()
            Block.withId(entity.id).update(entity)
            _updateFirebase('cellars/'+entity.cellar+'/blocks',entity)
            break;
        case 'DELETE_BLOCK':
            entity = Block.withId(action.payload)
            if (!entity) return
            entity.delete();
            _updateFirebase('cellars/'+entity.cellar.id+'/blocks',{id:entity.id,enabled:false,editedAt:Date.now()})
            break;
        case 'RESET_BLOCK':
            Block.delete();
            break;
        }
        // Return value is ignored.
    }
}
Block.modelName = 'Block';
Block.fields = {
    id: attr(),
    cellar: fk('Cellar', 'blocks'),
};

export class Position extends Model {
    static reducer(action, Position, session) {
      let entity, cellarId
        switch (action.type) {
        case 'FIXTURES_POSITION':
            if (!action.payload) return
            action.payload.map(p => {
              if (Position.withId(p.id) && Position.withId(p.id).editedAt < p.editedAt) {
                if (!p.enabled) {
                  Position.withId(p.id).delete()
                  return
                }
                Position.withId(p.id).update(p)
                return
              } else if (Position.withId(p.id) || !p.enabled) {
                return
              }
              Position.create(p);
            })
            break;
        case 'CREATE_POSITION':
            entity=action.payload
            entity.createdAt=Date.now()
            entity.editedAt=Date.now()
            cellarId=session.Block.withId(entity.block).cellar.id
            Position.create(entity)
            _setFirebase('cellars/'+cellarId+'/blocks/'+entity.block+'/positions',entity)
            break;
        case 'DELETE_POSITION_BY_ARRAY':
            entity=action.payload
            entity.map(p => {
              if (!session.Block.withId(p.block).cellar) return
              cellarId=session.Block.withId(p.block).cellar.id
              Position.withId(p.id).delete()
              _updateFirebase('cellars/'+cellarId+'/blocks/'+p.block+'/positions',{id:p.id,enabled:false,editedAt:Date.now()})
            })
            break;
        case 'DELETE_POSITION':
            entity=action.payload
            entity = Position.filter(p => p.x === entity.x && p.y === entity.y && p.block == entity.block).first();
            if (!entity) return
            entity.delete();
            _updateFirebase('cellars/'+entity.block.cellar.id+'/blocks/'+entity.block.id+'/positions',{id:entity.id,enabled:false,editedAt:Date.now()})
            // _updateFirebase('cellars/'+entity.block.cellar.id+'/blocks/'+entity.block.id+'positions',{id:entity.id,enabled:false})
            break;
        case 'RESET_POSITION':
            Position.delete();
            break;
        }
        // Return value is ignored.
    }
}
Position.modelName = 'Position';
Position.fields = {
    id: attr(),
    block: fk('Block', 'positions'),
    wine: fk('Wine', 'positions')
};

export class Wine extends Model {
    static reducer(action, Wine, session) {
      let entity
        switch (action.type) {
        case 'FIXTURES_WINE':
            if (!action.payload) return
            action.payload.map(w => {
              if (!Wine.withId(w.id)) {
                Wine.create(w);
                return
              }
              if (Wine.withId(w.id).editedAt < w.editedAt) {
                if (!w.enabled) {
                  Wine.withId(w.id).delete()
                  return
                }
                Wine.withId(w.id).update(w)
                return
              } else if (Wine.withId(w.id) || !w.enabled) {
                return
              }
            })
            break;
        case 'CREATE_WINE':
            entity=action.payload
            entity.createdAt=Date.now()
            entity.editedAt=Date.now()
            Wine.create(entity)
            _setFirebase('wines',entity)
            break;
        case 'UPDATE_WINE':
            entity=action.payload
            entity.editedAt=Date.now()
            Wine.withId(entity.id).update(entity)
            _updateFirebase('wines',entity)
            break;
        case 'DRINK_WINE':
            let wine = Wine.withId(action.payload)
            if (!wine) return
            let val = {id:wine.id,editedAt:Date.now(),quantity:wine.quantity-1}
            if (wine.quantity-1 > 0) {
              wine.update(val)
              _updateFirebase('wines',val)
            } else {
              wine.delete();
              _updateFirebase('wines',{id:wine.id,enabled:false,editedAt:Date.now()})
            }
            break;
        case 'DELETE_WINE':
            entity = Wine.withId(action.payload)
            if (!entity) return
            entity.delete();
            _updateFirebase('wines',{id:entity.id,enabled:false,editedAt:Date.now()})
            break;
        case 'RESET_WINE':
            Wine.delete();
            break;
        }
        // Return value is ignored.
    }
}
Wine.modelName = 'Wine';
Wine.fields = {
    id: attr(),
    appellation: fk('Appellation', 'wines'),
    domain: fk('Domain', 'wines'),
    varieties: many({
      to: 'Variety',
      relatedName: 'wines',
      through: 'VarietyPercentage',
      throughFields: ['variety', 'wine'],
    })
};

export class VarietyPercentage extends Model {}
VarietyPercentage.modelName = 'VarietyPercentage'
VarietyPercentage.fields = {
    id: attr(),
    variety: fk('Variety', 'varietyPercentages'),
    wine: fk('Wine', 'varietyPercentages')
}

export class Appellation extends Model {
    static reducer(action, Appellation, session) {
      let entity
        switch (action.type) {
        case 'FIXTURES_APPELLATION':
            if (!action.payload) return
            action.payload.map(a => {
              if (Appellation.withId(a.id) && Appellation.withId(a.id).editedAt < a.editedAt) {
                if (!a.enabled) {
                  Appellation.withId(a.id).delete()
                  return
                }
                Appellation.withId(a.id).update(a)
                return
              } else if (Appellation.withId(a.id) || !a.enabled) {
                return
              }
              Appellation.create(a);
            })
            break;
        case 'CREATE_APPELLATION':
            entity=action.payload
            entity.createdAt=Date.now()
            entity.editedAt=Date.now()
            Appellation.create(entity)
            _setFirebase('appellations',entity)
            break;
        case 'UPDATE_APPELLATION':
            entity=action.payload
            if (Appellation.withId(entity.id).verified) break
            entity.editedAt=Date.now()
            Appellation.withId(entity.id).update(entity)
            _updateFirebase('appellations',entity)
            break;
        case 'DELETE_APPELLATION':
            entity = Appellation.withId(action.payload)
            if (!entity) return
            entity.delete();
            _updateFirebase('appellations',{id:entity.id,enabled:false,editedAt:Date.now()})
            break;
        case 'RESET_APPELLATION':
            Appellation.filter(a => !a.verified).delete();
            break;
        }
        // Return value is ignored.
    }
}
Appellation.modelName = 'Appellation';
Appellation.fields = {
    id: attr(),
    region: fk('Region', 'appellations'),
    varieties: many('Variety', 'appellations')
};

export class Domain extends Model {
    static reducer(action, Domain, session) {
      let entity
        switch (action.type) {
        case 'FIXTURES_DOMAIN':
            if (!action.payload) return
            action.payload.map(d => {
              if (Domain.withId(d.id) && Domain.withId(d.id).editedAt < d.editedAt) {
                if (!d.enabled) {
                  Domain.withId(d.id).delete()
                  return
                }
                Domain.withId(d.id).update(d)
                return
              } else if (Domain.withId(d.id) || !d.enabled) {
                return
              }
              Domain.create(d);
            })
            break;
        case 'CREATE_DOMAIN':
            entity=action.payload
            entity.createdAt=Date.now()
            entity.editedAt=Date.now()
            Domain.create(entity)
            _setFirebase('domains',entity)
            break;
        case 'UPDATE_DOMAIN':
            entity=action.payload
            entity.editedAt=Date.now()
            Domain.withId(entity.id).update(entity);
            _updateFirebase('domains',entity)
            break;
        case 'DELETE_DOMAIN':
            entity = Domain.withId(action.payload)
            if (!entity) return
            entity.delete();
            _updateFirebase('domains',{id:entity.id,enabled:false,editedAt:Date.now()})
            break;
        case 'RESET_DOMAIN':
            Domain.delete();
            break;
        }
        // Return value is ignored.
    }
}
Domain.modelName = 'Domain';
Domain.fields = {
    id: attr(),
    region: fk('Region', 'domains'),
};

export class Region extends Model {
    static reducer(action, Region, session) {
      let entity
        switch (action.type) {
        case 'FIXTURES_REGION':
            if (!action.payload) return
            action.payload.map(r => {
              if (Region.withId(r.id) && Region.withId(r.id).editedAt < r.editedAt) {
                if (!r.enabled) {
                  Region.withId(r.id).delete()
                  return
                }
                Region.withId(r.id).update(r)
                return
              } else if (Region.withId(r.id) || !r.enabled) {
                return
              }
              Region.create(r);
            })
            break;
        case 'CREATE_REGION':
            entity=action.payload
            entity.createdAt=Date.now()
            entity.editedAt=Date.now()
            Region.create(entity)
            _setFirebase('regions',entity)
            break;
        case 'UPDATE_REGION':
            entity=action.payload
            if (Region.withId(entity.id).verified) break
            entity.editedAt=Date.now()
            Region.withId(entity.id).update(entity)
            _updateFirebase('regions',entity)
            break;
        case 'DELETE_REGION':
            entity = Region.withId(action.payload)
            if (!entity) return
            entity.delete();
            _updateFirebase('regions',{id:entity.id,enabled:false,editedAt:Date.now()})
            break;
        case 'RESET_REGION':
            Region.filter(r => !r.verified).delete();
            break;
        }
        // Return value is ignored.
    }
}
Region.modelName = 'Region';
Region.fields = {
    id: attr(),
    country: fk('Country', 'regions'),
};

export class Country extends Model {
    static reducer(action, Country, session) {
      let entity
        switch (action.type) {
        case 'FIXTURES_COUNTRY':
            if (!action.payload) return
            action.payload.map(c => {
              if (Country.withId(c.id) && Country.withId(c.id).editedAt < c.editedAt) {
                if (!c.enabled) {
                  Country.withId(c.id).delete()
                  return
                }
                Country.withId(c.id).update(c)
                return
              } else if (Country.withId(c.id) || !c.enabled) {
                return
              }
              Country.create(c);
            })
            break;
        case 'CREATE_COUNTRY':
            entity=action.payload
            entity.createdAt=Date.now()
            entity.editedAt=Date.now()
            Country.create(entity)
            _setFirebase('countries',entity)
            break;
        case 'UPDATE_COUNTRY':
            entity=action.payload
            if (Country.withId(entity.id).verified) break
            entity.editedAt=Date.now()
            Country.withId(entity.id).update(entity)
            _updateFirebase('countries',entity)
            break;
        case 'DELETE_COUNTRY':
            entity = Country.withId(action.payload)
            if (!entity) return
            entity.delete();
            _updateFirebase('countries',{id:entity.id,enabled:false,editedAt:Date.now()})
            break;
        case 'RESET_COUNTRY':
            Country.filter(c => !c.verified).delete();
            break;
        }
        // Return value is ignored.
    }
}
Country.modelName = 'Country';
Country.fields = {
    id: attr(),
};

export class Variety extends Model {
    static reducer(action, Variety, session) {
      let entity
        switch (action.type) {
        case 'FIXTURES_VARIETY':
            if (!action.payload) return
            action.payload.map(v => {
              if (Variety.withId(v.id) && Variety.withId(v.id).editedAt < v.editedAt) {
                if (!v.enabled) {
                  Variety.withId(v.id).delete()
                  return
                }
                Variety.withId(v.id).update(v)
                return
              } else if (Variety.withId(v.id) || !v.enabled) {
                return
              }
              Variety.create(v);
            })
            break;
        case 'RESET_VARIETY':
            Variety.filter(v => !v.verified).delete();
            break;
        }
    }
}
Variety.modelName = 'Variety';
Variety.fields = {
    id: attr(),
};
