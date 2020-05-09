let arc = require('@architect/functions')

// Add a 'countryCode' attribute to the request
async function addCountryCode(request) {
  // AWS already does this with req.headers['CloudFront-Viewer-Country']
  // but for other cloud providers you can use your preferred geoIP module
  // ... or just pretend everyone is in New Zealand!
  request.countryCode = 'NZ'
  // The modified request will be used in subsequent steps
  return request
}

// Redirect if the user isn't logged in
async function validateUser(request) {
  let user = request.query.user
  let authorized = ['nic_cage']

  if(!authorized.includes(user)) {
    console.log(`You are not authorized`)
    return {
      status: 200,
      body: `Meditate further for authorization`
    }
  }
  console.log(`nic_cage is authorized`)
  //return nothing, so execution continues
}

// Show a HTML page. If we've reached this step we know the user is logged in, and we know their country code!
async function showDashboard(request) {
  console.log(`Showing dashboard`)
  let body = `
  <body>
    <h1>Dashboard</h1>
    <p>Hi! ${request.query.user} You are logged in from ${request.countryCode}! <a href="/logout">logout</a><p>
  </body>`
  return {
    status: 200,
    type: 'text/html',
    body
  }
}

exports.handler = arc.http.async(addCountryCode, validateUser, showDashboard)