import './app.css';
// @ts-ignore
import App from './App.svelte';

const app = new App({
  // eslint-disable-next-line no-undef
  target: document.getElementById('app'),
});

export default app;
