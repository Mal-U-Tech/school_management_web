// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  users: {
    api: 'https://svemc526i4.execute-api.us-east-1.amazonaws.com/dev',
    bucket: 'https://users-ms-dev-bucket.s3.amazonaws.com'
  },
  permissions: {
    api: 'https://qvd5y9k6uc.execute-api.us-east-1.amazonaws.com/dev',
  },
  schools: {
    api: 'https://i0euk51qxd.execute-api.us-east-1.amazonaws.com/dev',
  },
  students: {
    api: 'https://gjbbidtdv5.execute-api.us-east-1.amazonaws.com/dev',
  },
  notifications: {
    api: 'https://4jcfe68xuf.execute-api.us-east-1.amazonaws.com/dev',
  },
  token: 'user',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
