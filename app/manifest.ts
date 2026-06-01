import { MetadataRoute } from 'next';
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Life OS',
    short_name: 'Life OS',
    description: 'Your personal operating system.',
    start_url: '/',
    display: 'standalone',
    background_color: '#05070B',
    theme_color: '#05070B',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
