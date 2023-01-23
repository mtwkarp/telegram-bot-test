import {ITimeAccessController} from "../types/types";

export default abstract class AbstractTimeAccessController implements ITimeAccessController{
    protected _accessible: boolean

    protected constructor() {
        this._accessible = false
    }
    protected setUnAccessible(): void {
        this.accessible = false
    }

    public abstract init(): void

    protected setAccessible(): void {
        this.accessible = true
    }

    public get accessible(): boolean {
        return this._accessible
    }

    protected set accessible(state: boolean) {
        this._accessible = state
    }

    protected abstract setAccessibilityStatusOnInit(): void

    protected abstract setAccessibilityModifiers(): void
}