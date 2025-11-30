export class Queuets<T> {
  #accumulator: T[] = []

  enqueue(item: T):void {
    this.#accumulator.push(item)
  }

  dequeue():T| undefined {
    return this.#accumulator.shift()
  }

  isEmpty():boolean {
    return this.#accumulator.length === 0
  }
}
