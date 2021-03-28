export class LinkedListNode {
  value: number;
  next: LinkedListNode | null;
  constructor(value: number) {
    this.value = value;
    this.next = null;
  }
}

export class LinkedList {
  head: LinkedListNode;
  tail: LinkedListNode;
  constructor(value: number) {
    const node = new LinkedListNode(value);
    this.head = node;
    this.tail = node;
  }
}
