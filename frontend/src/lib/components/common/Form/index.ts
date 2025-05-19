import FormError from "./FormError.svelte";
import FormFooter from "./FormFooter.svelte";
import FormHeader from "./FormHeader.svelte";
import FormItem from "./FormItem.svelte";
import FormLabel from "./FormLabel.svelte";
import FormRoot from "./FormRoot.svelte";
import FormSubmit from "./FormSubmit.svelte";

const Form = {
    Item: FormItem,
    Label: FormLabel,
    Root: FormRoot,
    Header: FormHeader,
    Footer: FormFooter,
    Submit: FormSubmit,
    Error: FormError
}

export default Form;