const path = require('path');
const url = require('url');

if (global.apiRoutePath) {
  const apiMountPath = path.join(location.pathname, path.relative(global.apiRoutePath, '/')).replace(/\/?$/, '/');
  const apiMountUri = url.resolve(`${location.protocol}//${location.host}`, apiMountPath);
  delete global.apiRoutePath;
  module.exports = apiMountUri;
  // console.log('yeah~', module.exports);
} else {
  module.exports = app.address;
  // console.log('bubu~', module.exports);
}
