import {useQuery} from "@tanstack/react-query";

export type Group = {
    id: string
    name: string
    icon?: string
    banner?: string
}

export function fetchGroups(): Group[] {
    return [
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
            banner: "https://img.moelong.com/images/LycorisRecoiltwnews/LycorisRecoiltwnews09.webp"
        },
    ]
}

export function useGroupsQuery() {
    return useQuery(["groups"], () => fetchGroups())
}