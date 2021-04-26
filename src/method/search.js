import Fuse from 'fuse.js'
import { removeAccent } from './object'
import levenshtein from 'js-levenshtein'

function removeSpace(string) {
  // return s.replace(/ /g,'')
  let first_character = string.charAt(0),
    last_character = string.substring(string.length - 1)
  if (first_character == ' ' || first_character == '-') {
    string = string.slice(1)
  }
  if (last_character == ' ' || last_character == '-') {
    string = string.slice(0, -1)
  }
  return string
}

function removeWord(string, word) {
  const options = {
    // isCaseSensitive: false,
    includeScore: true,
    // shouldSort: true,
    includeMatches: true,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    threshold: 0.3,
    // distance: 100,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
  }

  const fuse = new Fuse([string], options)

  let search = fuse.search(word)[0],
    local = { dif: 0, l: 0, m: 0 }

  if (search) {
    search.matches[0].indices.map(i => {
      if (i[1] - i[0] > local.dif) {
        local.dif = i[1] - i[0]
        local.l = i[0]
        local.m = i[1]
      }
    })

    string = search.matches[0].value.slice(local.l, local.m + 1)

    string = search.matches[0].value.replace(string, '')
  }

  return string
}

export function getResults(q, data, customOptions) {
  let searchs = [], id = 0

  if (data.regions) {
    data.regions.map(r => {
      searchs.push({ slug: removeSpace(removeAccent(r.name.replace(/-/g, ' '))).toLowerCase(), name: r.name, nameWithSpace: r.name.replace(/-/g, ' '), entity: [r], id: id.toString(), cat: 'region' })
      id++
    })
  }

  if (data.appellations) {
    data.appellations.map(a => {
      let slug = removeSpace(removeAccent(a.name.replace(/-/g, ' '))).toLowerCase()
      if (searchs.find(s => s.slug === slug && s.cat === 'appellation')) {
        searchs.find(s => s.slug === slug && s.cat === 'appellation').entity.push(a)
        searchs.find(s => s.slug === slug && s.cat === 'appellation').multiple = true
        return
      }
      searchs.push({ slug: removeSpace(slug), name: a.name, label: a.label, nameWithSpace: a.name.replace(/-/g, ' '), entity: [a], id: id.toString(), cat: 'appellation' })
      id++
    })
  }

  if (data.domains) {
    data.domains.map(d => {
      let slug = removeAccent(d.name.replace(/-/g, ' ')).toLowerCase()
      if (customOptions && customOptions.removeWord) slug = removeWord(slug, customOptions.removeWord)
      slug = removeSpace(slug)
      searchs.push({ slug: slug, name: d.name, nameWithSpace: d.name.replace(/-/g, ' '), entity: [d], id: id.toString(), cat: 'domain' })
      id++
    })
  }

  if (data.countries) {
    data.countries.map(c => {
      searchs.push({ slug: removeSpace(removeAccent(c.name.replace(/-/g, ' '))).toLowerCase(), name: c.name, nameWithSpace: c.name.replace(/-/g, ' '), entity: [c], id: id.toString(), cat: 'country' })
      id++
    })
  }

  if (data.varieties) {
    data.varieties.map(v => {
      searchs.push({ slug: removeSpace(removeAccent(v.name.replace(/-/g, ' '))).toLowerCase(), name: v.name, nameWithSpace: v.name.replace(/-/g, ' '), entity: [v], id: id.toString(), cat: 'variety' })
      id++
    })
  }

  const options = {
    // isCaseSensitive: false,
    includeScore: true,
    // shouldSort: true,
    // includeMatches: true,
    // findAllMatches: false,
    minMatchCharLength: (customOptions && customOptions.minMatchCharLength ? customOptions.minMatchCharLength : 1),
    // location: 0,
    threshold: (customOptions && customOptions.threshold ? customOptions.threshold : 0.4),
    distance: 0,
    // useExtendedSearch: false,
    ignoreLocation: (customOptions && customOptions.ignoreLocation ? customOptions.ignoreLocation : false),
    // ignoreFieldNorm: false,
    keys: [
      "slug",
    ]
  }

  if (customOptions && customOptions.levenshtein) {
    let results = []
    searchs.map(s => {
      let maxLength = q.length > s.slug.length ? q.length : s.slug.length,
        score = levenshtein(removeSpace(removeAccent(q.replace(/-/g, ' '))).toLowerCase(), s.slug) / maxLength
      if (score < options.threshold) results.push({ ...s, score: score, searched: q.toLowerCase(), levenshtein: score * maxLength })
    })
    return results
  }

  const fuse = new Fuse(searchs, options)

  const result = fuse.search(removeSpace(removeAccent(q.replace(/-/g, ' '))))

  return (result);
}
