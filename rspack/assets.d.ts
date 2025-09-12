declare module "*.css"
declare module "*.scss"
declare module "*.sass"

declare module "*.svg" {
    import type { FunctionComponent, SVGProps } from "react"

    const component: FunctionComponent<SVGProps<SVGSVGElement>>
    export default component
}

const string: string

declare module "*.png"
declare module "*.png?url" { export default string }
declare module "*.png?data" { export default string }

declare module "*.apng"
declare module "*.apng?url" { export default string }
declare module "*.apng?data" { export default string }

declare module "*.webp"
declare module "*.webp?url" { export default string }
declare module "*.webp?data" { export default string }

declare module "*.jpg"
declare module "*.jpg?url" { export default string }
declare module "*.jpg?data" { export default string }

declare module "*.jpeg"
declare module "*.jpeg?url" { export default string }
declare module "*.jpeg?data" { export default string }

declare module "*.gif"
declare module "*.gif?url" { export default string }
declare module "*.gif?data" { export default string }

declare module "*.webp"
declare module "*.webp?url" { export default string }
declare module "*.webp?data" { export default string }

declare module "*.ico"
declare module "*.ico?url" { export default string }
declare module "*.ico?data" { export default string }

declare module "*.svg"
declare module "*.svg?url" { export default string }
declare module "*.svg?data" { export default string }

declare module "*.bmp"
declare module "*.bmp?url" { export default string }
declare module "*.bmp?data" { export default string }

declare module "*.avif"
declare module "*.avif?url" { export default string }
declare module "*.avif?data" { export default string }

declare module "*.tif"
declare module "*.tif?url" { export default string }
declare module "*.tif?data" { export default string }

declare module "*.tiff"
declare module "*.tiff?url" { export default string }
declare module "*.tiff?data" { export default string }

declare module "*.woff"
declare module "*.woff?url" { export default string }
declare module "*.woff?data" { export default string }

declare module "*.woff2"
declare module "*.woff2?url" { export default string }
declare module "*.woff2?data" { export default string }

declare module "*.eot"
declare module "*.eot?url" { export default string }
declare module "*.eot?data" { export default string }

declare module "*.ttf"
declare module "*.ttf?url" { export default string }
declare module "*.ttf?data" { export default string }

declare module "*.otf"
declare module "*.otf?url" { export default string }
declare module "*.otf?data" { export default string }

declare module "*.mp4"
declare module "*.mp4?url" { export default string }
declare module "*.mp4?data" { export default string }

declare module "*.webm"
declare module "*.webm?url" { export default string }
declare module "*.webm?data" { export default string }

declare module "*.ogv"
declare module "*.ogv?url" { export default string }
declare module "*.ogv?data" { export default string }

declare module "*.mov"
declare module "*.mov?url" { export default string }
declare module "*.mov?data" { export default string }

declare module "*.avi"
declare module "*.avi?url" { export default string }
declare module "*.avi?data" { export default string }

declare module "*.mkv"
declare module "*.mkv?url" { export default string }
declare module "*.mkv?data" { export default string }

declare module "*.mp3"
declare module "*.mp3?url" { export default string }
declare module "*.mp3?data" { export default string }

declare module "*.wav"
declare module "*.wav?url" { export default string }
declare module "*.wav?data" { export default string }

declare module "*.ogg"
declare module "*.ogg?url" { export default string }
declare module "*.ogg?data" { export default string }

declare module "*.flac"
declare module "*.flac?url" { export default string }
declare module "*.flac?data" { export default string }

declare module "*.aac"
declare module "*.aac?url" { export default string }
declare module "*.aac?data" { export default string }

declare module "*.m4a"
declare module "*.m4a?url" { export default string }
declare module "*.m4a?data" { export default string }