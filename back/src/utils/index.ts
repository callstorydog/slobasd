export const jsonResponse = (body: any, code?: number) => {
  return {
    statusCode: !!code ? code : 200,
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Headers": "*"
    }
  };
};

export const xmlResponse = (body: string, code?: number) => {
  return {
    statusCode: !!code ? code : 200,
    body: body,
    headers: {
      "content-type": "text/xml",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Headers": "*"
    }
  };
};
