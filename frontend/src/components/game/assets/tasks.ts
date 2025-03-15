import { Task, TaskType } from "react-babylonjs";
import "@babylonjs/loaders";

export const textureTasks: Task[] = [
    {
        taskType: TaskType.Texture,
        name: "frame-border",
        url: "/assets/game/2d/frame_border.png"
    },
    {
        taskType: TaskType.Texture,
        name: "prison",
        url: "/assets/game/2d/prison.png"
    },
    {
        taskType: TaskType.Texture,
        name: "community-chest",
        url: "/assets/game/2d/community_chest.png"
    },
    {
        taskType: TaskType.Texture,
        name: "railroad",
        url: "/assets/game/2d/railroad.png"
    },
    {
        taskType: TaskType.Texture,
        name: "electric-company",
        url: "/assets/game/2d/electric_company.png"
    },
    {
        taskType: TaskType.Texture,
        name: "go-arrow",
        url: "/assets/game/2d/go_arrow.png"
    },
    {
        taskType: TaskType.Texture,
        name: "water-company",
        url: "/assets/game/2d/water_company.png"
    },
    {
        taskType: TaskType.Texture,
        name: "free-parking",
        url: "/assets/game/2d/free_parking.png"
    },
    {
        taskType: TaskType.Texture,
        name: "luxury-tax",
        url: "/assets/game/2d/luxury_tax.png"
    },
    {
        taskType: TaskType.Texture,
        name: "go-to-jail",
        url: "/assets/game/2d/go_to_jail.png"
    },
    {
        taskType: TaskType.Mesh,
        name: "player",
        rootUrl: "/assets/game/3d/token/",
        sceneFilename: "token.gltf"
    }
];