export default (url, body = null) => new Promise((resolve, reject) => {
  const req = new XMLHttpRequest();
  req.open(body ? 'POST' : 'GET', url, true);
  if (body) {
    body = JSON.stringify(body);
    req.setRequestHeader('Content-type', 'application/json');
  }
  req.onreadystatechange = () => {
    let response;
    try {
      response = JSON.parse(req.responseText);
    } catch (err) {
      response = req.responseText;
    }
    if (req.readyState === 4)
      if (req.status === 200) resolve(response);
      else reject(response);
  };
  req.send(body);
});
