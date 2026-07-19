import { debounce } from "lodash";

export default {
    data() {
        return {
            requestSearch: "",
            updateRequestSearch: null,
        };
    },
    created() {
        this.updateRequestSearch = debounce((value) => {
            this.page = 1;
            this.requestSearch = value;
        }, 300);
    },
    beforeUnmount() {
        this.updateRequestSearch?.cancel();
    },
    watch: {
        search(value) {
            this.updateRequestSearch(value);
        },
    },
};
