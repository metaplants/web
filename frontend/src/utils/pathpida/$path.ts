export const pagesPath = {
  "aframe": {
    $url: (url?: { hash?: string }) => ({ pathname: '/aframe' as const, hash: url?.hash })
  },
  "collector": {
    "MyNFT": {
      $url: (url?: { hash?: string }) => ({ pathname: '/collector/MyNFT' as const, hash: url?.hash })
    },
    "detail": {
      _detail: (detail: string | number) => ({
        $url: (url?: { hash?: string }) => ({ pathname: '/collector/detail/[detail]' as const, query: { detail }, hash: url?.hash })
      })
    }
  },
  "grower": {
    "mint": {
      $url: (url?: { hash?: string }) => ({ pathname: '/grower/mint' as const, hash: url?.hash })
    },
    "redeem": {
      $url: (url?: { hash?: string }) => ({ pathname: '/grower/redeem' as const, hash: url?.hash })
    },
    "test": {
      $url: (url?: { hash?: string }) => ({ pathname: '/grower/test' as const, hash: url?.hash })
    },
    "update": {
      $url: (url?: { hash?: string }) => ({ pathname: '/grower/update' as const, hash: url?.hash })
    }
  },
  "index_bk": {
    $url: (url?: { hash?: string }) => ({ pathname: '/index.bk' as const, hash: url?.hash })
  },
  $url: (url?: { hash?: string }) => ({ pathname: '/' as const, hash: url?.hash })
}

export type PagesPath = typeof pagesPath

export const staticPath = {
  agave_titanota_large_resized_glb: '/agave_titanota_large_resized.glb',
  agave_titanota_small_resized_glb: '/agave_titanota_small_resized.glb',
  favicon_ico: '/favicon.ico',
  logo_png: '/logo.png',
  sample_agabe_jpg: '/sample-agabe.jpg',
  sample_profile_png: '/sample-profile.png',
  vercel_svg: '/vercel.svg'
} as const

export type StaticPath = typeof staticPath
