export interface Space {
    from?: string;
    space: string;
    timestamp?: number;
    settings: string;
}
export interface Proposal {
    from?: string;
    space: string;
    timestamp?: number;
    type: string;
    title: string;
    body: string;
    choices: string[];
    start: number;
    end: number;
    snapshot: number;
    network: string;
    strategies: string;
    plugins: string;
    metadata: string;
}
export interface CancelProposal {
    from?: string;
    space: string;
    timestamp?: number;
    proposal: string;
}
export interface Vote {
    from?: string;
    space: string;
    timestamp?: number;
    proposal: string;
    type: string;
    choice: number | number[] | string;
    metadata: string;
}
export interface Follow {
    from?: string;
    space: string;
    timestamp?: number;
}
export interface Unfollow {
    from?: string;
    space: string;
    timestamp?: number;
}
export interface Subscribe {
    from?: string;
    space: string;
    timestamp?: number;
}
export interface Unsubscribe {
    from?: string;
    space: string;
    timestamp?: number;
}
export interface Alias {
    from?: string;
    alias: string;
    timestamp?: number;
}
export declare const spaceTypes: {
    Space: {
        name: string;
        type: string;
    }[];
};
export declare const proposalTypes: {
    Proposal: {
        name: string;
        type: string;
    }[];
};
export declare const cancelProposalTypes: {
    CancelProposal: {
        name: string;
        type: string;
    }[];
};
export declare const cancelProposal2Types: {
    CancelProposal: {
        name: string;
        type: string;
    }[];
};
export declare const voteTypes: {
    Vote: {
        name: string;
        type: string;
    }[];
};
export declare const voteArrayTypes: {
    Vote: {
        name: string;
        type: string;
    }[];
};
export declare const voteStringTypes: {
    Vote: {
        name: string;
        type: string;
    }[];
};
export declare const vote2Types: {
    Vote: {
        name: string;
        type: string;
    }[];
};
export declare const voteArray2Types: {
    Vote: {
        name: string;
        type: string;
    }[];
};
export declare const voteString2Types: {
    Vote: {
        name: string;
        type: string;
    }[];
};
export declare const followTypes: {
    Follow: {
        name: string;
        type: string;
    }[];
};
export declare const unfollowTypes: {
    Unfollow: {
        name: string;
        type: string;
    }[];
};
export declare const subscribeTypes: {
    Subscribe: {
        name: string;
        type: string;
    }[];
};
export declare const unsubscribeTypes: {
    Unsubscribe: {
        name: string;
        type: string;
    }[];
};
export declare const aliasTypes: {
    Alias: {
        name: string;
        type: string;
    }[];
};
