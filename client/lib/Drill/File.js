
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

}

export default File;
