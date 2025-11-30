export class Queuejs {
  #accumulator = []

  enqueue (item) {
    this.#accumulator.push(item)
  }

  dequeue () {
    return this.#accumulator.shift()
  }

  isEmpty () {
    return this.#accumulator.length === 0
  }
}
