export class FakeActivatedRoute {
  // When the component calls this.dialog.open(...) we'll return an object
  // with an afterClosed method that allows to subscribe to the dialog result observable.
  snapshot() { return { data: {} }; }
}
