
export interface IObserver<A = any> {
    onUpdate(update: A): void
}