import { defineConfig } from 'vite';
import Server from './Server';

export default defineConfig({
  server: {
    hmr: false,    
  },
  plugins: [{
	  name: 'mock-server',
    configureServer: (server) => Server(server),
    apply: 'serve'
  }]
})