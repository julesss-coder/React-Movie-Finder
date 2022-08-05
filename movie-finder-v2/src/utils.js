
// checkStatus() and json() are called inside the fetch request in handleSubmit()
let checkStatus = response => {
  if (response.ok) {
    // .ok returns true if response status is 200-299
    return response;
  }
  throw new Error('Request was either a 404 or 500');
};

// Note that despite the method being named json(), the result is not JSON but is instead the result of taking JSON as input and parsing it to produce a JavaScript object.
// URL: https://developer.mozilla.org/en-US/docs/Web/API/Response/json
let json = response => response.json();

export {checkStatus, json };