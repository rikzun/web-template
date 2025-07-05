import {
    type Dispatch,
    type SetStateAction,
    useState as useReactState
} from "react"

export type State<T> = {
    value: T
    set: StateDispatcher<T>
} & (
    T extends boolean
        ? { invert: () => void }
        : {}
)

export type StateDispatcher<T> = Dispatch<SetStateAction<T>>

export function useState<T>(value: T): State<T> {
    const [state, setState] = useReactState<T>(value)

    return {
        value: state,
        set: setState,
        invert: () => (setState as StateDispatcher<boolean>)((v) => !v)
    }
}
