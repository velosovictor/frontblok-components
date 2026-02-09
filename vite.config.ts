import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: ['src'],
      outDir: 'dist',
      rollupTypes: true,
      bundledPackages: [],
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FrontblokComponents',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: (id) =>
        [
          'react',
          'react-dom',
          'react-dom/client',
          'react-router-dom',
          'react/jsx-runtime',
          '@emotion/react',
          '@emotion/styled',
          '@react-oauth/google',
          '@rationalbloks/frontblok-auth',
        ].includes(id) ||
        id.startsWith('@mui/material') ||
        id.startsWith('@mui/icons-material'),
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-dom/client': 'ReactDOMClient',
          'react-router-dom': 'ReactRouterDOM',
          '@mui/material': 'MuiMaterial',
          '@mui/icons-material': 'MuiIconsMaterial',
          '@emotion/react': 'EmotionReact',
          '@emotion/styled': 'EmotionStyled',
          '@react-oauth/google': 'ReactOAuthGoogle',
          '@rationalbloks/frontblok-auth': 'FrontblokAuth',
        },
      },
    },
    sourcemap: true,
    minify: false,
  },
});
