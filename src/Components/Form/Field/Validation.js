export const requiredInput = value => value ? undefined : 'Entrez le nom de l\'appellation'
export const requiredPicker = value => value ? undefined : 'Sélectionnez l\'une des valeurs'
export const isNumber = value => !value || Number.isInteger(parseInt(value)) ? undefined : 'Veuillez sélectionner un nombre'
const minValue = value => value && value < 1900 ? 'Votre bouteille est trop vieille !' : undefined
const maxValue = value => value && value > 3000 ? 'Votre bouteille n\'est pas encore née !' : undefined
const minValueQuantity = value => value && value < 1 ? 'Vous devez au moins posséder une bouteille' : undefined
