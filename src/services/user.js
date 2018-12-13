import fetch from 'Common/fetch'

export function test () {
  return fetch('/api/test').then(response => {
    console.log('test result:', response) // eslint-disable-line no-console
    return response
  })
}
