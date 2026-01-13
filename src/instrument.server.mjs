import * as Sentry from '@sentry/tanstackstart-react';
import process from 'node:process';

Sentry.init({
  dsn: 'https://c481136a7df47246afdeb1a022149c21@o4510700446023680.ingest.us.sentry.io/4510700449562624',

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  enableLogs: true,
  environment: process.env.NODE_ENVIRONMENT,
  enabled: process.env.NODE_ENVIRONMENT !== 'local',
});
