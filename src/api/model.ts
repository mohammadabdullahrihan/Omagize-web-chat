import {Message} from "./MessageAPI";
import {UserType} from "./UserAPI";
import {Member} from "./GroupAPI";

export const users: UserType[] = [
    {
        id: "432423423432423",
        username: "MONEY",
        avatarUrl: "https://img.duotegame.com/article/contents/2022/07/15/small_2022071554302800.jpg",
        bannerUrl: "https://img.moelong.com/images/LycorisRecoiltwnews/LycorisRecoiltwnews09.webp"
    },
    {
        id: "132423423432453",
        username: "Kane",
    }
]

export const members: Member[] = users.map(user => ({
    id: user.id,
    username: user.username,
    avatar: user.avatarUrl
}))

export const groups = [
    {
        id: "54352234532456325433",
        name: "Study Group",
        icon: "https://img.duotegame.com/article/contents/2022/07/15/small_2022071554302800.jpg",
        banner: "https://img.moelong.com/images/LycorisRecoiltwnews/LycorisRecoiltwnews09.webp"
    },
    {
        id: "5435234532456335333",
        name: "My Funny Chat Group",
        icon: "https://img.duotegame.com/article/contents/2022/07/15/small_2022071554302800.jpg",
    },
]
const modalMessages = [
    {
        author: members[0],
        content: "It is normal",
        timestamp: new Date(Date.now())
    },
    {
        author: members[1],
        content: "Kane is a gay",
        timestamp: new Date(Date.now())
    },
    {
        author: members[0],
        content: "Oh, nice to meet you.\nI am a gay",
        timestamp: new Date(Date.now())
    }
]

export const messages: Message[] = [...Array(100)]
    .map((_, i) => ({
        id: i,
        ...modalMessages[Math.floor(Math.random() * modalMessages.length)]
    }))
    .map((m, i) => ({
        ...m,
        order_id: i,
        content: m.content + i
    })
)