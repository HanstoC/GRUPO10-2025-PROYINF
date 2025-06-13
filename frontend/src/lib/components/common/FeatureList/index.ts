import FeatureListItem from "./FeatureListItem.svelte"
import FeatureListRoot from "./FeatureListRoot.svelte"

const FeatureList = {
    Root: FeatureListRoot,
    Item: FeatureListItem
} as const

export default FeatureList