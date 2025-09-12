// type fix for variables in style attribute
import "csstype"

declare module "csstype" {
    interface Properties {
        [index: `--${string}`]: any
    }
}