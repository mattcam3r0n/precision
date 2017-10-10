
class FileMember {
    constructor(member) {
        this.member = member;
        this.following = null;
        this.follower = null;
    }

    get following() {
        return this.following;
    }

    set following(fileMember) {
        this.following = fileMember;
    }

    get follower() {
        return this.follower;
    }

    set follower(fileMember) {
        this.follower = fileMember;
    }
}

export default FileMember;
