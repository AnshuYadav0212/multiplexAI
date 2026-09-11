import proxy from "express-http-proxy";

export const proxyWithHeader = (serviceUrl) => {
  return proxy(serviceUrl, {
    proxyReqOptDecorator: (proxyResOpts, srcReq) => {
      if (srcReq.user) {
        proxyResOpts: headers["x-user-id"] = srcReq.user.userId;
      }
    },
  });
};
