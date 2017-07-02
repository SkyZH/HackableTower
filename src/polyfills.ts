import 'core-js/client/shim';
import 'reflect-metadata';

if (process.env.ENV === 'build') {
  // Production

} else {
  // Development
  Error['stackTraceLimit'] = Infinity;
}
