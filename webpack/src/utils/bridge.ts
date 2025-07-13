import EventEmitter from "events"

export class Bridge<Message> {
    private context: Worker = self as any
    private worker: Worker | null

    constructor(handler: () => Worker) {
        this.worker = Bridge.canInitWorker()
            ? handler()
            : null
    }

    on(handler: (message: Message) => void) {
        const bridge = Bridge.isWorkerContext()
            ? this.context
            : this.worker!
        
        bridge.onmessage = (event) => {
            handler(event.data)
        }
    }

    send(message: Message) {
        const bridge = Bridge.isWorkerContext()
            ? this.context
            : this.worker!

        bridge.postMessage(message)
    }

    close() {
        if (Bridge.isWorkerContext()) {
            throw new Error("Bridge cannot be closed in worker")
        }

        this.worker!.terminate()
    }
}

export namespace Bridge {
    export function canInitWorker() {
        return Bridge.isWorkerSupported()
            && !Bridge.isWorkerContext()
    }

    export function isWorkerSupported() {
        return typeof Worker !== "undefined"
    }

    export function isWorkerContext() {
        return typeof self === "object"
            && typeof importScripts === "function"
            && typeof postMessage === "function"
            && typeof Window === "undefined"
    }

    export class Key<Message extends { key: string; data: any }> {
        private context: Worker = self as any
        private worker: Worker | null
        private emitter = new EventEmitter()
    
        constructor(handler: () => Worker) {
            this.worker = Bridge.canInitWorker()
                ? handler()
                : null
            
            const bridge = Bridge.isWorkerContext()
                ? this.context
                : this.worker!

            if (!bridge) return
            bridge.onmessage = (event) => {
                this.emitter.emit(
                    event.data.key,
                    event.data.data
                )
            }
        }
    
        on<Key extends Message['key']>(key: Key, handler: (data: Extract<Message, { key: Key }>['data']) => void) {
            this.emitter.on(key, handler)
        }
    
        send<Key extends Message['key']>(key: Key, data: Extract<Message, { key: Key }>['data']) {
            const bridge = Bridge.isWorkerContext()
                ? this.context
                : this.worker!
    
            bridge.postMessage({ key, data })
        }
    
        close() {
            if (Bridge.isWorkerContext()) {
                throw new Error("Bridge cannot be closed in worker")
            }
    
            this.worker!.terminate()
        }
    }
}