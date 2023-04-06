import useMasterData from "./common";
import {Event} from "sekai-calculator";

export default function useEvents() {
    return useMasterData<Event>("events")
}
