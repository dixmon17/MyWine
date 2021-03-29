import { ORM } from 'redux-orm';
import { Cellar, Block, Position, Wine, Region, Country, Appellation, Domain, Variety, VarietyPercentage } from './models';

const orm = new ORM({
  stateSelector: state => state.orm,
});
orm.register(Cellar, Block, Position, Wine, Region, Country, Appellation, Domain, Variety, VarietyPercentage);

export default orm;
