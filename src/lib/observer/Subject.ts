import {IObserver} from "./observerTypes";

abstract class Subject<NotifyValue> {
    protected observers: IObserver<NotifyValue>[]
    protected registerObserver(observer: IObserver<NotifyValue>): void {
        if(!this.observers.includes(observer)) {
            this.observers.push(observer)
        }else {
            console.warn('This observer already registered')
        }
    }

    protected removeObserver(observer: IObserver<NotifyValue>): void {
        if(this.observers.includes(observer)) {
            this.observers.splice(this.observers.indexOf(observer), 1)
        }else {
            console.warn('No such observer you are trying to delete')
        }
    }

    protected notifyObservers(value: NotifyValue): void {
        this.observers.forEach(o => o.onUpdate(value))
    }
}

export default Subject