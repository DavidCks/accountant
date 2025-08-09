function createFetchError(fileURL: string, error: string) {
  const result = new Error(`Fetching "${fileURL}" failed: ${error}`);
  result.name = "FetchError";
  return result;
}

export function fetchFile(
  fileURL: string,
  options: { type?: XMLHttpRequestResponseType } = {},
) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("GET", fileURL, true);
    if (!options.type) {
      options.type = "arraybuffer";
    }
    request.responseType = options.type;

    request.onload = function () {
      if (request.status === 200) {
        resolve(request.response);
      } else {
        reject(createFetchError(fileURL, request.statusText));
      }
    };

    request.onerror = (error) =>
      reject(createFetchError(fileURL, String(error)));

    request.send();
  });
}
