import FormFooter from "./FormFooter.svelte";
import FormHeader from "./FormHeader.svelte";
import FormItem from "./FormItem.svelte";
import FormRoot from "./FormRoot.svelte";
import FormSubmit from "./FormSubmit.svelte";

const Form = {
    Item: FormItem,
    Root: FormRoot,
    Header: FormHeader,
    Footer: FormFooter,
    Submit: FormSubmit,
} as const

export default Form;