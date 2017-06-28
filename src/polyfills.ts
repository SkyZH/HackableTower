import 'core-js/client/shim';

if (process.env.ENV === 'build') {
  // Production

} else {
  // Development
  Error['stackTraceLimit'] = Infinity;
}
