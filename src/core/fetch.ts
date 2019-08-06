declare const COMPANIES_DATA_JSON: any;

export default function dataProvider(success: (data: Array<any>) => void, error: () => void) {
    fetch(COMPANIES_DATA_JSON)
        .then((response) => {
            return response.json();
        })
        .then(success)
        .catch(error)
}