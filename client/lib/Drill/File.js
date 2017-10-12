
class File {
    constructor(leadMember) {
        this.leader = leadMember;
        this.fileMembers = [leadMember];
        this.initMembers(leadMember);
    }

    initMembers(leader) {
        var m = leader.followedBy;
        while(m){
            this.fileMembers.push(m);
            m = m.followedBy;
        }
    }

    getLinePoints() {
        return this.fileMembers.map(fm => {
            return {
                x: fm.member.currentState.x,
                y: fm.member.currentState.y
            };
        });
    }

}

export default File;
