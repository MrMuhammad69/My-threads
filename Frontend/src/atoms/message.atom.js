import { atom } from "recoil";

export const conversationAtoms = atom({
    key: "conversationAtoms",
    default: [],
})

export const selectedConversationAtom = atom({
    key: "selectedConversation",
    default: {
        _id:'',
        userId: '',
        username: '',
        userProfilePic: ''
    }
})
