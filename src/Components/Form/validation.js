function returnErrors(obj,fields) {
  let errors=[]
  fields.map(f => {
    if (!obj[f]) errors.push(f)
  })
  if (errors.length>0) console.log('Validation missing :', errors, obj);
  return errors
}

export function validateCountry(obj) {
  console.log('Validation country');
  const fields=[
    'id',
    'name',
  ]

  if (returnErrors(obj,fields).length>0) return false
  return true
}

export function validateRegion(obj) {
  console.log('Validation region');
  const fields=[
    'id',
    'country',
    'name',
  ]

  if (returnErrors(obj,fields).length>0) return false
  return true
}

export function validateAppellation(obj) {
  console.log('Validation appellation');
  const fields=[
    'id',
    'region',
    'name',
    'color',
  ]

  if (returnErrors(obj,fields).length>0) return false
  return true
}

export function validateDomain(obj) {
  console.log('Validation domain');
  const fields=[
    'id',
    'name',
  ]

  if (returnErrors(obj,fields).length>0) return false
  return true
}

export function validateWine(obj) {
  console.log('Validation wine');
  const fields=[
    'id',
    'appellation',
    'domain',
    'quantity',
    'size',
  ]

  if (returnErrors(obj,fields).length>0) return false
  return true
}
