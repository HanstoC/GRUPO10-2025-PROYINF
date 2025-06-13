import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
import DropdownMenuLabel from "./DropdownMenuLabel.svelte";
import DropdownMenuItem from "./DropdownMenuItem.svelte";
import DropdownMenuContent from "./DropdownMenuContent.svelte";

const DropdownMenu = {
    Root: DropdownMenuPrimitive.Root,
    Trigger: DropdownMenuPrimitive.Trigger,
    Content: DropdownMenuContent,
    Sub: DropdownMenuPrimitive.Sub,
    Group: DropdownMenuPrimitive.Group,
    Separator: DropdownMenuPrimitive.Separator,
    Label: DropdownMenuLabel,
    Item: DropdownMenuItem
} as const

export default DropdownMenu;