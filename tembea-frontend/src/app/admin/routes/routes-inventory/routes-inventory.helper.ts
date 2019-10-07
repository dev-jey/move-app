import { IRouteInventory } from '../../../shared/models/route-inventory.model';

class RenameRouteBatch {
  routesList: Array<any>;
  renamedBatches = [];
  sameRoute = [];
  newCharArray = [];
  batchLetter: string;
  lastRoute: IRouteInventory;

  constructor(
    routes: Array<any>,
    lastRoute
  ) {
    this.routesList = [...routes];
    this.lastRoute = lastRoute;
  }

  nextLetter(letter) {
    return letter === 'Z' ? 'A' : String.fromCharCode(letter.charCodeAt(0) + 1);
  }

  incrementChar(batchString) {
    const lastChar = batchString[batchString.length - 1];
    const remString = batchString.slice(0, batchString.length - 1);
    const newChar = lastChar === undefined ? 'A' : this.nextLetter(lastChar);
    this.newCharArray.unshift(newChar);
    if (lastChar === 'Z') {
      return this.incrementChar(remString);
    }
    const newBatchString = remString + [...this.newCharArray].join('');
    this.newCharArray = [];
    return newBatchString;
  }

  isSameBatch(sameBatch, routeBatch) {
    if (routeBatch && (sameBatch.name === routeBatch.name)) {
      return sameBatch.takeOff === routeBatch.takeOff;
    }
    return false;
  }

  updateBatches() {
    this.batchLetter = this.isSameBatch(this.sameRoute[0], this.lastRoute) ? this.lastRoute.batch : 'A';
    for (let k = 0; k < this.sameRoute.length; k++) {
      this.sameRoute[k].batch = this.batchLetter;
      this.batchLetter = this.incrementChar(this.batchLetter);
    }
    this.renamedBatches.push(...this.sameRoute);
    this.sameRoute = [];
  }

  renameRouteBatches() {
    while (this.routesList.length > 0) {
      this.sameRoute.push(this.routesList.shift());
      if (this.routesList.length === 0) {
        this.updateBatches();
        return this.renamedBatches;
      }
      if (!(this.isSameBatch(this.sameRoute[0], this.routesList[0]))) {
        this.updateBatches();
      }
    }
  }
}

export default RenameRouteBatch;
