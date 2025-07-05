declare module "*.css"
declare module "*.scss"
declare module "*.sass"

declare module "*.svg" {
    import type { FunctionComponent, SVGProps } from "react"

    const component: FunctionComponent<SVGProps<SVGSVGElement>>
    export default component
}

const path: string

declare module "*.png"
declare module "*.png?url" { export default path }
declare module "*.png?data" { export default path }

declare module "*.apng"
declare module "*.apng?url" { export default path }
declare module "*.apng?data" { export default path }

declare module "*.webp"
declare module "*.webp?url" { export default path }
declare module "*.webp?data" { export default path }

declare module "*.jpg"
declare module "*.jpg?url" { export default path }
declare module "*.jpg?data" { export default path }

declare module "*.jpeg"
declare module "*.jpeg?url" { export default path }
declare module "*.jpeg?data" { export default path }

declare module "*.gif"
declare module "*.gif?url" { export default path }
declare module "*.gif?data" { export default path }

declare module "*.webp"
declare module "*.webp?url" { export default path }
declare module "*.webp?data" { export default path }

declare module "*.ico"
declare module "*.ico?url" { export default path }
declare module "*.ico?data" { export default path }

declare module "*.svg"
declare module "*.svg?url" { export default path }
declare module "*.svg?data" { export default path }

declare module "*.bmp"
declare module "*.bmp?url" { export default path }
declare module "*.bmp?data" { export default path }

declare module "*.avif"
declare module "*.avif?url" { export default path }
declare module "*.avif?data" { export default path }

declare module "*.tif"
declare module "*.tif?url" { export default path }
declare module "*.tif?data" { export default path }

declare module "*.tiff"
declare module "*.tiff?url" { export default path }
declare module "*.tiff?data" { export default path }

declare module "*.woff"
declare module "*.woff?url" { export default path }
declare module "*.woff?data" { export default path }

declare module "*.woff2"
declare module "*.woff2?url" { export default path }
declare module "*.woff2?data" { export default path }

declare module "*.eot"
declare module "*.eot?url" { export default path }
declare module "*.eot?data" { export default path }

declare module "*.ttf"
declare module "*.ttf?url" { export default path }
declare module "*.ttf?data" { export default path }

declare module "*.otf"
declare module "*.otf?url" { export default path }
declare module "*.otf?data" { export default path }

declare module "*.mp4"
declare module "*.mp4?url" { export default path }
declare module "*.mp4?data" { export default path }

declare module "*.webm"
declare module "*.webm?url" { export default path }
declare module "*.webm?data" { export default path }

declare module "*.ogv"
declare module "*.ogv?url" { export default path }
declare module "*.ogv?data" { export default path }

declare module "*.mov"
declare module "*.mov?url" { export default path }
declare module "*.mov?data" { export default path }

declare module "*.avi"
declare module "*.avi?url" { export default path }
declare module "*.avi?data" { export default path }

declare module "*.mkv"
declare module "*.mkv?url" { export default path }
declare module "*.mkv?data" { export default path }

declare module "*.mp3"
declare module "*.mp3?url" { export default path }
declare module "*.mp3?data" { export default path }

declare module "*.wav"
declare module "*.wav?url" { export default path }
declare module "*.wav?data" { export default path }

declare module "*.ogg"
declare module "*.ogg?url" { export default path }
declare module "*.ogg?data" { export default path }

declare module "*.flac"
declare module "*.flac?url" { export default path }
declare module "*.flac?data" { export default path }

declare module "*.aac"
declare module "*.aac?url" { export default path }
declare module "*.aac?data" { export default path }

declare module "*.m4a"
declare module "*.m4a?url" { export default path }
declare module "*.m4a?data" { export default path }