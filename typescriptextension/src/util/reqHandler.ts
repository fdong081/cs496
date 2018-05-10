import * as fetch from 'whatwg-fetch';

// for fuuture use when we implement the server side of the extension.
export async function reqJSON(url: string, obj?: any, method = 'GET'): Promise<any> {
  const body = obj !== undefined ? JSON.stringify(obj) : undefined;
  const res = await fetch.fetch(url, {
    method,
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  });

  if (res.ok) {
    return res.json();
  }

  // error handling
  let error: Error & {code?: number; response?: any};
  try {
    // assume it's json first; try to get the message out of it
    const json = await res.json();
    error = new Error(json.error);
  } catch (ex) {
    // otherwise just use the HTTP status code
    error = new Error(res.statusText);
  }
  
  error.code = res.status;
  error.response = res;
  throw error;
}

export async function postJSON(url: string, obj?: any): Promise<any> {
  return reqJSON(url, obj, 'POST');
}
