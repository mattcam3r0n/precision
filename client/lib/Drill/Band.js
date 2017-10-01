import Direction from '/client/lib/Direction';

class Band {
    constructor() {
        this.members = [];
    }

    addMembers(newMembers) {
        this.members.push(...newMembers);
    }

}

export default Band;